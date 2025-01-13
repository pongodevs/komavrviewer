import { VrViewerContext } from "@/components/vrViewer";
import { VrViewerStaticContext } from "@/components/vrViewer/vrViewerStatic";
import { PinpointType } from "@/types/vrProjectType";
import { useContext, useEffect, useRef, useState } from "react";
import { IoIosClose, IoIosPin } from "react-icons/io";


const Pinpoint = ({pin}:{pin:PinpointType}) => {
    const {draggedView, 
        selectedMap, setSelectedMap,mapContainerRef, 
        teleport, selectedScene, 
        setSelectedPinpoint, selectedPinpoint, isEditorMode, 
        currentView,
        setEnableOrbitControl,
        player
    } = useContext(VrViewerStaticContext)
    
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    const [isMouseDown, setIsMouseDown] = useState(false)
    const [isDrag, setIsDrag] = useState(false)
    const pinRef = useRef<HTMLDivElement>(null)
    const labelRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        if(isEditorMode){
            const handleMouseUp = (e:any)=>{
                setIsMouseDown(false)
                
            }
            const handleMouseMove=(e:any)=>{
                if(isMouseDown){
                    setIsDrag(true)
                    if(mapContainerRef.current){
                        const mapBound = mapContainerRef.current.getBoundingClientRect()
                        // console.log(mapBound)
                        const left = (e.clientX - mapBound.left) /mapBound.width * 100
                        const top = (e.clientY - mapBound.top) /mapBound.height * 100
                        pin.position.x = left
                        pin.position.y = top
    
                        setSelectedProject(prev=>{return {...prev}})
                    }
                }
            }
            addEventListener('mouseup', handleMouseUp)
            addEventListener('mousemove', handleMouseMove)
            return()=>{
                removeEventListener('mouseup', handleMouseUp)
                removeEventListener('mousemove', handleMouseMove)
            }
        }
    },)

    const getPinClass = ()=>{
        if(!isEditorMode) return `text-white`
        if(pin.toViewId === "") return `text-blue`
        return `text-white`
    }

    const getOpacity = ()=>{
        if(isEditorMode || selectedProject.globalSettings.showLabel.mapPinpoint === 'on') return `100%`
        if(selectedProject.globalSettings.showLabel.mapPinpoint === 'off') return `0%`
        return `0%`
    }
    return (  
        <div
            className={getPinClass()}
            style={{
                cursor:`pointer`,
                width:`3rem`,
                height:`3rem`,
                position:`absolute`,
                left:`${pin.position.x}%`,
                top:`${pin.position.y}%`,
                transform:`translate(-50%,-50%)`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                opacity:`100%`,
                
            }}
            onMouseEnter={()=>{
                if(!isEditorMode){
                    if(pinRef.current){
                        pinRef.current.style.transform = `scale(1.2)`
                        pinRef.current.className = `text-gold`
                    }
                    if(selectedProject.globalSettings.showLabel.mapPinpoint === 'hover'){
                        if(labelRef.current){
                            labelRef.current.style.opacity = `100%`
                        }
                    }
                }
                
            }}
            onMouseLeave={()=>{
                if(!isEditorMode){
                    if(pinRef.current){
                        pinRef.current.style.transform = `scale(1.0)`
                        pinRef.current.className = `text-white`
                    }
                    if(selectedProject.globalSettings.showLabel.mapPinpoint === 'hover'){
                        if(labelRef.current){
                            labelRef.current.style.opacity = `0%`
                        }
                    }
                }
            }}
            onMouseDown={()=>{
                if(isEditorMode){
                    setEnableOrbitControl(false)
                    setIsMouseDown(true)
                }
            }}
            onMouseUp={()=>{
                // Set to view id in pin from dragged view
                if(draggedView._id !== ''){
                    pin.thumbnailUrl = draggedView.thumbnailUrl
                    pin.toViewId = draggedView._id
                    setEnableOrbitControl(true)
                    setSelectedProject(prev=>{return {...prev}})
                }
                
            }}
        >   
            <div
                ref={pinRef}
                // className='bg-blue'
                style={{
                    zIndex:`1`,
                    transition:`all 0.2s ease-out`,
                    display:`flex`,
                    justifyContent:`center`,
                    alignItems:`center`,
                    opacity:selectedPinpoint._id !== pin._id? `100%`:`0%`
                }}
                onMouseUp={()=>{
                    // Teleport only active when not dragging, and not dragging view
                    console.log(draggedView)
                    if(!isDrag && draggedView._id === ''){
                        const findView = selectedScene.viewList.find(view=>view._id === pin.toViewId)
                        if(findView){
                            if(!player.isTeleport){
                                teleport(findView)
                                setSelectedPinpoint(pin)
                            }
                        }
                    }
                    setIsDrag(false)
                }}
            >
                <IoIosPin
                    size={30}
                />
                {/* Delete pinpoint */}
                {isEditorMode?
                    <div
                        className="text-red"
                        style={{
                            cursor:`pointer`,
                            position:`absolute`,
                            top:`-2rem`,
                            right:`-1rem`,
                            zIndex:`1`,
                            fontSize:`2rem`,
                            fontWeight:`600`,
                            display:`flex`,
                            justifyContent:`center`,
                            alignItems:`center`
                        }}
                        onClick={()=>{
                            console.log(selectedMap.pinpoints)
                            console.log(selectedMap.pinpoints.filter(p=>p._id !== pin._id))
                            selectedMap.pinpoints = selectedMap.pinpoints.filter(p=>p._id !== pin._id)
                            setSelectedProject(prev=>{return {...prev}})
                        }}
                    >
                        x
                    </div>
                :null}
            </div>

            {/* View Indication */}
            {selectedScene.viewList.find(view=>view._id === pin.toViewId)?.labelName !== ''?
                <div
                    ref={labelRef}
                    className="text-white no-select"
                    style={{
                        opacity:getOpacity(),
                        fontSize:`0.8rem`,
                        background:`rgba(0,0,0,0.5)`,
                        padding:`0.5rem 1rem`,
                        borderRadius:`4px`,
                        position:`absolute`,
                        transform:`translateY(3rem)`,
                        fontWeight:`500`,
                        transition:`all 0.2s`,
                    }}
                >
                    {selectedScene.viewList.find(view=>view._id === pin.toViewId)?.labelName}
                </div>
            :null}

        </div>
    );
}
 
export default Pinpoint;