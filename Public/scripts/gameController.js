// The camera used to render the scene
// @input Component.Camera camera
global.touchedPos = { x: 0, y: 0 };

global.dragged = {
    obj: null,
    uid: -1
};

function dragObject(obj) {
    // Convert screen space position to world space
    var objPos = script.camera.screenSpaceToWorldSpace(global.touchedPos, 270.0)
    // Apply the calculated position to an object
    obj.getTransform().setWorldPosition(objPos);
}

var moveEvent = script.createEvent('TouchMoveEvent');

moveEvent.bind(function (eventData) {
    if (global.dragged.obj) {
        global.touchedPos = eventData.getTouchPosition();
        dragObject(global.dragged.obj);
    }
});


var endMoveEvent = script.createEvent('TouchEndEvent');

endMoveEvent.bind(function (eventData) {
    if (global.dragged.obj !== null) {
        global.updateProgress();
        global.dragged.obj = null;
        global.dragged.uid = -1;
    }
});

/////////////////////////// utility functions
global.getChildren = function (sceneObj) {
    var count = sceneObj.getChildrenCount();
    var children = [];
    for (var i = 0; i < count; i++) {
        var child = sceneObj.getChild(i);
        children.push(child);
    }
    return children;
}
//////// Polyfill for Array.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}
////////////////////////////////////////////
