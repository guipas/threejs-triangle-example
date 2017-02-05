var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
// var camera = new THREE.OrthographicCamera( window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / 2, 1, 1000 );
// camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
var camera = new THREE.OrthographicCamera( window.innerWidth / -200, window.innerWidth / 200, window.innerHeight / 200, window.innerHeight / -200, -500, 1000 );
  			// 	camera.position.x = 0;
  			// 	camera.position.y = 0;
				// camera.position.z = 10;
        camera.position.set(1,1,3);
        camera.rotation.x = -33 * Math.PI / 180;
        camera.rotation.y =  33 * Math.PI / 180;
scene.add(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const generateTriangle  = pos => {
  var geom = new THREE.Geometry();
  geom.vertices.push(new THREE.Vector3(0, 0, 0.2));
  geom.vertices.push(new THREE.Vector3(1, 0, 0.2));
  geom.vertices.push(new THREE.Vector3(0, 0, 1));
  var face = new THREE.Face3(0, 1, 2);
  face.vertexColors.push(new THREE.Color(0xff0000));
  face.vertexColors.push(new THREE.Color(0x00ff00));
  face.vertexColors.push(new THREE.Color(0x0000ff));
  geom.faces.push(face);
  // material
  var mat = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors, side: THREE.DoubleSide })
  //  mesh
  var mesh = new THREE.Mesh(geom, mat);

  return mesh;
}

const generateTrianglesPlane = (size = 10) => {
  let meshes = [];

  for (var i = 0; i < size; i++) {
    meshes.push([]);
    const even = i % 2;
    const delta = 0.5 * even;
    for (var j = 0; j < size; j++) {
      meshes[i].push([]);
      // triangle 1
      var geom = new THREE.Geometry();
      geom.verticesNeedUpdate = true;
      geom.dynamic = true;
      geom.vertices.push(new THREE.Vector3(i, 0, j));
      geom.vertices.push(new THREE.Vector3(i+1, 0, j));
      geom.vertices.push(new THREE.Vector3(i, 0, j+1));
      var face = new THREE.Face3(0, 1, 2);
      face.vertexColors.push(new THREE.Color(0xff00dd));
      face.vertexColors.push(new THREE.Color(0xaaff55));
      face.vertexColors.push(new THREE.Color(0xaa99ff));
      geom.faces.push(face);
      // material
      var mat = new THREE.MeshBasicMaterial( {shading: THREE.SmoothShading,reflectivity: 0.5,vertexColors: THREE.VertexColors, side: THREE.DoubleSide })
      // var mat = new THREE.MeshPhongMaterial({})
      //  mesh
      var mesh = new THREE.Mesh(geom, mat);
      // meshes.push(mesh);
      meshes[i][j] = [mesh];

      // triangle 2
      var geom = new THREE.Geometry();
      geom.vertices.push(new THREE.Vector3(i+1, 0, j));
      geom.vertices.push(new THREE.Vector3(i+1, 0, j+1));
      geom.vertices.push(new THREE.Vector3(i, 0, j+1));
      var face = new THREE.Face3(0, 1, 2);
      face.vertexColors.push(new THREE.Color(0xff00dd));
      face.vertexColors.push(new THREE.Color(0xaaff55));
      face.vertexColors.push(new THREE.Color(0xaa99ff));
      geom.faces.push(face);
      // material
      var mat = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors, side: THREE.DoubleSide })
      //  mesh
      var mesh = new THREE.Mesh(geom, mat);
      // meshes.push(mesh);

      meshes[i][j].push(mesh);

      // const triangle = {
      //   v0 : [i, j],
      //   v1 : [i + 1, j],
      //   v2 : [i, j + 1]
      // }
      // const triangle2 = {
      //   v0 : [i+1, j],
      //   v1 : [i+1, j+1],
      //   v2 : [i, j+1]
      // }
    }
  }
  return meshes;
}


const generatePlaneHeights = (size, step) => {
  const heights = [];
  for (var i = 0; i < size; i++) {
    heights.push([]);
    for (var j = 0; j < size; j++) {
      heights[i].push([]);
      // if (i == 0) {
        // heights[i][j] = Math.abs(Math.cos(step + j * Math.PI / size));
        // heights[i][j] = Math.cos(step + j + i * Math.PI / size) / 5;
        if (i % 2 && (j+1) % 2 ) heights[i][j] = 0;
        else heights[i][j] = Math.cos(step + j + i * Math.PI / size) / 5;
      // }
      // else heights[i][j] = 0;
    }
  }
  return heights;
}

const updateMeshes  = (meshes, heights) => {
  meshes.forEach((a,i) => {
    a.forEach((triangles,j) => {
      const t1 = triangles[0];
      const t2 = triangles[1];
      t1.geometry.vertices[0].y = heights[i][j];
      t1.geometry.vertices[1].y = heights[i+1][j];
      t1.geometry.vertices[2].y = heights[i][j+1];
      t1.geometry.verticesNeedUpdate = true;
      t2.geometry.vertices[0].y = heights[i+1][j];
      t2.geometry.vertices[1].y = heights[i+1][j+1];
      t2.geometry.vertices[2].y = heights[i][j+1];
      t2.geometry.verticesNeedUpdate = true;
    })
  })
}
// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );

// var geometry = new THREE.Geometry();
// var v1 = new THREE.Vector3(0,0,0);   // Vector3 used to specify position
// var v2 = new THREE.Vector3(1,0,0);
// var v3 = new THREE.Vector3(0,1,0);   // 2d = all vertices in the same plane.. z = 0
//
// // add new geometry based on the specified positions
// geometry.vertices.push(v1);
// geometry.vertices.push(v2);
// geometry.vertices.push(v3);
//
// var redMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
// var triangle = new THREE.Mesh(geometry, redMat);
// scene.add(triangle);

// scene.add( cube );

// triangle geometry
const meshes = generateTrianglesPlane(5);
// console.log(meshes);

const heights = generatePlaneHeights(6);
console.log(heights);
// const triangle = generateTriangle();
// const triangle = meshes[0];

    // scene.add(triangle);

    // const heights =
 // updateMeshes(meshes, heights);
meshes.forEach(d1 => {
  d1.forEach(d2 => {
    d2.forEach(mesh => {
      scene.add(mesh);
    })
  })
})

    // geom.vertices[0].y = 1;
    // console.log(meshes[0][1][0]);



    // camera.position.z = 3;
    // camera.rotation.y = 20 * Math.PI / 180;
    let testRotation = 0;
    // camera.position.set(1,1,3);
    // camera.rotation.y = 33 * Math.PI / 180;
// camera.up = new THREE.Vector3(0,0,1);
// camera.lookAt(new THREE.Vector3(0,0,0));
let test = 0;

var render = function () {
  requestAnimationFrame( render );

  // camera.rotation = testRotation;
  if (test > Math.PI * 10) test = 0;
  // console.log(test);
  // meshes[0][1][0].geometry.vertices[0].y = test;
  // meshes[0][1][0].geometry.verticesNeedUpdate = true;
  const h = generatePlaneHeights(6, test);
  updateMeshes(meshes, h);
  test += 0.05;

  // mesh.rotation.x = testRotation;
  // mesh.rotation.y += 0.1;
  // mesh.rotation.z  += 0.1;

  renderer.render(scene, camera);
};





render();
