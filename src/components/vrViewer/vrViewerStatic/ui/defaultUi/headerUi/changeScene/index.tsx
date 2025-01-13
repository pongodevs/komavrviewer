import { useContext, useEffect, useRef, useState } from "react";
import ScenePicker from "./scenePicker";
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';

const ChangeScene = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const sceneRef = useRef<HTMLDivElement>(null)
    
    return (
        <div
            className="no-select"
            style={{
                zIndex:`1`,
                top:`15rem`,
                cursor:`pointer`,
                position:`fixed`,
            }}
            
        >
            <div
                style={{
                    position:`absolute`,
                    transform:`translateX(-12rem)`,
                    display:`flex`,
                    flexDirection:`column`,
                    gap:`1.5rem`
                }}
                ref={sceneRef}
                onMouseEnter={()=>{
                    //Scene
                    if(sceneRef.current){
                        sceneRef.current.style.transition = `all 0.3s`
                        sceneRef.current.style.transform = `translateX(-1rem)`
                    }
                }}
                onMouseLeave={()=>{
                    //Scene
                    if(sceneRef.current){
                        sceneRef.current.style.transition = `all 0.3s`
                        sceneRef.current.style.transform = `translateX(-12rem)`
                    }
                }}
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