
import {useContext, useEffect, useRef,useState} from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

const EnterEditorMode = () => {
    const {setIsEditorMode, isEditorMode, selectedProject} = useContext(VrViewerDynamicContext)
    const logoRef = useRef<HTMLDivElement>(null)

    return (  
        <div
            className="text-white"
            style={{
                cursor:`initial`,
                zIndex:`2`,
                display:`flex`,
                position:`fixed`,
                height:`100%`,
                right:`0`,
                alignItems:`center`,
                pointerEvents:`none`
            }}
        >
            <div
                style={{
                    display:`fixed`,
                    pointerEvents:`all`,
                    transform:isEditorMode?`scale(-1)`:`scale(1)`,
                    transition:`all 0.2s`
                }}
                onMouseEnter={()=>{
                    if(logoRef.current){
                        logoRef.current.style.transform = `scale(1.2)`
                    }
                }}
                onMouseLeave={()=>{
                    if(logoRef.current){
                        logoRef.current.style.transform = `scale(1.0)`
                    }
                }}
            >
                <div
                    ref={logoRef}
                    style={{
                        transition:`all 0.2s`
                    }}
                >
                    <IoIosArrowBack
                        size={35}
                        onClick={async()=>{
                            setIsEditorMode(prev=>!prev)
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
 
export default EnterEditorMode;