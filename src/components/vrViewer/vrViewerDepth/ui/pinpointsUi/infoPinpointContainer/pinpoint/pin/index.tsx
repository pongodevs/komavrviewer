import { useContext } from "react";
import { InfoPinpointContainerContext } from "../..";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { PinpointsUiContext } from "../../..";
import { VrViewerDepthContext } from "../../../../..";

const Pin = () => {
    const {
        pin,
        setIsRenderInfo,
        pinSize,
        findCustomPinpoint,
        pinRef,
    } = useContext(InfoPinpointContainerContext)

    const { setEditedPinInfo, setIsMouseDown, isDragged, setIsEdit} = useContext(PinpointsUiContext)

    const {isEditorMode, setEnableOrbitControl, isUploading} = useContext(VrViewerDepthContext)
    
    return (  
        <div
            ref={pinRef}
            className='no-select'
            draggable={false}
            style={{
                position:`relative`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                opacity:`${findCustomPinpoint.opacity}%`
            }}

            onMouseDown={()=>{
                if(isEditorMode){
                    setEnableOrbitControl(false)
                    setIsMouseDown(true)
                    setIsEdit({
                        pinId:pin._id,
                        type:'dragPin'
                    })
                }
            }}
            onMouseUp={()=>{
                if(isEditorMode && !isDragged){
                    setEditedPinInfo(pin)
                }
            }}
            onMouseEnter={()=>{
                if(!isEditorMode){
                    setIsRenderInfo(true)
                    if(pinRef.current){
                        pinRef.current.style.pointerEvents = `none`
                    }
                }
            }}
        >
            {findCustomPinpoint?.imageUrl === ''?
                <BsFillInfoCircleFill
                    size={pinSize}
                    style={{
                        opacity:`100%`,
                        textShadow:`0px 0px 20px black`
                    }}
                />
            :
                <img
                    draggable={false}
                    src={findCustomPinpoint?.imageUrl}
                    style={{
                        width:`${pinSize}px`,
                    }}
                />
            }
        </div>
    );
}
 
export default Pin;