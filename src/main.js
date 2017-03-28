
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Agent from './agent.js'

// variables 
// divide grid into 10 sections of 10 
var dimension = 100; // size of playing field
var markerArr = [];  // holds the markers 
var agentArr = [];   // holds the agents 
var ageBub = 10;     // size of agent bubble
var cylinder = null;
var cylinder2 = null; // idk
var linesArr = [];  // hold the lines that were drawn in the scene 

//----------//----------//----------//----------//----------//----------//----------
  // create a struct for markers 
  function Marker(position) {
    // position is a THREE.vector3
    // owner is an Agent object 
      this.pos = position;
      this.owner = null;
  }

  // initialize a plane for the agents to move on 
  function initField(theScene) {
    var planeGeo = new THREE.PlaneBufferGeometry(dimension, dimension, 100, 100);
    var material = new THREE.MeshBasicMaterial( {color: 0xb0bfff, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( planeGeo, material );
    plane.rotateX(Math.PI / 2.0) ;
    plane.position.set(0,-2,0);
    // add in a grid
    // var gridHelper = new THREE.GridHelper( dimension, dimension);
    // theScene.add( gridHelper );
    theScene.add( plane );
  }

  // noise function to place markers 
  function noise1(x, y) {
    // return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    var vec1 = new THREE.Vector2(x,y);
    var vec2 = new THREE.Vector2(12.9898,78.233);
    var vec3 = vec1.dot(vec2);
    vec3 = Math.sin(vec3);
    vec3 = (vec3 * 43758.5453) % 1;
    return vec3; 
  } 

  function noise2(x, y) {
    // return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    var vec1 = new THREE.Vector2(x,y);
    var vec2 = new THREE.Vector2(201.202,97.1023);
    var vec3 = vec1.dot(vec2);
    vec3 = Math.cos(vec3);
    vec3 = (vec3 * 100002938.5453) % 1;
    return vec3; 
  } 

  // place the markers in the field 
  // returns array of the marker objects 
  function initMarkers() {
    // how 
    for (var i = -40; i < 40; i+=4 ) {
      for (var j = -40; j < 40; j+=4) {
        // create a bunch of markers, use noise to displace their position
        var n1 = noise1(i, j); 
        var n2 = noise2(i, j);
        var marker = new Marker(new THREE.Vector3(i + n1 * 2, 0, j + n2 * 3));
        markerArr.push(marker);  
      }
    }
    return markerArr; 
  }

  // loops through the markers to draw them to the scene (not necessary) 
  function drawMarkers(theScene) {
    for (var i = 0; i < markerArr.length; i++) {
      // create a tiny cube for each marker 
    var geometry = new THREE.BoxBufferGeometry( .3, 2, .3 );
    var material = new THREE.MeshLambertMaterial( {color: 0xc66175} );
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(markerArr[i].pos.x, markerArr[i].pos.y - 1, markerArr[i].pos.z);
    theScene.add( cube );
    }
  }

  // draw a relationship of agent ownership of markers 
  function drawRelation(theScene, agent, marker) {
    // console.log("position of agent: " + agent.pos.x);
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3( agent.pos.x, agent.pos.y, agent.pos.z ),
      new THREE.Vector3( marker.pos.x, marker.pos.y, marker.pos.z )
    );
    var material = new THREE.MeshLambertMaterial( {color: 0x64a89e} );
    var line = new THREE.Line( geometry, material );
    theScene.add( line );
    linesArr.push(line); 
  }

  // remove all the lines from the scene and reset the lineArr at each update
  function clearLineArr(scene) {
    for (var i = 0; i < linesArr.length; i ++) {
      scene.remove(linesArr[i]);
    }
    linesArr = []; 
  }

  // iterate through agentArr, assign ownership
  function determineOwners(scene, agent) {
    // clear the previous owners 
    agent.markers = []; 
    // clear the marker's owner?? ummm yea i mean i guess 

    // determine the four closest grid cells near agent
    // check all of the markers in the four grid cells
    // if dist(agent, marker) < agentBubble, then marker.owner = agent. 
    var xNeg = agent.pos.x - 15; 
    var xPos = agent.pos.x + 15;
    var yNeg = agent.pos.y - 10;
    var yPos = agent.pos.y + 10;
    // check all markers
    for (var i = 0; i < markerArr.length; i++) {
      // check all markers in the grid
      if (markerArr[i].pos.x > xNeg && markerArr[i].pos.x < xPos) {
        if (markerArr[i].pos.y > yNeg && markerArr[i].pos.y < yPos) {
          // compare agent/marker dist with radius
          var pos = agent.pos;
          if (pos.distanceTo(markerArr[i].pos) <= ageBub) {
            // set owner of marker
           // if (markerArr[i].owner == null) {
              markerArr[i].owner = agent; //DOES THIS SAVE A COPY??? IDK IKD IKD
              agent.markers.push(markerArr[i]); // push the markers onto the arrray 
              // draw the relationship .. for now
              // WHY ARENT THE RELATIONS BEING REDRAWN???? IDONT KNOWWWWWW?W?W?W?W?W?WW?
              drawRelation(scene, agent, markerArr[i]);  
           // }
          }
        }
      }
    }
  }

  // compute weighted average of marker influences
  // return a vector which is the direction that the 
  function computeVector() {
    // idk
    return null;  
  }

  function moveAgent(agent) { 
    var displace = -0.1;
    agent.mesh.translateX(displace);
    agent.pos = new THREE.Vector3(agent.pos.x + displace, agent.pos.y , agent.pos.z);  
  }

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

  // initialize light
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 2, 2);
  directionalLight.position.multiplyScalar(1);
  scene.add(directionalLight);
  // add in an ambient light 
  var light = new THREE.AmbientLight( 0x404040, 1.8 );
  scene.add(light);

  // axis helper
  var axisHelper = new THREE.AxisHelper( 30 );
  scene.add( axisHelper );

  // create base plane
  initField(scene);

  // generate and scatter markers 
  markerArr = initMarkers(); 
  drawMarkers(scene); 

  // initialize two agents to begin
  // first agent is green, second agent is yellow
  // agent 1 
  var testAgent = new Agent(scene);  
  testAgent.pos = new THREE.Vector3(20,0,20);
  testAgent.vel = 7.0; 
  testAgent.goal = new THREE.Vector3(-20,0,-20); // goal is the diagonal
  testAgent.scene = scene; 
  testAgent.orientation = new THREE.Vector3(0,0,0); // currently origin 
  testAgent.markers = [];
  var geometry = new THREE.CylinderBufferGeometry( 1, 1, 4, 20 );
  var material = new THREE.MeshLambertMaterial( {color: 0x64a89e} );
  var cylinder = new THREE.Mesh( geometry, material );
  testAgent.mesh = cylinder; 
  cylinder.position.set(testAgent.pos.x, testAgent.pos.y, testAgent.pos.z);
  // draw agent to scene 
  scene.add( cylinder );
  // add agent to the agentArr
  agentArr.push(testAgent); 

  // agent 2 
  var testAgent2 = new Agent(scene);  
  testAgent2.pos = new THREE.Vector3(-20,0,-20);
  testAgent2.vel = 7; 
  testAgent2.goal = new THREE.Vector3(20,0,20); // goal is the diagonal
  testAgent2.scene = scene; 
  testAgent2.orientation = new THREE.Vector3(0,0,0); // currently origin 
  testAgent2.markers = [];
  material = new THREE.MeshLambertMaterial( {color: 0xf7cc7b} );
  var cylinder2 = new THREE.Mesh( geometry, material );
  cylinder2.position.set(testAgent2.pos.x, testAgent2.pos.y, testAgent2.pos.z);
  testAgent2.mesh = cylinder2; 
  // draw agent to scene 
  scene.add( cylinder2 );
  // add agent to the agentArr
  agentArr.push(testAgent2); 
  console.log("agent array in onload: " + agentArr);

  // iterate through all agentArr and call this function.
  for (var i = 0; i < agentArr.length; i++) {
    determineOwners(scene, agentArr[i]);
  }

  // Test: draw ownership relation
  // drawRelation(scene, agentArr[1], markerArr[0]); 
  // drawRelation(scene, agentArr[0], markerArr[290]); 

  // then update : do the biocrowds function thing or whatever ... lol 

gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
// TODO: add gui functionality so that you can toggle between two different
}

// called on frame updates
function onUpdate(framework) {
  var scene = framework.scene;
  // call redraw function 
  if (agentArr.length != 0) {
      clearLineArr(scene);
      moveAgent(agentArr[0]); 
      determineOwners(scene, agentArr[0]);
  }

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);