//@input Component.Camera camera
//@input Asset.Material transparent
//@input Asset.Material transparent_green
//@input SceneObject[] figurines
//pre-defined order of construction - array contains parent details for each detail
//global.order = 

var orders = {
    0: {
        1: [0],
        2: [1],
        3: [1],
        4: [3],
        5: [4]
    },
    1: {
        1: [0],
        2: [0],
        3: [1, 2],
        4: [3],
        5: [3]
    }
}
    ;


global.figurineId = 1;

script.figurines.forEach(function (f, i) {
    if (i !== global.figurineId) f.enabled = false;
    else global.figurine = f;
});

global.order = orders[global.figurineId];

global.placedDetails = [0]; //game progress
var detailsArray = global.getChildren(global.figurine);  //get array of details directly from sceneObject (for reusability)
script.api.detailsArray = detailsArray;
var meshes = []; //array for individual meshes
var detailsToMeshes = [];

detailsArray.forEach(function (detail, i) {
    var meshV = detail.getFirstComponent("Component.MeshVisual");
    var existedMesh = meshes.find(function (m) { //check for mesh uniqueness
        return m.meshV.mesh.name === meshV.mesh.name; //.isSame( alternative
    });
    if (existedMesh) {
        existedMesh.details.push(i);
        detailsToMeshes.push(existedMesh);
    }
    else {
        var newMesh = {
            uid: meshes.length,
            meshV: meshV,
            material: meshV.getMaterial(0).clone(),
            details: [i]
        };
        meshes.push(newMesh);
        detailsToMeshes.push(newMesh);
    }

    if (i !== 0) { //for all details, except root, make em invisible
        detail.enabled = false;
    }
});

global.meshes = meshes;

function collisionHandler(eventData) {
    if (!global.dragged.obj) return; //if nothing dragged, omit collision check
    var currentMesh = global.dragged.obj.getFirstComponent("Component.MeshVisual");

    var checkedDetails = global.meshes[global.dragged.uid].details;

    for (var i = 0; i < checkedDetails.length; i++) {
        if (placedDetails.indexOf(checkedDetails[i]) !== -1) { print('continue'); continue; }; //checks if detail already placed, if so - skips over
        var parentsDetails = global.order[checkedDetails[i]] ? global.order[checkedDetails[i]] : [0]; //patch for a root (0 in order obj) detail TODO: remover after fixing menuItems
        //---------loop check for all parent details placement 
        var isAllParentsPlaced = true;
        var j = 0;
        while (isAllParentsPlaced && j < parentsDetails.length) {
            if (placedDetails.indexOf(parentsDetails[j]) === -1) isAllParentsPlaced = false;
            j++;
        }
        print(isAllParentsPlaced + '/' + checkedDetails[i]);
        //---------
        if (isAllParentsPlaced) {
            var draggedPos = script.camera.worldSpaceToScreenSpace(global.dragged.obj.getTransform().getWorldPosition());
            var detailPos = script.camera.worldSpaceToScreenSpace(detailsArray[checkedDetails[i]].getTransform().getWorldPosition());
            var DELTA = 0.03;
            if (Math.abs(draggedPos.x - detailPos.x) < DELTA && Math.abs(draggedPos.y - detailPos.y) < DELTA) { //distance check
                print('iffff');
                var detailMeshV = detailsArray[checkedDetails[i]].getFirstComponent("Component.MeshVisual");
                detailsArray[checkedDetails[i]].enabled = true;
                detailMeshV.clearMaterials();
                detailMeshV.addMaterial(script.transparent);
                currentMesh.clearMaterials();
                currentMesh.addMaterial(script.transparent_green);
            }
            else {
                print('name' + global.meshes[global.dragged.uid].meshV.name)
                detailsArray[checkedDetails[i]].enabled = false;
                currentMesh.clearMaterials();
                currentMesh.addMaterial(global.meshes[global.dragged.uid].material);
            }
        }
    };

};

var moveEvent = script.createEvent('TouchMoveEvent');
moveEvent.bind(collisionHandler);

global.updateProgress = function () {
    global.meshes[global.dragged.uid].details.forEach(function (detailIndex) {
        var detail = detailsArray[detailIndex];
        if (placedDetails.indexOf(detailIndex) === -1 && detail.enabled) {
            var detailMesh = detail.getFirstComponent("Component.MeshVisual");
            detailMesh.clearMaterials();
            detailMesh.addMaterial(global.meshes[global.dragged.uid].material);
            print(detailIndex + 'ind');
            global.placedDetails.push(detailIndex);
            global.dragged.obj.enabled = false;
        }
    });
}