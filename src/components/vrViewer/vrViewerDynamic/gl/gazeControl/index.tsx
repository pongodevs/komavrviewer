import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import _ from "lodash";
import { useXR } from "@react-three/xr";

const GazeControl = () => {
    const {camera, gl} = useThree()
    const {player:xrPlayer} = useXR()
    const {gazeTimer, gazedGroupRef, gazedViewId, setGazedViewId, setGazeTimer, currentView, selectedScene, xrTeleport, cameraRig, isXrMode} = useContext(VrViewerDynamicContext)
    const size = 0.005
    const loadingGeometry = new THREE.PlaneGeometry(size * 20,size * 20);
    const dotGeometry = new THREE.CircleGeometry(size,32)
    const dotMaterial = new THREE.MeshBasicMaterial({
        color:`white`,
        side:THREE.DoubleSide,
    })

    const loadingMaterial = new THREE.RawShaderMaterial({
        side:THREE.DoubleSide,
        depthTest:false,
        transparent:true,
        uniforms:{
            progress: { value: ( (gazeTimer < 0 ? 0 : gazeTimer) / 100)},
        },
        vertexShader: `
            precision highp float;
            uniform mat4 projectionMatrix;
            uniform mat4 viewMatrix;
            uniform mat4 modelMatrix;
            uniform float progress;
            
            attribute vec3 position;
            attribute vec2 uv;

            varying vec2 vUv;
            
            void main()
            {
                vUv = uv;
                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            uniform float progress;

            varying vec2 vUv;

            void main()
            {
                float PI = 3.14159;
                float uvx = vUv.x - 0.5;
                float uvy = vUv.y - 0.5;
                float dist = sqrt( (uvx * uvx) + (uvy * uvy));
                float c1 = step(dist, 0.25);
                float c2 = step(dist, 0.35);
                float ac = (1.0 - c1) * c2;


                float angle = atan(uvx, uvy);
                angle /= PI * 2.0;
                angle += 0.5;
                angle = step(angle, progress);
                float progress = angle;

                float finalAlpha = progress * ac;
                
                vec4 color = vec4(1.0, 1.0, 1.0, finalAlpha * 0.7);

                gl_FragColor = color;
            }
        `
    })

    
    const meshRef = useRef<any>(null)

    useEffect(()=>{
        // teleport
        if(gazeTimer == 100){
            const findView = selectedScene.viewList.find(v=>{return v._id === gazedViewId})
            if(findView){
                xrTeleport(findView)
                setGazeTimer(-100)
            }
        }
    },[gazeTimer])


    useFrame(()=>{
        // Set dot position
        const xrCamera = gl.xr.getCamera()
        const xrCameraDir = xrCamera.getWorldDirection(new THREE.Vector3())
        if(meshRef.current){
            // Set target look at
            const meshPosition = new THREE.Vector3().copy(xrCamera.position).add(xrCameraDir)
            meshRef.current.position.x = meshPosition.x
            meshRef.current.position.y = meshPosition.y
            meshRef.current.position.z = meshPosition.z

            meshRef.current.lookAt(xrCamera.position)
        }

        // Raycast
        if(gazedGroupRef.current){
            const raycaster = new THREE.Raycaster(new THREE.Vector3(xrCamera.position.x, xrCamera.position.y, xrCamera.position.z), xrCameraDir)
            const intersectObject = raycaster.intersectObject(gazedGroupRef.current,true)
            if(intersectObject.length > 0){
                const pinId = intersectObject[0].object.name
                setGazedViewId(pinId)
                if(gazeTimer < 100){
                    setGazeTimer(prev=>{return Math.min(100, prev + 1.5)})
                }
            }
            else{
                setGazedViewId("")
                setGazeTimer(0)
            }
        }
    },)
    return (  
        <>
            <group
                position={camera.getWorldDirection(new THREE.Vector3()).add(camera.position)}
                rotation={[0,Math.PI,0]}
                ref={meshRef}
            >
                {/* Dot */}
                <mesh
                    geometry={dotGeometry}
                    material={dotMaterial}
                />
                {/* Loading */}
                <mesh
                    position={[0,0,+0.01]}
                    geometry={loadingGeometry}
                    material={loadingMaterial}
                />
            </group>
        </>
    );
}
 
export default GazeControl;