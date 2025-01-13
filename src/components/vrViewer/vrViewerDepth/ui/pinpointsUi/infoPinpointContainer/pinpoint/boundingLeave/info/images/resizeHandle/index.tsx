import { useContext } from "react";
import { InfoPinpointContainerContext } from "../../../../..";
import { PinpointsUiContext } from "../../../../../..";
import { VrViewerDepthContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerDepth";

const ResizeHandle = () => {
    const {setEnableOrbitControl, isEditorMode} = useContext(VrViewerDepthContext)
    const {
        setMouseStartPosition,
        setImageHeightStart,
        setIsMouseDown, 
        isEdit,
        setIsEdit,
        isDragged
    } = useContext(PinpointsUiContext)

    const {
        pin, 
    } = useContext(InfoPinpointContainerContext)
    const size = 10
    return (  
        <img
            draggable='false'
            src="/images/icons/resize_handle.svg"
            style={{
                position:`absolute`,
                right:`${size/2}px`,
                bottom:`${size/2}px`,
                width:`${size}px`,
                height:`${size}px`,
                filter:`brightness(0) invert(1)`,
                cursor:`e-resize`,
                opacity:`50%`,
                zIndex:5
            }}
            onMouseDown={(e)=>{
                
                if(isEditorMode && !isDragged){
                    setTimeout(()=>{
                        setIsMouseDown(true)
                        setEnableOrbitControl(false)
    
                        setIsEdit({
                            pinId:pin._id,
                            type: 'resizeImage'
                        })
                        setMouseStartPosition({
                            x:e.clientX,
                            y:e.clientY
                        })
                        setImageHeightStart(pin.info.images.containerHeight)
                    },10)
                }
            }}
        />
    );
}
 
export default ResizeHandle;