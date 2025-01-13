import { ViewListType, viewListObject } from "@/types/vrProjectType";
import {useRef,useState,useContext, useEffect} from 'react';
import { isDesktop } from 'react-device-detect';
import { ImageNavigatorContext } from '../index';
import {TailSpin} from "react-loading-icons";
import {createContext} from 'react';
import Callout from "./callout";
import { useRouter } from "next/router";
import { VrViewerStaticContext } from "../../../../..";
import { VrViewerContext } from "@/components/vrViewer";


type ImageListContextType = {
    calloutRef:any,
    view:ViewListType
}
export const ImageListContext = createContext<ImageListContextType>({} as ImageListContextType) 

const ImageList = ({view,index}:{view:ViewListType,index:number}) => {
    const router = useRouter()
    const {projectId} = router.query
    const {
        player, cameraRig,mainMeshRef, 
        setCurrentView, setNextView, currentView, teleport,
        setDraggedView,
        draggedView,
        setSelectedScene,
        selectedScene,
        isEditorMode,
        setSelectedPinpoint,
        selectedMap,
        setSelectedMap,
        borderRadius,
        setEnableOrbitControl
    }=  useContext(VrViewerStaticContext)

    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)

    const {height} = useContext(ImageNavigatorContext)

    
    const calloutRef = useRef<HTMLDivElement>(null)
    const hoverBorderRef = useRef<HTMLDivElement>(null)
    const imageDivRef = useRef<HTMLDivElement>(null)

    const [isMouseDown, setIsMouseDown] = useState(false)
    const [isDrag, setIsDrag] = useState(false)

    const minusHeight = `4rem`

    // Dragging event when in edit mode
    useEffect(()=>{
        if(isEditorMode){
            const handleMouseMove = (e:any)=>{
                if(isMouseDown){
                    setIsDrag(true)
                    if(imageDivRef.current){
                        imageDivRef.current.style.position = `fixed`
                        imageDivRef.current.style.left = `${e.clientX}px`
                        imageDivRef.current.style.top = `${e.clientY}px`
                        imageDivRef.current.style.transform = `translate(-50%, -50%)`
                        imageDivRef.current.style.pointerEvents = `none`
                        imageDivRef.current.style.zIndex = `5`
                    }
                }
            }
            const handleMouseUp = (e:any)=>{
                setIsDrag(false),
                setIsMouseDown(false)
                if(isMouseDown){
                    if(imageDivRef.current){
                        imageDivRef.current.style.position = `absolute`
                        imageDivRef.current.style.left = ``
                        imageDivRef.current.style.top = ``
                        imageDivRef.current.style.transform = ``
                        imageDivRef.current.style.pointerEvents = `initial`
                        imageDivRef.current.style.zIndex = `1`
                        setDraggedView(viewListObject)
                    }
                }
            }
            addEventListener('mouseup',handleMouseUp)
            addEventListener('mousemove',handleMouseMove)
    
            return()=>{
                removeEventListener('mouseup',handleMouseUp)
                removeEventListener('mousemove',handleMouseMove)
            }
        }
    },[isMouseDown])

    const imageContainerRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        if(imageContainerRef.current){
            imageContainerRef.current.style.transition = `all 0.5s`
            imageContainerRef.current.style.opacity = `0%`
        }

        setTimeout(()=>{
            if(imageContainerRef.current){
                imageContainerRef.current.style.transition = `all 0.5s`
                imageContainerRef.current.style.opacity = `100%`
            }
        },500)

        setTimeout(()=>{
            if(imageContainerRef.current){
                imageContainerRef.current.style.transition = `all 0s`
            }
        },1000)
    },[projectId])
    return (  
        <ImageListContext.Provider
            value={{
                view,
                calloutRef
            }}
        >
            <div
                ref={imageContainerRef}
                style={{
                    margin:`1rem 0.5rem 2rem 0.5rem`,
                    position:`relative`,
                    minWidth:`calc(${height} - ${minusHeight})`,
                    height:`calc(${height} - ${minusHeight})`,
                    display:`flex`,
                    justifyContent:`center`,
                }}
            >
                <div
                    style={{
                        width:`100%`,
                        height:`100%`,
                        position:`relative`
                    }}
                >
                    {/* Image container */}
                    <div
                        ref={imageDivRef}
                        style={{
                            position:`absolute`,
                            width:`calc(${height} - ${minusHeight})`,
                            height:`calc(${height} - ${minusHeight})`,
                            cursor:`pointer`,
                            
                        }}
                        onMouseUp={()=>{
                            if(isEditorMode){
                                // Delete Callouts
                                if(isDesktop){
                                    const body:any = document.querySelector('body');
                                    const calloutDiv = document.getElementById('callout')
                                    const triangleDiv = document.getElementById('triangle')
                                    if(calloutDiv){
                                        body.removeChild(calloutDiv)
                                    }
                                    if(triangleDiv){
                                        body.removeChild(triangleDiv)
                                    }
                                }
                                if(hoverBorderRef.current){
                                    hoverBorderRef.current.style.border = ``
                                }
                                // Switch order of image
                                if(draggedView._id !== ''){
                                    const newDraggedView = {...draggedView}

                                    // For Scene
                                    selectedScene.viewList = selectedScene.viewList.filter(view=>{return view._id !== newDraggedView._id})
                                    selectedScene.viewList.splice(index, 0, newDraggedView )
                                    
                                    // For Project
                                    const newViewToPush = selectedProject.scenes.map(scene=>{
                                        return {
                                            sceneId:scene._id,
                                            view:scene.viewList.find(view=>{return view._id == draggedView._id})
                                        }
                                    })
                                    selectedProject.scenes = selectedProject.scenes.map(scene=>{
                                        return {...scene,
                                            viewList:scene.viewList.filter(view=>{return view._id !== draggedView._id})
                                        }
                                    })
                                    
                                   
                                    selectedProject.scenes.forEach(scene=>{
                                        const newView = newViewToPush.find(ob=>{return ob.sceneId === scene._id})?.view as ViewListType
                                        scene.viewList.splice(index, 0, newView )
                                    })

                                    setSelectedProject(prev=>{return {...prev}})
                                }
                            }
                            
                        }}
                        onMouseDown={()=>{
                            setEnableOrbitControl(false)
                            if(isEditorMode){
                                if(!isDrag){
                                    setIsMouseDown(true)
                                    setDraggedView(view)
                                }
                            }
                        }}
                        onClick={()=>{
                            console.log('asd')
                            teleport(view)
                            // Change map
                            const findMap = selectedProject.maps.find(map=>map._id === view.mapId)
                            if(findMap){
                                setSelectedMap(findMap)
                                // Change pin
                                const findPin =findMap.pinpoints.find(pin=>pin.toViewId === view._id)
                                if(findPin){
                                    setSelectedPinpoint(findPin)
                                }
                            }
                        }}
                        
                        onMouseEnter={()=>{
                            if(!isEditorMode  && selectedProject.globalSettings.showLabel.imageNavigation === 'hover'){
                                if(calloutRef.current){
                                    calloutRef.current.style.opacity = `100%`
                                }
                            }
                            if(hoverBorderRef.current){
                                hoverBorderRef.current.style.border = `1px solid rgba(255,255,255,0.6)`
                            }
                        }}
                        onMouseLeave={()=>{
                            if(!isEditorMode && selectedProject.globalSettings.showLabel.imageNavigation === 'hover'){
                                if(calloutRef.current){
                                    calloutRef.current.style.opacity = `0%`
                                }
                            }

                            if(hoverBorderRef.current){
                                hoverBorderRef.current.style.border = ``
                            }
                        }}
                    >
                        <img
                            draggable={false}
                            style={{
                                zIndex:`2`,
                                height:`100%`,
                                borderRadius:borderRadius
                            }}
                            src={view.thumbnailUrl}
                        />
                    </div>
                    {isDesktop?
                        <Callout/>
                    :null}
                    {/* Hover Border*/}
                    <div   
                        ref={hoverBorderRef}
                        style={{
                            pointerEvents:`none`,
                            zIndex:`3`,
                            width:`calc(${height} - ${minusHeight} - 2px)`,
                            height:`calc(${height} - ${minusHeight} - 2px)`,
                            position:`absolute`,    
                            transition:`all 0.2s`,
                            borderRadius:borderRadius
                        }}
                    />
                    {/* Selected Border */}
                    <div
                        style={{
                            pointerEvents:`none`,
                            zIndex:`3`,
                            width:`calc(${height} - ${minusHeight} - 4px)`,
                            height:`calc(${height} - ${minusHeight} - 4px)`,
                            position:`absolute`,    
                            border:view._id === currentView._id?`2px solid white`:``,
                            transition:`all 0.2s`,
                            borderRadius:borderRadius
                        }}
                    />
                    
                    {/* Image Loading */}
                    {view.imageUrl === ''?
                        <div
                            className="bg-dark-grey text-light-grey"
                            style={{
                                zIndex:`3`,
                                width:`100%`,
                                height:`100%`,
                                display:`flex`,
                                justifyContent:`center`,
                                alignItems:`center`,
                                position:`relative`,
                                borderRadius:`4px`
                            }}
                        >
                            <TailSpin/>
                            {/* Progress bar */}
                            <div
                                style={{
                                    position:`absolute`,
                                    width:`90%`,
                                    height:`0.5rem`,
                                    border:`0.3px solid grey`,
                                    borderRadius:`25px`,
                                    bottom:`0.5rem`,
                                    overflow:`hidden`
                                }}
                            >
                                {/* Bar */}
                                <div
                                    id={`progress-bar-${view._id}`}
                                    className="bg-blue"
                                    style={{
                                        width:`0%`,
                                        height:`100%`,
                                        borderRadius:`25px`
                                    }}
                                >
                                </div>
                            </div>
                        </div>
                    :null}
                    {/* Map indicator */}
                    {isEditorMode?
                        <div
                            className="text-white"
                            style={{
                                position:`absolute`,
                                bottom:`1rem`,
                                width:`100%`,
                                display:`flex`,
                                justifyContent:`center`,
                                fontWeight:`600`,
                                zIndex:`1`
                            }}
                        >
                            {selectedProject.maps.find(map=>map._id === view.mapId)?.mapName}
                        </div>  
                    :null}

                </div>
            </div>
        </ImageListContext.Provider>
    );
}

export default ImageList;