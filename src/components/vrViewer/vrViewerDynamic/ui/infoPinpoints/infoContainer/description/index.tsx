import { useContext, useEffect, useRef, useState } from "react";
import { InfoContainerContext } from "..";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { infoPinpointObject, pinpointObject } from "@/types/vrProjectType";
import { InfoPinpointsContext } from "../..";

const Description = () => {
    const {isEditorMode, setIsDragInfoPinpoint, setEnableOrbitControl} = useContext(VrViewerDynamicContext)

    const {isShowDescription, setIsShowDescription, pin} = useContext(InfoContainerContext)
    const {editedInfoPinpoint, setEditedInfoPinpoint} = useContext(InfoPinpointsContext)
    const [isDoubleClick, setIsDoubleClick] = useState(false)
    
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    useEffect(()=>{
        const handleEnter = (e:KeyboardEvent)=>{
            if(e.key === 'Enter' && !e.shiftKey){
                if(textareaRef.current){
                    console.log(textareaRef.current)
                    console.log(pin._id)
                    console.log(editedInfoPinpoint._id)
                    if(pin._id == editedInfoPinpoint._id){
                        pin.description = textareaRef.current.value
                    }
                    setEditedInfoPinpoint(infoPinpointObject)
                    setIsDoubleClick(false)
                }
            }
            if(e.key == 'Escape'){
                setIsDoubleClick(false)
                setEditedInfoPinpoint(infoPinpointObject)
            }
        }

        addEventListener('keydown',handleEnter)

        return()=>{
            removeEventListener('keydown', handleEnter)
        }
    },)
    return (  
        <div
            className="bg-dark-grey"
            style={{
                position:`absolute`,
                transform:`translateY(3rem)`,
                padding:`2rem`,  
                borderRadius:`4px`,
                width:`12rem`,
                opacity:isShowDescription || isEditorMode?`80%`:`0%`,
                transition:`all 0.2s`,
                fontSize:`1.2rem`,
                pointerEvents:isEditorMode?`initial`:`none`
            }}
            onDoubleClick={()=>{
                // if(pin._id == )
                setIsDoubleClick(true)
                setEditedInfoPinpoint(pin)
                console.log(pin)
                
                if(textareaRef.current){
                    textareaRef.current.value = pin.description
                }
   
            }}
            onMouseMove={()=>{
                setEnableOrbitControl(false)
            }}
            onMouseLeave={()=>{
                setEnableOrbitControl(true)
            }}
        >
            <div
                style={{
                    display:!isDoubleClick?`initial`:`none`
                }}
            >
                {pin.description === ''? 'Double click to edit description...': pin.description}
            </div>
            <textarea 
                ref={textareaRef}
                className='text-white'
                rows={10}
                style={{
                    width:`100%`,
                    background:`none`,
                    fontWeight:`400`,
                    display:isDoubleClick?`initial`:`none`
                }}
            />
        </div>
    );
}
 
export default Description;