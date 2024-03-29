package org.chromium.devtools.jsdoc.checks;

import com.google.javascript.rhino.head.Token;
import com.google.javascript.rhino.head.ast.AstNode;
import com.google.javascript.rhino.head.ast.FunctionCall;
import com.google.javascript.rhino.head.ast.FunctionNode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class FunctionReceiverChecker extends ContextTrackingChecker {

    private static final Set<String> FUNCTIONS_WITH_CALLBACK_RECEIVER_AS_SECOND_ARGUMENT =
            new HashSet<>();
    private static final String SUPPRESSION_HINT = "This check can be suppressed using "
            + "@suppressReceiverCheck annotation on function declaration.";
    static {
        // Array.prototype methods.
        FUNCTIONS_WITH_CALLBACK_RECEIVER_AS_SECOND_ARGUMENT.add("every");
        FUNCTIONS_WITH_CALLBACK_RECEIVER_AS_SECOND_ARGUMENT.add("filter");
        FUNCTIONS_WITH_CALLBACK_RECEIVER_AS_SECOND_ARGUMENT.add("forEach");
        FUNCTIONS_WITH_CALLBACK_RECEIVER_AS_SECOND_ARGUMENT.add("map");
        FUNCTIONS_WITH_CALLBACK_RECEIVER_AS_SECOND_ARGUMENT.add("some");
    }

    private final Map<String, FunctionRecord> nestedFunctionsByName = new HashMap<>();
    private final Map<String, Set<CallSite>> callSitesByFunctionName = new HashMap<>();
    private final Map<String, Set<SymbolicArgument>> symbolicArgumentsByName = new HashMap<>();
    private final Set<FunctionRecord> functionsRequiringThisAnnotation = new HashSet<>();

    @Override
    void enterNode(AstNode node) {
        switch (node.getType()) {
        case Token.CALL:
            handleCall((FunctionCall) node);
            break;
        case Token.FUNCTION: {
            handleFunction((FunctionNode) node);
            break;
        }
        case Token.THIS: {
            handleThis();
            break;
        }
        default:
            break;
        }
    }

    private void handleCall(FunctionCall functionCall) {
        String[] callParts = getContext().getNodeText(functionCall.getTarget()).split("\\.");
        String firstPart = callParts[0];
        List<AstNode> argumentNodes = functionCall.getArguments();
        List<String> actualArguments = argumentsForCall(argumentNodes);
        int partCount = callParts.length;
        String functionName = callParts[partCount - 1];

        saveSymbolicArguments(functionName, argumentNodes, actualArguments);

        boolean isBindCall = partCount > 1 && "bind".equals(functionName);
        if (isBindCall && partCount == 3 && "this".equals(firstPart) &&
            !(actualArguments.size() > 0 && "this".equals(actualArguments.get(0)))) {
                reportErrorAtNodeStart(functionCall,
                        "Member function can only be bound to 'this' as the receiver");
                return;
        }
        if (partCount > 2 || "this".equals(firstPart)) {
            return;
        }
        boolean hasReceiver = isBindCall && isReceiverSpecified(actualArguments);
        hasReceiver |= (partCount == 2) &&
                ("call".equals(functionName) || "apply".equals(functionName)) &&
                isReceiverSpecified(actualArguments);
        getOrCreateSetByKey(callSitesByFunctionName, firstPart)
                .add(new CallSite(hasReceiver, functionCall));
    }


    private void handleFunction(FunctionNode node) {
        FunctionRecord function = getState().getCurrentFunctionRecord();
        if (function == null) {
            return;
        }
        if (function.isTopLevelFunction()) {
            symbolicArgumentsByName.clear();
        } else {
            AstNode nameNode = AstUtil.getFunctionNameNode(node);
            if (nameNode == null) {
                return;
            }
            nestedFunctionsByName.put(getContext().getNodeText(nameNode), function);
        }
    }

    private void handleThis() {
        FunctionRecord function = getState().getCurrentFunctionRecord();
        if (function == null) {
            return;
        }
        if (!function.isTopLevelFunction() && !function.isConstructor) {
            functionsRequiringThisAnnotation.add(function);
        }
    }

    private List<String> argumentsForCall(List<AstNode> argumentNodes) {
        int argumentCount = argumentNodes.size();
        List<String> arguments = new ArrayList<>(argumentCount);
        for (AstNode argumentNode : argumentNodes) {
            arguments.add(getContext().getNodeText(argumentNode));
        }
        return arguments;
    }

    private void saveSymbolicArguments(
            String functionName, List<AstNode> argumentNodes, List<String> arguments) {
        int argumentCount = arguments.size();
        CheckedReceiverPresence receiverPresence = CheckedReceiverPresence.MISSING;
        if (FUNCTIONS_WITH_CALLBACK_RECEIVER_AS_SECOND_ARGUMENT.contains(functionName)) {
            if (argumentCount >= 2) {
                receiverPresence = CheckedReceiverPresence.PRESENT;
            }
        } else if ("addEventListener".equals(functionName) ||
                "removeEventListener".equals(functionName)) {
            String receiverArgument = argumentCount < 3 ? "" : arguments.get(2);
            switch (receiverArgument) {
            case "":
            case "true":
            case "false":
                receiverPresence = CheckedReceiverPresence.MISSING;
                break;
            case "this":
                receiverPresence = CheckedReceiverPresence.PRESENT;
                break;
            default:
                receiverPresence = CheckedReceiverPresence.IGNORE;
            }
        }

        for (int i = 0; i < argumentCount; ++i) {
            String argumentText = arguments.get(i);
            getOrCreateSetByKey(symbolicArgumentsByName, argumentText).add(
                    new SymbolicArgument(receiverPresence, argumentNodes.get(i)));
        }
    }

    private static <K, T> Set<T> getOrCreateSetByKey(Map<K, Set<T>> map, K key) {
        Set<T> set = map.get(key);
        if (set == null) {
            set = new HashSet<>();
            map.put(key, set);
        }
        return set;
    }

    private boolean isReceiverSpecified(List<String> arguments) {
        return arguments.size() > 0 && !"null".equals(arguments.get(0));
    }

    @Override
    void leaveNode(AstNode node) {
        if (node.getType() != Token.FUNCTION) {
            return;
        }

        ContextTrackingState state = getState();
        FunctionRecord function = state.getCurrentFunctionRecord();
        if (function == null) {
            return;
        }
        checkThisAnnotation(function);

        // The nested function checks are only run when leaving a top-level function.
        if (!function.isTopLevelFunction()) {
            return;
        }

        for (FunctionRecord record : nestedFunctionsByName.values()) {
            processFunctionUsesAsArgument(record, symbolicArgumentsByName.get(record.name));
            processFunctionCallSites(record, callSitesByFunctionName.get(record.name));
        }

        nestedFunctionsByName.clear();
        callSitesByFunctionName.clear();
        symbolicArgumentsByName.clear();
    }

    private void checkThisAnnotation(FunctionRecord function) {
        AstNode functionNameNode = AstUtil.getFunctionNameNode(function.functionNode);
        if (functionNameNode == null) {
            return;
        }
        boolean hasThisAnnotation = hasAnnotationTag(function.functionNode, "this");
        if (hasThisAnnotation == functionReferencesThis(function)) {
            return;
        }
        if (hasThisAnnotation) {
            if (!function.isTopLevelFunction()) {
                reportErrorAtNodeStart(
                        functionNameNode,
                        "@this annotation found for function not referencing 'this'");
            }
            return;
        } else {
            reportErrorAtNodeStart(
                    functionNameNode,
                    "@this annotation is required for functions referencing 'this'");
        }
    }

    private boolean functionReferencesThis(FunctionRecord function) {
        return functionsRequiringThisAnnotation.contains(function);
    }

    private void processFunctionCallSites(FunctionRecord function, Set<CallSite> callSites) {
        if (callSites == null) {
            return;
        }
        boolean functionReferencesThis = functionReferencesThis(function);
        for (CallSite callSite : callSites) {
            if (functionReferencesThis == callSite.hasReceiver || function.isConstructor) {
                continue;
            }
            if (callSite.hasReceiver) {
                reportErrorAtNodeStart(callSite.callNode,
                        "Receiver specified for a function not referencing 'this'");
            } else {
                reportErrorAtNodeStart(callSite.callNode,
                        "Receiver not specified for a function referencing 'this'");
            }
        }
    }

    private void processFunctionUsesAsArgument(
            FunctionRecord function, Set<SymbolicArgument> argumentUses) {
        if (argumentUses == null ||
                hasAnnotationTag(function.functionNode, "suppressReceiverCheck")) {
            return;
        }

        boolean referencesThis = functionReferencesThis(function);
        for (SymbolicArgument argument : argumentUses) {
            if (argument.receiverPresence == CheckedReceiverPresence.IGNORE) {
                continue;
            }
            boolean receiverProvided =
                    argument.receiverPresence == CheckedReceiverPresence.PRESENT;
            if (referencesThis == receiverProvided) {
                continue;
            }
            if (referencesThis) {
                reportErrorAtNodeStart(argument.node,
                        "Function referencing 'this' used as argument without " +
                         "a receiver. " + SUPPRESSION_HINT);
            } else {
                reportErrorAtNodeStart(argument.node,
                        "Function not referencing 'this' used as argument with " +
                         "a receiver. " + SUPPRESSION_HINT);
            }
        }
    }

    private static enum CheckedReceiverPresence {
        PRESENT,
        MISSING,
        IGNORE
    }

    private static class SymbolicArgument {
        CheckedReceiverPresence receiverPresence;
        AstNode node;

        public SymbolicArgument(CheckedReceiverPresence receiverPresence, AstNode node) {
            this.receiverPresence = receiverPresence;
            this.node = node;
        }
    }

    private static class CallSite {
        boolean hasReceiver;
        FunctionCall callNode;

        public CallSite(boolean hasReceiver, FunctionCall callNode) {
            this.hasReceiver = hasReceiver;
            this.callNode = callNode;
        }
    }
}
