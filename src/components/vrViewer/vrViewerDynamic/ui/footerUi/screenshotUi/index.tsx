import React from 'react'
import { useRef,  useContext} from 'react';
import { FaCamera } from 'react-icons/fa';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { VrViewerContext} from '@/components/homepage/bodyContainer/vrViewer';
import {useEffect} from 'react';
import {useState} from 'react';

const ScreenshootUi = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {gl, scene, camera, setIsTeleportCirclesEnable,isTeleportCirclesEnable, currentView, selectedScene} = useContext(VrViewerDynamicContext)
    const iconRef = useRef<HTMLDivElement>(null)
    const [isScreenshoot, setIsScreenshoot] = useState(false)

    useEffect(()=>{
        if(isScreenshoot){
            setIsTeleportCirclesEnable(false)
            setTimeout(()=>{
                gl.render(scene, camera);
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d') as any;
                canvas.width = gl.domElement.width;
                canvas.height = gl.domElement.height;

                // Draw the WebGLRenderer's DOM element (with the filter) onto the canvass
                context.filter = selectedProject.globalSettings.colorCorrection.enable? `brightness(${selectedProject.globalSettings.colorCorrection.brightness}%) saturate(${selectedProject.globalSettings.colorCorrection.saturation}%) contrast(${selectedProject.globalSettings.colorCorrection.contrast}%)` : ``
                context.drawImage(gl.domElement, 0, 0);

                // Convert the canvas to a Blob
                canvas.toBlob((blob:any) => {
                    const a = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    a.href = url;
                    a.download = `${currentView.viewName}-${selectedScene.sceneName}.jpg`;
                    a.click();
                }, 'image/jpeg', 1.0);
            },100)
            setTimeout(()=>{
                setIsTeleportCirclesEnable(true)
                setIsScreenshoot(false)
            },200)
        }
    },[isScreenshoot])
    return ( 
        <div 
            ref={iconRef}
            className='text-white no-select'
            style={{
                padding:`0.5rem`,
                cursor:`pointer`,
                zIndex:`50`,
                fontSize:`3rem`,
                
                opacity:`70%`
            }}
            onClick={()=>{
                setIsScreenshoot(true)
            }}
            onMouseEnter={()=>{
                if(iconRef.current){
                    iconRef.current.style.transition=`all 0.15s ease-out`
                    iconRef.current.style.transform=`scale(1.2)`
                }
            }}
            onMouseLeave={()=>{
                if(iconRef.current){
                    iconRef.current.style.transform=`scale(1.0)`
                }
            }}
        >
            <FaCamera/>
        </div>
     );
}
 
export default ScreenshootUi;