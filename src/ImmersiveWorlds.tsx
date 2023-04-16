import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function ImmersiveWorlds() {
  const sceneRef = useRef(null);

  useEffect(() => {
    let container, scene, camera, renderer, texture, sphere, controls;

    const init = () => {
      container = sceneRef.current;

      // Create the scene, camera, and renderer
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      renderer = new THREE.WebGLRenderer();

      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      // Load the panoramic image and create a texture
      const loader = new THREE.TextureLoader();
      texture = loader.load("./pana.jpg");

      // Create a spherical geometry and map the texture to it
      const geometry = new THREE.SphereGeometry(500, 60, 40);

      // Flip the geometry inside out
      geometry.scale(-1, 1, 1);

      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });

      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Set up the camera and controls
      camera.position.set(0, 0, 0.1);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.rotateSpeed = 0.3;

      window.addEventListener("resize", onWindowResize, false);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Animation loop
    let lastTime = 0;
    const rotationSpeed = 0.00005;

    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;
      requestAnimationFrame(animate);

      sphere.rotation.y += rotationSpeed * delta;

      controls.update();
      renderer.render(scene, camera);
    };

    init();
    animate(0);

    return () => {
      window.removeEventListener("resize", onWindowResize, false);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div id="container" className="ImmersiveWorlds" ref={sceneRef} />;
}

export default ImmersiveWorlds;
