       import * as THREE from 'three';
        import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
        import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
        import { EffectComposer, RenderPass, BloomPass } from 'three/examples/jsm/Addons.js';
        // Scene setup
        const scene = new THREE.Scene();

        // Background with stars image
        const textureLoader = new THREE.TextureLoader();
        const backgroundTexture = textureLoader.load('./assets/stars-background.jpg');
        scene.background = backgroundTexture;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Lighting setup
       // Lighting setup
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(5, 10, 5);
scene.add(pointLight);

const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
scene.add(hemisphereLight);


console.log(scene)

        // Loading screen
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.getElementById('loading-progress');

        // Load the castle room model using DRACOLoader
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        
        let roomBoundingBox;

        loader.load('./assets/the_king_s_hall/scene.gltf', function (gltf) {
            const room = gltf.scene;
            scene.add(room);

            // Calculate the bounding box of the room
            const box = new THREE.Box3().setFromObject(room);
            const center = new THREE.Vector3();
            box.getCenter(center);

            const size = new THREE.Vector3();
            box.getSize(size);
            roomBoundingBox = box;

            camera.position.set(center.x, center.y, center.z + 5);
            camera.lookAt(center);

            loadingScreen.style.display = 'none';
        },
        function (xhr) {
            const progress = (xhr.loaded / xhr.total) * 100;
            loadingProgress.textContent = Math.round(progress) + '%';
        },
        function (error) {
            console.error('An error happened:', error);
        });

        // Movement variables
        const moveSpeed = 0.1;
        const turnSpeed = 0.05;
        const keyboard = {};

        // Handle controls
        function handleControls() {
            if (keyboard[87]) { // W key
                camera.position.x -= Math.sin(camera.rotation.y) * moveSpeed;
                camera.position.z -= -Math.cos(camera.rotation.y) * moveSpeed;
            }
            if (keyboard[83]) { // S key
                camera.position.x += Math.sin(camera.rotation.y) * moveSpeed;
                camera.position.z += -Math.cos(camera.rotation.y) * moveSpeed;
            }
            if (keyboard[65]) { // A key
                camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * moveSpeed;
                camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * moveSpeed;
            }
            if (keyboard[68]) { // D key
                camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * moveSpeed;
                camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * moveSpeed;
            }
            if (keyboard[37]) { // Left arrow key
                camera.rotation.y -= turnSpeed;
            }
            if (keyboard[39]) { // Right arrow key
                camera.rotation.y += turnSpeed;
            }

            if (roomBoundingBox) {
                const cameraPosition = camera.position.clone();
                cameraPosition.x = THREE.MathUtils.clamp(cameraPosition.x, roomBoundingBox.min.x, roomBoundingBox.max.x);
                cameraPosition.y = THREE.MathUtils.clamp(cameraPosition.y, roomBoundingBox.min.y, roomBoundingBox.max.y);
                cameraPosition.z = THREE.MathUtils.clamp(cameraPosition.z, roomBoundingBox.min.z, roomBoundingBox.max.z);
                camera.position.copy(cameraPosition);
            }
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            handleControls();
            renderer.render(scene, camera);
        }
        animate();

        // Handle window resize
        window.addEventListener('resize', function () {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });

        // Handle keyboard input
        window.addEventListener('keydown', function (e) {
            keyboard[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
            keyboard[e.keyCode] = false;
        });