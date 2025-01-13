import { useContext, useEffect, useRef, useState } from "react";
import { InfoPinpointContainerContext } from "../../..";
import { VrViewerStaticContext } from "../../../../../..";
import Header from "./header";
import Description from "./description";
import Url from "./url";
import LineDivider from "./lineDivider";
import ResizeHandle from "./resizeHandle";
import Images from "./images";
import Close from "./close";
import { PinpointsUiContext } from "../../../..";
import BlackOverlay from "./blackOverlay";

const Info = () => {
    const {isEditorMode, setEnableOrbitControl, setCurrentView, isUploading} = useContext(VrViewerStaticContext)

    const {
        isEdit, setIsEdit,
        setMouseStartPosition,  
        setInfoStartPosition, 
        isMouseDown, setIsMouseDown, 
    } = useContext(PinpointsUiContext)
    
    const {pin, 
        infoPadding,
    } = useContext(InfoPinpointContainerContext)
    
    return (    
        <div
            style={{
                top:pin.info.position.y <= 0? 0 :`initial`,
                bottom:pin.info.position.y > 0? 0 :`initial`,
                left:pin.info.position.x <= 0? 0 : `initial`,
                right:pin.info.position.x > 0? 0 : `initial`,
                position:`absolute`,
                width:`${pin.info.width}px`,
                height:`${pin.info.height}px`,
                overflow:`hidden`,
                borderRadius:`${infoPadding/2}px`,

            }}
        >
            {/* {isUploading?
                <BlackOverlay/>
            :null} */}
            <div
                style={{
                    background:`rgba(0,0,0,0.7)`,
                    padding:`${infoPadding}px`,
                    width:`${pin.info.width - (infoPadding*2)}px`,
                    height:`${pin.info.height - (infoPadding*2)}px`,
                    overflow:`hidden`,
                    cursor:`initial`,
                    display:`flex`,
                    flexDirection:`column`,
                    gap:`1rem`
                }}
                onMouseDown={(e)=>{
                    if(isEditorMode){
                        setIsMouseDown(true)
                        setEnableOrbitControl(false)
                        const con1 = isEdit.type !== 'editHeader'
                        const con2 = isEdit.type !== 'editDescription'
                        const con3 = isEdit.type !== 'editUrl'
                        if( con1 && con2 && con3){
                            setIsEdit({
                                pinId:pin._id,
                                type:'dragInfo'
                            })
                        }                        
                        setMouseStartPosition({
                            x:e.clientX,
                            y:e.clientY
                        })
                        setInfoStartPosition({
                            x:pin.info.position.x,
                            y:pin.info.position.y
                        })
                    }
                }}
            >
                
                {isEditorMode?
                    <Close/>
                :null}
                <Header/>
                <LineDivider/>
                {pin.info.description !== '' || isEditorMode?
                    <Description/>
                :null}
                {pin.info.images.imageList.length > 0 || isEditorMode?
                    <Images/>
                :null}
                {pin.info.url !== '' || isEditorMode?
                    <Url/>
                :null}
            </div>
            {isEditorMode?
                <ResizeHandle/>
            :null}
        </div>
    );
}
 
export default Info;