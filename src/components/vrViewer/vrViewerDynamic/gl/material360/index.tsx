import { useContext, useEffect } from 'react';
import * as THREE from 'three'
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

const Material360 = () => {
    const { setMaterial360, currentView, nextView, selectedProject, cameraRig, camera, isProjectInitialize} = useContext(VrViewerDynamicContext)
    useEffect(()=>{
        if(isProjectInitialize){
            const equirectangularMaterial = new THREE.RawShaderMaterial({
                // side:THREE.DoubleSide,
                uniforms:{
                    currentTexture: { value: currentView?.texture},
                    nextTexture: { value: nextView?.texture},
                    mixColor: {value: 0},
                    currentOrigin: { 
                        value: selectedProject.globalSettings.transition.style === 'parallax'? currentView?.position : cameraRig?.position 
                    },
                    nextOrigin: { 
                        value: selectedProject.globalSettings.transition.style === 'parallax'? nextView?.position : cameraRig?.position 
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
                    
                    varying vec3 vPosition;
    
                    float findDegree(vec3 v, vec3 w){
                        float determinant = ((v.x * w.z)-(v.z * w.x));
                        float longitudeRadian = atan(determinant,(dot(w,v)));
                        return degrees(longitudeRadian);
                    }
    
                    vec2 findUv(vec3 origin){
                        // Search for uvx
                        vec3 v = vec3(0.0, 0.0, -1.0);
         
                        vec3 w = vec3(
                            vPosition.x - origin.x, 
                            0.0, 
                            vPosition.z - origin.z
                        );
                        
                        float uvx = (findDegree(v, w) / 360.0);
        
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
                        vec2 currentUv = findUv(currentOrigin);
                        vec2 nextUv = findUv(nextOrigin);
        
                        vec4 currentColor = texture2D(currentTexture, currentUv);
                        vec4 nextColor = texture2D(nextTexture, nextUv);
                        vec4 mixColorFinal = mix(currentColor, nextColor, mixColor);
        
                        gl_FragColor = mixColorFinal;
                    }
                `
            })
            setMaterial360(equirectangularMaterial)
        }
    },[isProjectInitialize])
    return ( null );
}
 
export default Material360;