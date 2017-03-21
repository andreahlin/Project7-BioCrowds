
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Agent from './agent.js'

// mesh that you want the points to get to 
  var geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
  var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  var torusKnot = new THREE.Mesh( geometry, material );
  var targetArr = geometry.vertices; 
//----------//----------//----------//----------//----------//----------//----------
  // particles ... ok 
var starsGeometry = new THREE.Geometry();
for ( var i = 0; i < geometry.vertices.length; i ++ ) {
  var star = new THREE.Vector3();
  star.x = THREE.Math.randFloatSpread( 200 );
  star.y = THREE.Math.randFloatSpread( 200 );
  star.z = THREE.Math.randFloatSpread( 200 );
  starsGeometry.vertices.push( star );
}
var starsMaterial = new THREE.PointsMaterial( { color: 0xffffff, size: 0.7 } )
var starField = new THREE.Points( starsGeometry, starsMaterial );
starField.geometry.dynamic = true; 
starField.geometry.verticesNeedUpdate = true;
var currArr = starsGeometry.vertices; 
var currObj = starField;
//----------//----------//----------//----------//----------//----------//----------

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // set camera position
  camera.position.set(100, 10, 100);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // commenting out the adamCube
  // scene.add(adamCube);

  // var octo = new THREE.OctahedronGeometry(1, 0); 

  // scene.add( torusKnot );
  
scene.add(starField);
currArr = starsGeometry.vertices; 
currObj = starField;

gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
}

// called on frame updates
function onUpdate(framework) {
      for (var i = 0; i < targetArr.length; i++) {
        var curr = currArr[i];
        var tar = targetArr[i];
        var dist = tar.distanceTo(curr); 
        // var value = (i / 1600.0) * tar + (1600.0 - i) / 1600.0 * curr;
        var value = new THREE.Vector3((i / 1600.0) * tar.x + (1600.0 - i) / 1600.0 * curr.x,
                                      (i / 1600.0) * tar.y + (1600.0 - i) / 1600.0 * curr.y,
                                      (i / 1600.0) * tar.z + (1600.0 - i) / 1600.0 * curr.z,)
        // if (i % 20 == 0) {
            currObj.geometry.vertices[i].set(value.x, value.y, value.z); 
            // console.log(value.x);
            // console.log(value.y); 
            // currObj.geometry.verticesNeedUpdate = true;
        // }
      }
      currObj.geometry.verticesNeedUpdate = true;

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);