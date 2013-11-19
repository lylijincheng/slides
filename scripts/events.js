// Events.
var hasPointerSupport = navigator.pointerEnabled || navigator.msPointerEnabled;

var _EVT_DOWN = 'ontouchstart' in window ? 'touchstart' : hasPointerSupport ? 'MSPointerDown' : 'mousedown';
var _EVT_MOVE = 'ontouchmove'  in window ? 'touchmove'  : hasPointerSupport ? 'MSPointerMove' : 'mousemove';
var _EVT_UP   = 'ontouchend'   in window ? 'touchend'   : hasPointerSupport ? 'MSPointerUp'   : 'mouseup';