import { ViewListType } from "@/types/vrProjectType";
import { useContext, useMemo } from "react";
import * as THREE from 'three';
import { VrViewerDepthContext } from "../../..";
import _ from "lodash";


const Object = ({view}:{view:ViewListType}) => {
    const {selectedScene, currentView} = useContext(VrViewerDepthContext)
    const otherViews = selectedScene.viewList.filter(v=>{return v._id != view._id})
    const otherViewsPosition = otherViews.map(v=>{return new THREE.Vector3(v.position.x, v.position.y, v.position.z)})
    const sphereRadius = 100
    const segment = 512

    // const geometry = new THREE.SphereGeometry(1, segment, segment/2) as any
    // console.log(geometry.attributes.position.array[0])
    // geometry.attributes.position.array = _.flatten(_.chunk(geometry.attributes.position.array, geometry.attributes.position.itemSize).map((pos:any)=>{
    //     const position = new THREE.Vector3(pos[0],pos[1],pos[2])
    //     const normal = no
    // }))
    // console.log(geometry)

    const mainMaterial360 = useMemo(()=>{
        return new THREE.RawShaderMaterial({
            side:THREE.BackSide,
            transparent:true,
            // wireframe:true,
            // depthFunc:1,
            // depthTest:false,
            // depthWrite:false,
            uniforms:{
                currentDiffuse:{
                    value:view.texture
                },
                nextDiffuse:{
                    value:view.texture
                },
                depth:{
                    value:view.depthMacroTexture
                },
                depthMicro:{
                    value:view.depthMicroTexture
                },
                mixColor:{
                    value:0.0
                },
                otherPos:{
                    value:otherViewsPosition
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
                varying float vOpacity;
    
                uniform sampler2D depth;
                uniform sampler2D depthMicro;

                uniform vec3 otherPos[${otherViewsPosition.length}];
    
                void main()
                {   
                    

                    vUv = vec2(1.0 -uv.x , uv.y);
                    vec2 uvFlipY = vec2(1.0 -uv.x , 1.0 - uv.y);
    
                    vec4 depthColor = texture2D(depth, uvFlipY);
                    vec4 depthMicroColor = texture2D(depthMicro, uvFlipY);

                    float displace = depthColor.x + (depthMicroColor.x/100.0);
                    vec3 newPos = position - (normal * ${sphereRadius}.0) + (normal * displace * ${sphereRadius}.0);

                    vec4 vNewPos = modelMatrix * vec4(newPos, 1.0);

                    float opacity = 1.0;
                    for (int i=0; i< ${otherViewsPosition.length}; i++){
                        vec3 p1 = vec3(${view.position.x}, ${view.position.y}, ${view.position.z});
                        vec3 p2 = otherPos[i];

                        vec3 cDir = (p2 - p1);
                        vec3 cp = p1 +  (cDir * 0.51);

                        vec3 np2 = normalize(p2 - cp);
                        vec3 nNewPos = normalize(vNewPos.xyz - cp);

                        float dot = dot(np2, nNewPos);

                        float x = dot > 0.0 ? 0.0 : 1.0;
                        opacity *= x;
                    }
                    vOpacity = opacity;

                    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPos, 1.0);
                }
            `,
            fragmentShader:`
                precision highp float;
    
                uniform sampler2D currentDiffuse;
                uniform sampler2D nextDiffuse;
                uniform float mixColor;
    
                varying vec2 vUv;
                varying float vOpacity;

                
                void main()
                {   
                    if(vOpacity < 0.5){
                        discard;
                    }
                    vec4 currentColor = texture2D(currentDiffuse, vUv);
                    vec4 nextColor = texture2D(nextDiffuse, vUv);
                    vec4 color = mix(currentColor, nextColor, mixColor);

                    float y = vOpacity;
                    gl_FragColor = vec4(color.rgb, vOpacity);
                }
            `
        })
    },[])
    return (  
        <>
            <mesh
                rotation={[0,Math.PI/2,0]}
                material={mainMaterial360}
                position={[view.position.x,view.position.y, view.position.z]}
            >
                <sphereGeometry
                    args={[sphereRadius, segment, segment]}
                />
            </mesh>
        </>
    );
}
 
export default Object;