import { useContext, useRef } from "react";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { InfoContainerContext } from "..";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

const Icon = () => {
    const {isMouseDown, setIsMouseDown, pin, setIsShowDescription, iconRef, pinpointRef} = useContext(InfoContainerContext)
    const {setSelectedDraggedInfoPinpoint, isEditorMode, isDollHouseMode} = useContext(VrViewerDynamicContext)
    
    return (  
        <div
            ref={iconRef}
            onMouseDown={()=>{
                setIsMouseDown(true)
                if(isEditorMode){
                    if(pinpointRef.current){
                        pinpointRef.current.style.pointerEvents = `none`
                    }
                    setSelectedDraggedInfoPinpoint(pin)
                }
            }}

            onMouseEnter={()=>{
                setIsShowDescription(true)
            }}
            onMouseLeave={()=>{
                setIsShowDescription(false)
            }}
        >
            <BsFillInfoCircleFill
                size={isDollHouseMode? 10: 20}
            />
        </div>
    );
}
 
export default Icon;