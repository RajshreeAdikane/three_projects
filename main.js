import * as THREE from 'three';
import { OrbitControls } from "https://esm.sh/three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';




const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.4)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;



const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingfactor = 0.03


// add composer effects
const renderPass = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,  
    0.4,  
    200
);
bloomPass.threshold = 0.002;
bloomPass.strength = 3.5;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderPass)

composer.addPass(bloomPass);
// Set up the curve path points
const curvePath = [
    10.136184463414924, -1.374508746897471, 10.384881573913269,
    9.1152593889854714, -1.374508746897471, 8.5846792797570011,
    9.0669355709754882, -1.0665123466336568, 5.8937771631608156,
    10.151040177840205, -0.65913653144937956, 3.4340491740541346,
    10.806779203170416, 1.8859391007298545, 0.46855774212986023,
    10.761433540147586, 2.8724172201359197, -1.2811838605587311,
    9.6195923104445065, 2.8724172201359197, -3.2833099941904766,
    6.9763020889151646, 2.7659257976905427, -4.7591958908830172,
    6.0461277891353697, 1.0727045302089879, -6.6638740164090482,
    7.3472235778544794, -1.8228856326635698, -9.0685043046185623,
    7.226367212900791, -1.8228856326635698, -10.499536640855691,
    5.8354566696263914, -1.8228856326635698, -12.039219379199908,
    3.6532357452141353, -0.20463983570573391, -13.87695442281038,
    -0.30169589630131455, 1.5965000671484342, -14.879986418947327,
    -2.8925694230502157, 2.2971364614427481, -13.892095587598131,
    -4.537672295357936, 4.5863515759659208, -12.140831652074551,
    -6.1287913464117594, 5.9653814634119815, -8.9776527318875896,
    -6.0120301606452813, 4.4081161943855998, -6.712084358394045,
    -5.2138252159038974, 2.820894808418279, -4.4532820412085607,
    -2.3424712835109611, 2.2032065005086259, -3.0788773693500198,
    -0.0076956453915433265, 1.8931797788880202, -1.6577070662471063,
    -0.24767503988481437, 2.8845808465856684, 0.073915859214221724,
    -2.2174044353598896, 4.2415524507318576, 2.215992718290742,
    -3.4526531678364756, 3.0615192023340851, 4.7922404932096558,
    -3.7356278971556445, 1.4054080369354316, 7.8432021841434629,
    -3.4003734463804118, 1.1924069108769393, 9.2464090886227073,
    -1.8851803760476225, 1.5269331003449989, 10.306083896408374,
    0.01071077144031829, 2.1101821577522295, 10.490880699847727,
    0.42562058195647001, 2.2759939598834387, 11.613129436580291,
    0.096405262182225115, 0.032317784084054391, 16.223455375061565,
    2.3458797884520433, 0.38907275257695584, 19.91188266079584,
    5.7018400098488771, 1.73337964747396, 20.615481586999959,
    7.9720939736751824, 1.73337964747396, 19.303399329816457,
    9.8672362721095652, 0.090083018057025177, 16.893338541618121,
    11.225959519544134, -1.374508746897471, 14.279002555560753,
    11.288646925965876, -1.374508746897471, 11.926359497447137,
    10.136184463414924, -1.374508746897471, 10.384881573913269
];

// Create an array to hold the points
const points = [];
const len = curvePath.length;

// Iterate through the curvePath array and create points
for (let i = 0; i < len; i += 3) {
    points.push(new THREE.Vector3(
        curvePath[i],
        curvePath[i + 1],
        curvePath[i + 2]
    ));
}

// Create the spline curve
const spline = new THREE.CatmullRomCurve3(points); //This is the curve generated through the points & create a smooth curve passing through a series of points in 3D space

// console.log(spline)
const splinePoints = spline.getPoints(100); 
const splineGeometry = new THREE.BufferGeometry().setFromPoints(splinePoints);
const splineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); 
const splineLine = new THREE.Line(splineGeometry, splineMaterial);
// scene.add(splineLine);



const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true); 

const tubeMat = new THREE.MeshStandardMaterial({
    // wireframe: true
 })
const tube = new THREE.Mesh(tubeGeo, tubeMat)
// scene.add(tube)


const edges = new THREE.EdgesGeometry(tubeGeo, 1);
const linesMat = new THREE.LineBasicMaterial({
    color: 0x0000FF, 
    flatShading: true,
})
const tubeline = new THREE.LineSegments(edges, linesMat)
scene.add(tubeline)


// different geometries inside the tube

const maxNumObjects = 300; 
const numObjects = Math.floor(Math.random() * maxNumObjects);

const size = 0.075;
const geometries = [
    new THREE.BoxGeometry(size, size, size),          // Cube
    // new THREE.SphereGeometry(size / 2, 16, 16),      // Sphere
    new THREE.ConeGeometry(size / 2, size, 16),      // Cone
    // new THREE.CylinderGeometry(size / 2, size / 2, size, 16), // Cylinder
    new THREE.TetrahedronGeometry(size),             // Tetrahedron
    new THREE.DodecahedronGeometry(size / 2),        // Dodecahedron
];

const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }), // Red
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }), // Green
    new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }), // Blue
    new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }), // Yellow
    new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true }), // Magenta
    new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true }), // Cyan
];

for (let i = 0; i < numObjects; i += 1) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const t = Math.random();

    const position = tubeGeo.parameters.path.getPointAt(t);
    const tangent = tubeGeo.parameters.path.getTangentAt(t);
    const normal = new THREE.Vector3(); 
    const binormal = new THREE.Vector3();
    tubeGeo.parameters.path.getTangentAt((t + 0.01) % 1).cross(tangent).normalize().cross(tangent).normalize();
    normal.crossVectors(tangent, binormal).normalize();

    const angle = Math.random() * Math.PI * 2;
    const radius = 0.65 * Math.random(); 
    const offset = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
    );
    offset.applyAxisAngle(tangent, angle);
    const finalPosition = position.clone().add(offset);
    const mesh = new THREE.Mesh(geometry, material);
    const edges = new THREE.EdgesGeometry(geometry, 0.2);
    const meshEdges = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
    mesh.position.copy(finalPosition);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    meshEdges.position.copy(finalPosition);
    meshEdges.rotation.copy(mesh.rotation);
    scene.add(meshEdges);
}

// add lights inside the tube
const numLights = 10; 
const lights = []; 

for (let i = 0; i < numLights; i++) {
    const light = new THREE.PointLight(0xffcc00, 1.5, 5); 
    const t = Math.random();
    const position = tubeGeo.parameters.path.getPointAt(t);
    const tangent = tubeGeo.parameters.path.getTangentAt(t);
    const normal = new THREE.Vector3();
    const binormal = new THREE.Vector3();
    tubeGeo.parameters.path.getTangentAt((t + 0.01) % 1).cross(tangent).normalize().cross(tangent).normalize();
    normal.crossVectors(tangent, binormal).normalize();
    
    const offset = normal.multiplyScalar(0.5 * Math.random()); 
    light.position.copy(position.clone().add(offset));
    
    scene.add(light);
    lights.push(light);
}

// lights update inside the tube
function updateLights(t) {
    const looptime = 5 * 1000; 
    const p = (t * 0.05 % looptime) / looptime;

    for (const light of lights) {
        const tOffset = Math.random() * 0.1; 
        const lightPosition = tubeGeo.parameters.path.getPointAt((p + tOffset) % 1);
        light.position.copy(lightPosition);
    }
}

// update camera inside the tubeGeo
function updateCamera(t){
    const time = t * 0.05
    const looptime = 5 * 1000;
    const p = (time % looptime) / looptime;
    const pos = tubeGeo.parameters.path.getPointAt(p)
    const lookAt = tubeGeo.parameters.path.getPointAt((p+ 0.01)%1)
    camera.position.copy(pos);
    camera.lookAt(lookAt)
}

// animate 

function animate(t = 0) {
    requestAnimationFrame(animate);
    updateCamera(t)
    updateLights(t)
    composer.render(scene, camera);
    controls.update()
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});