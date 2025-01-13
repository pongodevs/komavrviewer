import { useContext, useEffect, useMemo } from "react";
import { VrViewerDepthContext } from "../..";
import * as THREE from 'three'
import useAnimation from "@/hooks/animation";
import { useFrame, useThree } from "@react-three/fiber";
import { VrViewerContext } from "../../..";
import Object from "./object";


const p1 = [-24.363, -1.805, 4.468]
const p2 = [-24.303, -1.405, 3.248]
const cp = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2]
const MainObject = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {currentView, mainMeshRef, nextView, selectedScene} = useContext(VrViewerDepthContext)
    const sphereRadius = 100
    const segment = 512
    console.log(currentView.position)

    const mainMaterial360 = useMemo(()=>{
        return new THREE.RawShaderMaterial({
            side:THREE.DoubleSide,
            transparent:true,
            // wireframe:true,
            uniforms:{
                currentDiffuse:{
                    value:currentView.texture
                },
                nextDiffuse:{
                    value:nextView.texture
                },
                depth:{
                    value:currentView.depthMacroTexture
                },
                depthMicro:{
                    value:currentView.depthMicroTexture
                },
                mixColor:{
                    value:0.0
                },
                p1:{
                    value:p1,
                },
                p2:{
                    value:p2,
                },
                cp:{
                    value:cp
                }
            },
            vertexShader:`
                precision highp float;
                uniform mat4 projectionMatrix;
                uniform mat4 viewMatrix;
                uniform mat4 modelMatrix;
                
                attribute vec3 position;
                attribute vec3 normal;
                attribute vec2 uv;
                
                varying vec2 vUv;
                varying vec3 vPos;
                varying vec4 vNewPos;
    
                uniform sampler2D depth;
                uniform sampler2D depthMicro;
    
                void main()
                {   
                    vPos = position;
                    vUv = vec2(1.0 -uv.x , uv.y);
                    vec2 uvFlipY = vec2(1.0 -uv.x , 1.0 - uv.y);
    
                    vec4 depthColor = texture2D(depth, uvFlipY);
                    vec4 depthMicroColor = texture2D(depthMicro, uvFlipY);

                    float displace = depthColor.x + (depthMicroColor.x/100.0);
                    vec3 newPos = position - (normal * ${sphereRadius}.0) + (normal * displace * ${sphereRadius}.0);

                    vNewPos = modelMatrix * vec4(newPos, 1.0);

                    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPos, 1.0);
                }
            `,
            fragmentShader:`
                precision highp float;
    
                uniform sampler2D currentDiffuse;
                uniform sampler2D nextDiffuse;
                uniform float mixColor;
    
                varying vec2 vUv;
                varying vec4 vNewPos;
                varying vec3 vPos;

                uniform vec3 p1;
                uniform vec3 p2;

                uniform vec3 cp;
                
                void main()
                {   
                    vec3 np1 = normalize(p1 - cp);
                    vec3 np2 = normalize(p2 - cp);

                    vec3 nNewPos = normalize(vNewPos.xyz - cp);
                    float dot = dot(np2, nNewPos);

                    vec4 currentColor = texture2D(currentDiffuse, vUv);
                    vec4 nextColor = texture2D(nextDiffuse, vUv);
                    vec4 color = mix(currentColor, nextColor, mixColor);

                    float x = dot > 0.0 ? 0.0 : 1.0;
                    gl_FragColor = vec4(color.rgb, x);
                }
            `
        })
    },[])

    // Init position when first start
    // useEffect(()=>{
    //     mainMeshRef.current.position.x = currentView.position.x
    //     mainMeshRef.current.position.y = currentView.position.y
    //     mainMeshRef.current.position.z = currentView.position.z
    // },[])
    return (  
        <>
            {selectedScene.viewList.map((view,index)=>
                <Object
                    key={index}
                    view={view}
                />
            )}
            {/* <mesh
                position={[0,0,0]}
            >
                <boxGeometry
                    args={[0.1,0.1,0.1]}
                />
                <meshStandardMaterial
                    color={`red`}
                />
            </mesh>
            <mesh
                position={[p1[0],p1[1],p1[2]]}
            >
                <boxGeometry
                    args={[0.1,0.1,0.1]}
                />
                <meshStandardMaterial
                    color={`red`}
                />
            </mesh>
            <mesh
                position={[p2[0],p2[1],p2[2]]}
            >
                <boxGeometry
                    args={[0.1,0.1,0.1]}
                />
                <meshStandardMaterial
                    color={`red`}
                />
            </mesh>
            <mesh
                position={[cp[0],cp[1],cp[2]]}
            >
                <boxGeometry
                    args={[0.1,0.1,0.1]}
                />
                <meshStandardMaterial
                    color={`red`}
                />
            </mesh>
            <mesh
                ref={mainMeshRef}
                rotation={[0,Math.PI/2,0]}
                material={mainMaterial360}
            >
                <sphereGeometry
                    args={[sphereRadius, segment, segment/2]}
                />
            </mesh> */}

        </>
    );
}
 
export default MainObject;