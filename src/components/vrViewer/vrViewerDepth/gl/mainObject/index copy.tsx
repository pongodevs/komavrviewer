import { useContext, useEffect, useMemo } from "react";
import { VrViewerDepthContext } from "../..";
import * as THREE from 'three'

const MainObject = () => {
    const {currentView, mainMeshRef, nextView, player} = useContext(VrViewerDepthContext)
    const sphereRadius = 100
    const segment = 1024

    const mainMaterial360 = useMemo(()=>{
        return new THREE.RawShaderMaterial({
            side:THREE.DoubleSide,
            // transparent:true,
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
                    value:new THREE.Vector3(currentView.floorPosition.x,currentView.floorPosition.y,currentView.floorPosition.z)
                },
                p2:{
                    value:new THREE.Vector3(nextView.floorPosition.x,nextView.floorPosition.y,nextView.floorPosition.z)
                },
                isTeleport:{
                    value:false
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
                varying vec4 vNewPos;
    
                uniform sampler2D depth;
                uniform sampler2D depthMicro;
                uniform bool isTeleport;
    
                void main()
                {   
                    vUv = vec2(1.0 -uv.x , uv.y);
                    vec2 uvFlipY = vec2(1.0 -uv.x , 1.0 - uv.y);
    
                    vec4 depthColor = texture2D(depth, uvFlipY);
                    vec4 depthMicroColor = texture2D(depthMicro, uvFlipY);

                    float displace = depthColor.x + (depthMicroColor.x/100.0);
                    float normalStrength = isTeleport ? 1.0 : 1.0;
                    vec3 newPos = position - (normal * ${sphereRadius}.0 * normalStrength) + (normal * displace * ${sphereRadius}.0 * normalStrength);

                    vNewPos = modelMatrix * vec4(newPos, 1.0);
                    gl_Position = projectionMatrix * viewMatrix * vNewPos;
                }
            `,
            fragmentShader:`
                precision highp float;
    
                uniform sampler2D currentDiffuse;
                uniform sampler2D nextDiffuse;
                uniform float mixColor;
    
                varying vec2 vUv;
                varying vec4 vNewPos;

                uniform vec3 p1;
                uniform vec3 p2;
                uniform bool isTeleport;
                
                void main()
                {   
                    vec4 currentColor = texture2D(currentDiffuse, vUv);
                    vec4 nextColor = texture2D(nextDiffuse, vUv);
                    vec4 color = mix(currentColor, nextColor, mixColor);

                    float x = 1.0;
                    if(isTeleport){
                        vec3 cDir = (p2 - p1);
                        vec3 cp = p1 +  (cDir * 0.51);
    
                        vec3 np2 = normalize(p2 - cp);
                        vec3 nNewPos = normalize(vNewPos.xyz - cp);
    
                        float dot = dot(np2, nNewPos);
    
                        float x = dot > 0.0 ? 0.0 : 1.0;
    
                        if(x == 0.0){
                            discard;
                        }
                    }

                    gl_FragColor = vec4(color.rgb, 1.0);
                }
            `
        })
    },[])
    const teleportMaterial360 = useMemo(()=>{
        return new THREE.RawShaderMaterial({
            side:THREE.DoubleSide,
            // transparent:true,
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
                    value:new THREE.Vector3(currentView.position.x,currentView.position.y,currentView.position.z)
                },
                p2:{
                    value:new THREE.Vector3(nextView.position.x,nextView.position.y,nextView.position.z)
                },
                isTeleport:{
                    value:false
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
                varying vec4 vNewPos;
    
                uniform sampler2D depth;
                uniform sampler2D depthMicro;
                uniform bool isTeleport;
    
                void main()
                {   
                    if(isTeleport){
                        vUv = vec2(1.0 -uv.x , uv.y);
                        vec2 uvFlipY = vec2(1.0 -uv.x , 1.0 - uv.y);
        
                        vec4 depthColor = texture2D(depth, uvFlipY);
                        vec4 depthMicroColor = texture2D(depthMicro, uvFlipY);
    
                        float displace = depthColor.x + (depthMicroColor.x/100.0);
                        vec3 newPos = position - (normal * ${sphereRadius}.0) + (normal * displace * ${sphereRadius}.0);
    
                        vNewPos = modelMatrix * vec4(newPos, 1.0);
                        gl_Position = projectionMatrix * viewMatrix * vNewPos;
                    }
                    else{
                        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
                    }

                }
            `,
            fragmentShader:`
                precision highp float;
    
                uniform sampler2D currentDiffuse;
                uniform sampler2D nextDiffuse;
                uniform float mixColor;
    
                varying vec2 vUv;
                varying vec4 vNewPos;

                uniform vec3 p1;
                uniform vec3 p2;
                uniform bool isTeleport;
                
                void main()
                {   
                    vec4 currentColor = texture2D(currentDiffuse, vUv);
                    vec4 nextColor = texture2D(nextDiffuse, vUv);
                    vec4 color = mix(currentColor, nextColor, mixColor);

                    if(!isTeleport){
                        discard;
                    }
                    vec3 cDir = (p2 - p1);
                    vec3 cp = p1 +  (cDir * 0.51);

                    vec3 np2 = normalize(p2 - cp);
                    vec3 nNewPos = normalize(vNewPos.xyz - cp);

                    float dot = dot(np2, nNewPos);

                    float x = dot > 0.0 ? 0.0 : 1.0;

                    if(x == 0.0){
                        discard;
                    }
                    gl_FragColor = vec4(color.rgb, 1.0);

                }
            `
        })
    },[])

    // Init position when first start
    useEffect(()=>{
        mainMeshRef.current.position.x = currentView.position.x
        mainMeshRef.current.position.y = currentView.position.y
        mainMeshRef.current.position.z = currentView.position.z
    },[])
    return (  
        <>
            <mesh
                ref={mainMeshRef}
                rotation={[0,Math.PI/2,0]}
                material={mainMaterial360}
            >
                <sphereGeometry
                    args={[sphereRadius, segment, segment/2]}
                />
            </mesh>
            <mesh
                rotation={[0,Math.PI/2,0]}
                material={teleportMaterial360}
            >
                <sphereGeometry
                    args={[sphereRadius, segment, segment/2]}
                />
            </mesh>

        </>
    );
}
 
export default MainObject;