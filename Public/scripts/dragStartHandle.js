//function startDrag() {
    if (global.dragged.obj === null) {
        global.dragged.obj = script.getSceneObject();
        global.dragged.uid = script.api.uid;
        print('gdi'+ global.dragged.uid);
    }
    else print('startDrag without obj');
/*}
var startDragEvent = script.createEvent('TouchStartEvent');
startDragEvent.bind(startDrag);*/