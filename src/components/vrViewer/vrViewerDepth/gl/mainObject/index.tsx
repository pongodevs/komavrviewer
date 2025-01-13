import { Suspense, useContext, useEffect, useMemo } from "react";
import { VrViewerDepthContext } from "../..";
import * as THREE from 'three'
import { VrViewerContext } from "../../..";

const MainObject = () => {
    const {currentView, mainMeshRef, nextView, player, dummyMeshRef, isProjectInitialize, setCurrentView, parallaxTeleport} = useContext(VrViewerDepthContext)
    const sphereRadius = 100
    const segment = 512


    const mainMaterial360 = useMemo(()=>{
        return new THREE.RawShaderMaterial({
            side:THREE.DoubleSide,
            uniforms:{
                currentDiffuse:{
                    value:currentView.texture
                },
                nextDiffuse:{
                    value:nextView.texture
                },
                currentDiffuseOrigin:{
                    value:new THREE.Vector3(currentView.position.x, currentView.position.y, currentView.position.z)
                },
                nextDiffuseOrigin:{
                    value:new THREE.Vector3(nextView.position.x, nextView.position.y, nextView.position.z),
                },
                depthMacro:{
                    value:currentView.depthMacroTexture
                },
                depthMicro:{
                    value:currentView.depthMicroTexture
                },
                mixColor:{
                    value:0.0
                },
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
                varying vec4 vNewPos;
    
                uniform sampler2D depthMacro;
                uniform sampler2D depthMicro;
                uniform bool isTeleport;
    
                void main()
                {   
                    vUv = vec2(1.0 -uv.x , uv.y);
                    vec2 uvFlipY = vec2(1.0 -uv.x , 1.0 - uv.y);
                    vec2 depthUv = vec2((uvFlipY.x * 0.992) + 0.004, (uvFlipY.y * 0.992) + 0.004);
    
                    vec4 depthColor = texture2D(depthMacro, depthUv);
                    vec4 depthMicroColor = texture2D(depthMicro, depthUv);

                    float displace = depthColor.x + (depthMicroColor.x/100.0);
                    vec3 newPos = position - (normal * ${sphereRadius}.0) + (normal * displace * ${sphereRadius}.0);

                    vNewPos = modelMatrix * vec4(newPos, 1.0);
                    gl_Position = projectionMatrix * viewMatrix * vNewPos;
                }
            `,
            fragmentShader:`
                precision highp float;
    
                uniform sampler2D currentDiffuse;
                uniform sampler2D nextDiffuse;
                uniform vec3 currentDiffuseOrigin;
                uniform vec3 nextDiffuseOrigin;
                uniform float mixColor;
    
                varying vec2 vUv;
                varying vec4 vNewPos;

                float findDegree(vec3 v, vec3 w){
                    float determinant = ((v.x * w.z)-(v.z * w.x));
                    float longitudeRadian = atan(determinant,(dot(w,v)));
                    return degrees(longitudeRadian);
                }

                vec2 findUv(vec3 origin){
                    // Search for uvx
                    vec3 v = vec3(0.0, 0.0, -1.0);
                    vec3 w = vec3(
                        vNewPos.x - origin.x, 
                        0.0, 
                        vNewPos.z - origin.z
                    );
                    
                    float uvx = (findDegree(v, w) / 360.0);
    
                    //Search for uvy
                    vec3 aproj = vec3(0.0, -1.0, 0.0);
                    vec3 a = normalize(vec3(
                        vNewPos.x - origin.x, 
                        vNewPos.y - origin.y, 
                        vNewPos.z - origin.z
                    ));
                    
                    float latitudeRadian = acos((dot(a,aproj)) / (length(a) * length(aproj)));
                    float latitudeDegree = degrees(latitudeRadian);
                    
                    float uvy = latitudeDegree / 180.0 ;

                    vec2 uv = vec2(uvx + 0.5 , uvy);

                    return uv;
                }
                
                void main()
                {   
                    vec2 currentUv = findUv(currentDiffuseOrigin);
                    vec2 nextUv = findUv(nextDiffuseOrigin);

                    vec4 currentColor = texture2D(currentDiffuse, currentUv);
                    vec4 nextColor = texture2D(nextDiffuse, nextUv);
                    vec4 color = mix(currentColor, nextColor, mixColor);

                    gl_FragColor = vec4(color.rgb, 1.0);
                }
            `
        })
    },[])


    const dummyMaterial = useMemo(()=>{
        return new THREE.MeshBasicMaterial({
            side:THREE.BackSide,
            depthTest:false,
            map:currentView.texture,
        })
    },[currentView])

    useEffect(()=>{
        // Init position when first start
        mainMeshRef.current.position.x = currentView.position.x
        mainMeshRef.current.position.y = currentView.position.y
        mainMeshRef.current.position.z = currentView.position.z
    },[])

    useEffect(()=>{
        dummyMeshRef.current.position.x = currentView.position.x
        dummyMeshRef.current.position.y = currentView.position.y
        dummyMeshRef.current.position.z = currentView.position.z
    },[currentView])

    useEffect(()=>{
        if(isProjectInitialize){
            parallaxTeleport(currentView,0.1)
        }
    },[isProjectInitialize])
    return (  
        <>
            {/* Main mesh */}
            <mesh
                ref={mainMeshRef}
                rotation={[0,Math.PI/2,0]}
                material={mainMaterial360}
            >
                <sphereGeometry
                    args={[sphereRadius, segment, segment/2]}
                />
            </mesh>
            {/* Dummy Mesh for view accuracy */}
            <mesh
                ref={dummyMeshRef}
                scale={[1,1,-1]}
                rotation={[0,Math.PI/2,0]}
                material={dummyMaterial}
            >
                <sphereGeometry
                    args={[0.03, 128, 64]}
                />
            </mesh>
        </>
    );
}
 
export default MainObject;