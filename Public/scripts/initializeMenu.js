//@input Asset.ObjectPrefab prefab
//@input Component.ScriptComponent detailsScript

var _self = script.getSceneObject();
var detailsArray = script.detailsScript.api.detailsArray;
var menuItems = [];
var menuPosition = _self.getTransform().getWorldPosition();
detailsArray.forEach(function (detail, i) {
    var meshObj = global.meshes.find(function (m) {
        return m.details.indexOf(i) !== -1
    })
    var menuItem = script.prefab.instantiate(_self);
    var dragHandle = menuItem.getFirstComponent('Component.Script');
    dragHandle.api.uid = meshObj.uid;

    var menuMesh = menuItem.getFirstComponent('Component.MeshVisual');
    menuMesh.mesh = meshObj.meshV.mesh;
    menuMesh.clearMaterials();
    menuMesh.addMaterial(meshObj.material);

    menuItem.getTransform().setWorldPosition(new vec3(-100+30*i, -100,0));
    menuItem.getTransform().setLocalScale(new vec3(0.5,0.5,0.5));

    var touchComponent = menuItem.getFirstComponent('Component.TouchComponent');
    touchComponent.addMeshVisual(menuMesh);
    // remove root detail
    if (i === 0) menuItem.enabled = false 
    menuItems.push(menuItem);
});

global.menuItems = menuItems;