import { useContext, useEffect, useRef } from "react";
import { InfoPinpointContainerContext} from "../..";
import Info from "./info";
import _ from "lodash";
import { pinpointObject } from "@/types/vrProjectType";
import { PinpointsUiContext } from "../../..";
import { VrViewerDepthContext } from "../../../../..";

const BoundingLeave = () => {
    const {isEditorMode} = useContext(VrViewerDepthContext)
    const {editedPinInfo, isMouseDown, isEdit,} = useContext(PinpointsUiContext)
    const {pin,
        pinSize, 
        isRenderInfo,
        setIsRenderInfo, 
        pinRef,
    } = useContext(InfoPinpointContainerContext)

    const getWidth = ()=>{
        if(Math.abs(pin.info.position.x) < pin.info.width){
            return pin.info.width
        }
        else{
            return Math.abs(pin.info.position.x)
        }
    }
    const getHeight = ()=>{
        if(Math.abs(pin.info.position.y) < pin.info.height){
            return pin.info.height
        }
        else{
            return Math.abs(pin.info.position.y)
        }

    }

    const infoRef = useRef<HTMLDivElement>(null as any)
    const animationDuration = 0.1 // In seconds
    

    // Rendering only works for non editor mode
    const handleAppearAnimation = ()=>{
        if(infoRef.current){
            setTimeout(()=>{
                infoRef.current.style.display = `initial`
                setTimeout(()=>{
                    infoRef.current.style.opacity = `100%`
                },10)
            },10)
        }
    }

    const handleFadeoutAnimation =()=>{
        if(infoRef.current){
            infoRef.current.style.opacity = `0%`
        }
        setTimeout(()=>{
            if(infoRef.current){
                infoRef.current.style.display = `none`
            }
        },animationDuration * 1000)
    }
    useEffect(()=>{
        if(!isEditorMode){
            if(isRenderInfo){
                console.log('appear')
                handleAppearAnimation()
            }
            if(!isRenderInfo){
                handleFadeoutAnimation()
            }
        }
    },[isRenderInfo, isEditorMode])


    // Only works for editor mode
    useEffect(()=>{
        // return
        if(isEditorMode){
            if(pin._id === editedPinInfo._id){
                handleAppearAnimation()
            }
            else{
                handleFadeoutAnimation()
            }
        }
    },[editedPinInfo])

    return (  
        <div
            ref={infoRef}
            style={{
                opacity:`0%`,
                position:`relative`,
                zIndex:10000,
                transition:`opacity ${animationDuration}s`,
            }}
            onMouseLeave={()=>{
                if(!isEditorMode){
                    if(!isMouseDown && isEdit.type === ''){
                        setIsRenderInfo(false)
                        setTimeout(()=>{
                            if(pinRef.current){
                                pinRef.current.style.pointerEvents = `all`
                            }
                        },100)
                    }
                }
            }}
        >   
            {/* Anchor */}
            <div
                style={{
                    position:`absolute`,
                    width:`${pinSize}px`,
                    height:`${pinSize}px`
                }}
            />
            {/* Bounding Box */}
            <div
                style={{
                    position:`absolute`,
                    transform:`translate(${pin.info.position.x/2}px, ${pin.info.position.y/2}px)`,
                }}
            >
                <div
                    style={{
                        position:`absolute`,
                        transform:`translate(-50%,-50%)`,
                        left:`${pinSize/2}px`,
                        top:`${pinSize/2}px`,
                        width:`${getWidth() }px`,
                        height:`${getHeight()}px`,
                        overflow:`hidden`
                    }}
                >
                    <Info/>
                </div>
            </div>
        </div>

    );
}
 
export default BoundingLeave;