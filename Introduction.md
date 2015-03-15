# Introduction #

This enhances the Chrome Developer Tools to draw a object diagram of scope variables.


# Details #

See [my blog](http://sandipchitale.blogspot.com/2014/03/javascript-object-diagram-integration.html) for detailed info.

This enhances the Chrome Developer Tools to draw a object diagram of scope variables. It uses jquery and an an excellent library (jquery-svg**.js) by [Keith Wood](http://keith-wood.name/svg.html).**

# What you really need #


  * front\_end\JSOD.css
  * front\_end\JSODScreen.js
  * front\_end\svg\jquery.svg.js
  * front\_end\svg\jquery.svganim.js
  * front\_end\svg\jquery-2.1.0.min.js

and from the file:

  * front\_end\ObjectPropertiesSection.js

this section:

```javascript

WebInspector.ObjectPropertyTreeElement.prototype = {
:
:
_onHideJSODScreen: function()
{
delete this._jsodScreen;
delete this._jsodScreenVisible;
},

_jsod: function(name, value) {
if (!this._jsodScreen)
this._jsodScreen = new WebInspector.JSODScreen(this._onHideJSODScreen.bind(this), name, value);

this._jsodScreen.showModal();
this._jsodScreenVisible = true;
},

_contextMenuFired: function(name, value, event)
{
var contextMenu = new WebInspector.ContextMenu(event);
this.populateContextMenu(contextMenu);
if (!value.value) {
// This is not a simple value - only then a diagram makes sense
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles() ? "JavaScriptobject diagram" : "JavaScript Object Diagram"), this._jsod.bind(this, name, value));
}
contextMenu.appendApplicableItems(value);
contextMenu.show();
},

```

and from file:

  * front\_end\inspector.html

the sections that import JSOD.css, JSODScreen.js and all files from svg/ folder.