import { useContext, useEffect, useRef, useState } from "react";
import ScenePicker from "./scenePicker";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';


const ChangeScene = () => {
    const {selectedProject} = useContext(VrViewerDynamicContext)
    const sceneRef = useRef<HTMLDivElement>(null)
    
    return (
        <div
            className="no-select"
            style={{
                width:`10rem`,
                height:`10rem`,
                zIndex:`1`,
                top:`6rem`,
                right:`3rem`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                cursor:`pointer`,
                position:`fixed`,
            }}
            onMouseEnter={()=>{
                //Scene
                if(sceneRef.current){
                    sceneRef.current.style.transition = `all 0.3s`
                    sceneRef.current.style.transform = `translateX(0rem)`
                }
            }}
            onMouseLeave={()=>{
                //Scene
                if(sceneRef.current){
                    sceneRef.current.style.transition = `all 0.3s`
                    sceneRef.current.style.transform = `translateX(12rem)`
                }
            }}
        >
            <div
                style={{
                    position:`absolute`,
                    transform:`translate(12rem)`
                }}
                ref={sceneRef}
            >
                {selectedProject?.scenes.map((scene, index)=>
                    <ScenePicker
                        key={index}
                        scene={scene}
                    />
                )}
            </div>
        </div>
    );
}
 
export default ChangeScene;