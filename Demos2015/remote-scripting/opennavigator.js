// Paste this code into the Workbench Tools window and click Node Eval.

// Create window with Slide Navigator.
GUI = require('nw.gui')
MyWindow = GUI.Window.open(
  'file:///Users/miki/code/evo-demos/Demos2015/remote-scripting/navigator.html',
  {
    title: 'Slide Navigator',
    toolbar: false,
    frame: true,
    width: 400,
    height: 600
  }
)
