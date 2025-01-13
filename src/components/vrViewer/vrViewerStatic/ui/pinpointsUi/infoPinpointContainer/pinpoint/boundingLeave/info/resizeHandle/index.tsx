import { VrViewerStaticContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerStatic";
import { useContext } from "react";
import { InfoPinpointContainerContext } from "../../../..";
import { PinpointsUiContext } from "../../../../..";
import { pinpointObject } from "@/types/vrProjectType";

const ResizeHandle = () => {
    const {setEnableOrbitControl, isEditorMode} = useContext(VrViewerStaticContext)
    const {
        setMouseStartPosition,
        setInfoStartSize,
        setIsMouseDown, 
        isDragged,
        setIsEdit,
        isEdit
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
                opacity:`50%`
            }}
            onMouseDown={(e)=>{
                if(isEditorMode && !isDragged){
                    setIsMouseDown(true)
                    setEnableOrbitControl(false)
                    setIsEdit({
                        pinId:pin._id,
                        type:'resizeInfo'
                    })
                    setMouseStartPosition({
                        x:e.clientX,
                        y:e.clientY
                    })
                    setInfoStartSize({
                        width:pin.info.width,
                        height:pin.info.height,
                    })
                }
            }}
        />
    );
}
 
export default ResizeHandle;