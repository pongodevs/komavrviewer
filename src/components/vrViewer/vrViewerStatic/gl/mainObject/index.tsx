import { useContext, useEffect, useMemo } from "react";
import * as THREE from 'three'
import _ from 'lodash'
import { VrViewerStaticContext } from "../..";
import { Interactive } from "@react-three/xr";
import { useThree } from "@react-three/fiber";

const MainObject = ({transition,disableTeleport}:{transition?:boolean,disableTeleport?:boolean}) => {
    const {camera} = useThree()
    const {
        pointer,
        mainMeshRef,
        radius,
        currentView, nextView,
        isProjectInitialize,
        isEditorMode
    } = useContext(VrViewerStaticContext)

    const material360 = useMemo(()=>{
        return new THREE.RawShaderMaterial({
            side:THREE.DoubleSide,
            uniforms:{
                color:{value: new THREE.Color(0xff0000)},
                currentTexture: { value: currentView?.texture},
                nextTexture: { value: nextView?.texture},
                mixColor: {value: 0},
                currentOrigin: { 
                    // type: 'v3', 
                    value: currentView?.position 
                },
                nextOrigin: { 
                    // type: 'v3', 
                    value: nextView?.position 
                },
                currentRotation:{
                    value:currentView?.rotation
                },
                nextRotation:{
                    value:nextView?.rotation
                },
            },
            vertexShader: `
                precision highp float;

                uniform mat4 projectionMatrix;
                uniform mat4 viewMatrix;
                uniform mat4 modelMatrix;
                
                attribute vec3 position;
                attribute vec3 normal;
                
                varying vec3 vPosition;
                
                void main()
                {
                    vPosition = position;
                    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                
                uniform vec3 color;
                uniform sampler2D currentTexture;
                uniform sampler2D nextTexture;
                uniform float mixColor;
                uniform vec3 currentOrigin;
                uniform vec3 nextOrigin;
                uniform vec3 offset;
                uniform float currentRotation;
                uniform float nextRotation;
                
                varying vec3 vPosition;
    

                float findDegree(vec3 v, vec3 w){
                    float determinant = ((v.x * w.z)-(v.z * w.x));
                    float longitudeRadian = atan(determinant,(dot(w,v)));
                    return degrees(longitudeRadian);
                }

                vec2 findUv(vec3 origin, float rotation){
                    // Search for uvx
                    float angle = radians(rotation);
                    vec3 v = vec3(0.0, 0.0, -1.0);
                    mat4 matRotation = mat4(
                        cos(angle), 0.0, -sin(angle), 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        sin(angle), 0.0, cos(angle), 0.0,
                        0.0, 0.0, 0.0, 1.0
                    );
                    vec4 rotatedV = matRotation * vec4(v,1.0);
                    vec3 w = vec3(
                        vPosition.x - origin.x, 
                        0.0, 
                        vPosition.z - origin.z
                    );
                    
                    float uvx = (findDegree(rotatedV.xyz, w) / 360.0);
    
                    //Search for uvy
                    vec3 aproj = vec3(0.0, -1.0, 0.0);
                    vec3 a = vec3(
                        vPosition.x - origin.x, 
                        vPosition.y - origin.y, 
                        vPosition.z - origin.z
                    );
                    
                    float latitudeRadian = acos((dot(a,aproj)) / (length(a) * length(aproj)));
                    float latitudeDegree = degrees(latitudeRadian);
                    
                    float uvy = latitudeDegree / 180.0 ;

                    vec2 uv = vec2(uvx + 0.5 , uvy);

                    return uv;
                }
                
                void main()
                {
                    vec2 currentUv = findUv(currentOrigin, currentRotation);
                    vec2 nextUv = findUv(nextOrigin, nextRotation);
    
                    vec4 currentColor = texture2D(currentTexture, currentUv);
                    vec4 nextColor = texture2D(nextTexture, nextUv);
                    vec4 mixColor = mix(currentColor, nextColor, mixColor);
    
                    gl_FragColor = mixColor;
                }
            `
        })
    },[isProjectInitialize])

    //Update rotation in editor mode
    useEffect(()=>{
        if(isEditorMode){
            mainMeshRef.current.material.uniforms.currentRotation.value = currentView.rotation
        }
    },[currentView?.rotation])

    useEffect(()=>{
        (camera as any).fov = currentView?.fov
    },[currentView?.fov])


    return (  
        <Interactive
            onSelect={()=>{
                console.log('asd')
            }}
        >
            <mesh
                ref={mainMeshRef}
                // geometry={sphereGeometry}
                material={material360}
                // scale={[-1,1,1]}
                scale={[-1,1,-1]}
                // rotation={[0,-Math.PI/2,0]}
                rotation={[0,Math.PI,0]}
                onPointerMove={(e:any)=>{
                    const intersectLocation = e.point
                    const intersectNormal = e.face.normal
                    const intersectDistance =  e.distance
            
                    pointer.position3d.x = intersectLocation.x;
                    pointer.position3d.y = intersectLocation.y;
                    pointer.position3d.z = intersectLocation.z;
            
                    pointer.normal.x =  intersectNormal.x;
                    pointer.normal.y =  intersectNormal.y;
                    pointer.normal.z =  intersectNormal.z;
                    
                    pointer.distance = intersectDistance;
                }}
            >
                <sphereGeometry
                    args={[radius * 1.1,128,128]}
                />
            </mesh>
        </Interactive>
    );
}
 
export default MainObject;