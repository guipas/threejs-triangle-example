var scene = new THREE.Scene();
var ratio = 200;
var camera = new THREE.OrthographicCamera( window.innerWidth / -ratio, window.innerWidth / ratio, window.innerHeight / ratio, window.innerHeight / -ratio, -500, 1000 );
camera.position.set(3,-3,1);
camera.rotation.x = -30 * Math.PI / 180;
camera.rotation.y =  20 * Math.PI / 180;
scene.add(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( 600, 400 );
// renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const generateTriangle  = (v1, v2, v3) => {
  var geom = new THREE.Geometry();
  geom.dynamic = true;
  geom.vertices.push(v1);
  geom.vertices.push(v2);
  geom.vertices.push(v3);
  var face = new THREE.Face3(0, 1, 2);
  face.vertexColors.push(new THREE.Color(0xff88dd));
  face.vertexColors.push(new THREE.Color(0xaaff55));
  face.vertexColors.push(new THREE.Color(0xaa99ff));
  geom.faces.push(face);
  // material
  var mat = new THREE.MeshBasicMaterial( {shading: THREE.SmoothShading,reflectivity: 0.5,vertexColors: THREE.VertexColors, side: THREE.DoubleSide })
  //  mesh
  return new THREE.Mesh(geom, mat);
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
      t1 = generateTriangle(
        new THREE.Vector3(i, 0, j),
        new THREE.Vector3(i+1, 0, j),
        new THREE.Vector3(i, 0, j+1)
      )
      meshes[i][j] = [t1];

      // triangle 2
      t2 = generateTriangle(
        new THREE.Vector3(i+1, 0, j),
        new THREE.Vector3(i+1, 0, j+1),
        new THREE.Vector3(i, 0, j+1)
      )
      meshes[i][j].push(t2);
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
      if (i % 2 && (j+1) % 2 ) heights[i][j] = 0;
      else heights[i][j] = Math.cos(step + j + i * Math.PI / size) / 5;
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

const nbPlane = 10;
const meshes = generateTrianglesPlane(nbPlane);
const heights = generatePlaneHeights(nbPlane+1);

meshes.forEach(d1 => {
  d1.forEach(d2 => {
    d2.forEach(mesh => {
      scene.add(mesh);
    })
  })
})

let step = 0;

var render = function () {
  requestAnimationFrame( render );

  if (step > Math.PI * 10) step = 0;

  updateMeshes(meshes, generatePlaneHeights(nbPlane+1, step));
  step += 0.05;

  renderer.render(scene, camera);
};





render();
