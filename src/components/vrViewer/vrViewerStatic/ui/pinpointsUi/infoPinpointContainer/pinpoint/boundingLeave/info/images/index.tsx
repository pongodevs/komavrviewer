import gsap from "gsap";
import { Dispatch, SetStateAction, createContext, useContext, useRef, useState } from "react";
import { InfoPinpointContainerContext } from "../../../..";
import ResizeHandle from "./resizeHandle";
import BlueOverlay from "./blueOverlay";
import { VrViewerStaticContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerStatic";
import ImageInfo from "./imageInfo";
import useAnimation from "@/hooks/animation";

type ImageContextType = {
    isMouseEnter:boolean,
    setIsMouseEnter:Dispatch<SetStateAction<boolean>>,
    blueOverlayRef:HTMLDivElement | any,
    imageContainerRef:any
}
export const ImagesContext = createContext<ImageContextType>({} as ImageContextType)
const Images = () => {
    const {isEditorMode} = useContext(VrViewerStaticContext)
    const {pin} = useContext(InfoPinpointContainerContext)
    const imageContainerRef = useRef<HTMLDivElement>(null as any)

    const [isMouseEnter, setIsMouseEnter] = useState(false)
    const blueOverlayRef = useRef<HTMLDivElement>(null as any) as any

    const {animate} = useAnimation()
    return (  
        <ImagesContext.Provider
            value={{
                isMouseEnter, setIsMouseEnter,
                blueOverlayRef,
                imageContainerRef
            }}
        >
            <div
                ref={imageContainerRef}
                style={{
                    background:isEditorMode? `rgba(0,0,0,0.2)` : ``,
                    display:`flex`,
                    gap:`4px`,
                    overflowX:`auto`,
                    overflowY:`hidden`,
                    height:`${pin.info.images.containerHeight}px`,
                    width:`100%`,
                    position:`relative`,
                    justifyContent:pin.info.images.imageList.length === 0? `center`:`initial`,
                    alignItems:pin.info.images.imageList.length === 0? `center`:`initial`,
                }}
                onWheel={(e)=>{
                    const offset = 50
                    if(e.deltaY > 0){
                        animate(imageContainerRef.current,{
                            scrollLeft: imageContainerRef.current.scrollLeft + offset,
                            duration:0.2,
                            ease:`power2.out`
                        })
                    }
                    if(e.deltaY < 0){
                        animate(imageContainerRef.current,{
                            scrollLeft: imageContainerRef.current.scrollLeft - offset,
                            duration:0.2,
                            ease:`power2.out`
                        })
                    }
                }}

                onDragEnter={(e)=>{
                    if(isEditorMode){
                        e.preventDefault()
                        e.stopPropagation()
                        setIsMouseEnter(true)
                        if(blueOverlayRef.current){
                            blueOverlayRef.current.style.pointerEvents = `all`
                        }
                    }
                }}
                onDragOver={(e)=>{
                    if(isEditorMode){
                        e.preventDefault()
                        e.stopPropagation()
                    }
                }}
            >
                <BlueOverlay/>
                
                {pin.info.images.imageList.map((image,index)=>
                    <ImageInfo
                        key={index}
                        image={image}
                    />
                )}
                {isEditorMode?
                    <ResizeHandle/>
                :null}
                {isEditorMode && pin.info.images.imageList.length == 0?
                    `Drag and drop images here.`
                :null}
            </div>
        </ImagesContext.Provider>
    );
}
 
export default Images;