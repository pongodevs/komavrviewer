import {useRef} from 'react';
import {useState,useEffect} from 'react';
import {useContext} from 'react';
import * as THREE from 'three'
import { v4 } from "uuid";
import { PinpointType, pinpointObject } from "@/types/vrProjectType";
import { MdLocationPin } from "react-icons/md";
import { toast } from "react-toastify";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { VrViewerDepthContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDepth';

const DraggablePin = () => {
    const {
        currentView, setCurrentView, 
        nextView, setNextView,
        mainMeshRef, camera,
        selectedMap, setSelectedMap,
        mapContainerRef,
        selectedCustomPinpoint,
        setEnableOrbitControl,
        selectedScene, setSelectedScene
        
    } = useContext(VrViewerDepthContext)
    const {selectedProject, setSelectedProject} = useContext(VrViewerContext)
    const pinRef = useRef<HTMLDivElement>(null)
    const [isMouseDown, setIsMouseDown] = useState(false)

    useEffect(()=>{
        const handleClick = (e:any)=>{
            // console.log(e.target)
        }
        const handleMouseMove = (e:any)=>{
            
            if(pinRef.current){
                if(isMouseDown){
                    pinRef.current.style.left = `${e.clientX}px`
                    pinRef.current.style.top = `${e.clientY}px`
                    pinRef.current.style.zIndex = `3`
                }
            }
        }
        const handleMouseUp = (e:any)=>{
            // Add box to canvas
            if(isMouseDown){
                
                // If drop to map
                if(e.target === mapContainerRef.current && mapContainerRef.current){
                    const mapBound = mapContainerRef.current.getBoundingClientRect()
                    const xPercent = (e.clientX - mapBound.left)/ mapBound.width * 100
                    const yPercent = (e.clientY - mapBound.top)/ mapBound.height * 100
                    const pinpoint:PinpointType = {...pinpointObject,
                        _id:v4(),
                        labelName:'Default',
                        position:{
                            x:xPercent,
                            y:yPercent,
                            z:0,
                        },
                        redirectUrl:'',
                        thumbnailUrl:'',
                        toViewId:'',
                        customPinpointId:selectedCustomPinpoint._id,
                        info:{...pinpointObject.info,
                            _id:v4()
                        }
                    }

                    selectedMap.pinpoints = [...selectedMap.pinpoints,pinpoint]
                    setSelectedProject(prev=>{return {...prev}})
                }
                // If drop to view
                else{
                    // Raycast to mesh object
                    const clientHeight = innerHeight;
                    const clientWidth = innerWidth;
                    const mouse = new THREE.Vector2();

                    mouse.x = (e.clientX / clientWidth) * 2 - 1;
                    mouse.y = -(e.clientY / clientHeight) * 2 + 1;

                    const raycaster = new THREE.Raycaster();

                    raycaster.setFromCamera(mouse, camera);

                    const intersects = raycaster.intersectObject(mainMeshRef.current)
                    console.log(intersects[0])
                    
                    // Add pin to currentView
                    const intersectPosition = intersects[0].point
                    const pinpoint:PinpointType = {...pinpointObject,
                        _id:v4(),
                        labelName:`Default`,
                        position:{
                            x:intersectPosition.x,
                            y:intersectPosition.y,
                            z:intersectPosition.z
                        },
                        redirectUrl:'',
                        thumbnailUrl:'',
                        toViewId:'',
                        customPinpointId:selectedCustomPinpoint._id,
                        info:{...pinpointObject.info,
                            _id:v4()
                        }
                    }
                    // If no selectedView
                    if(currentView._id === ''){
                        toast.error('Please select a view first')
                    } 
                    else{
                        // To Current View
                        currentView.pinpoints = [...currentView.pinpoints,pinpoint]

                        // Selected Scene
                        selectedScene.viewList = selectedScene.viewList.map(view=>{
                            if(view.viewName === currentView.viewName){
                                return {...view,
                                    pinpoints: [...view.pinpoints, pinpoint]
                                }
                            }
                            else{
                                return view
                            }
                        })

                        // To Selected Project
                        selectedProject.scenes = selectedProject.scenes.map(scene=>{
                            return {...scene,
                                viewList: scene.viewList.map(view=>{
                                    if(view.viewName === currentView.viewName){
                                        return {...view,
                                            pinpoints:[...view.pinpoints,pinpoint]
                                        }
                                    }
                                    else{
                                        return {...view}
                                    }
                                })
                            }
                        })
                        setSelectedProject(prev=>{return {...prev}})
                    }
                    
                }
                
            }
            
            
            // Reset pin ref to original location
            if(pinRef.current){
                pinRef.current.style.left = ``
                pinRef.current.style.top = ``
                pinRef.current.style.position = `initial`
                pinRef.current.style.transform = ``
            }

            setIsMouseDown(false)
        }

        addEventListener('mouseup',handleMouseUp)
        addEventListener('mousemove',handleMouseMove)
        addEventListener('click',handleClick)


        return()=>{
            removeEventListener('mouseup',handleMouseUp)
            removeEventListener('mousemove',handleMouseMove)
            removeEventListener('click',handleClick)
        }
    },[isMouseDown])

    const getDefaultIcon = ()=>{
        if(selectedCustomPinpoint.type === 'info'){
            return (
                <BsFillInfoCircleFill
                    size={100}
                    style={{
                        opacity:`100%`,
                        textShadow:`0px 0px 20px black`
                    }}
                />
            )
        }
        if(selectedCustomPinpoint.type === 'view'){
            return (
                <MdLocationPin
                    size={100}
                    style={{
                        opacity:`100%`,
                        textShadow:`0px 0px 20px black`
                    }}
                />
            )
        }                            
    }
    return (  
        <>
            <div
                onMouseDown={(e)=>{
                    setEnableOrbitControl(false)
                    setIsMouseDown(true)
                    if(pinRef.current){
                        pinRef.current.style.left = `${e.clientX}px`
                        pinRef.current.style.top = `${e.clientY}px`
                        pinRef.current.style.position = `fixed`
                        pinRef.current.style.transform = `translate(-50%,-50%)`
                    }
                    
                }}

                style={{
                    zIndex:`1`,
                    display:`flex`,
                    justifyContent:`center`,
                    position:`relative`
                }}
            >
                <div
                    ref={pinRef}
                    style={{
                        pointerEvents:`none`,
                        zIndex:`2`,
                    }}
                >
                    {selectedCustomPinpoint.imageUrl !== ''?
                        <img
                            src={selectedCustomPinpoint.imageUrl}
                            style={{
                                width:`100%`,
                                height:`100%`
                            }}
                        />
                    :
                        getDefaultIcon()
                    }
                    
                </div>
            </div>
        </>
    );
}
 
export default DraggablePin;