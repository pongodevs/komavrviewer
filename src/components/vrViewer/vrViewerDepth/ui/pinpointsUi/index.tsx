
import {useContext, useEffect, useState, Dispatch, SetStateAction} from 'react';
import {createContext} from 'react';
import _ from 'lodash';
import { PinpointType, pinpointObject } from '@/types/vrProjectType';
import ViewPinpointContainer from './viewPinpointContainer';
import InfoPinpointContainer from './infoPinpointContainer';
import * as THREE from 'three'
import { VrViewerContext } from '../../..';
import { VrViewerDepthContext } from '../..';

type Vec2 = {
    x:number,
    y:number
}

type size = {
    width:number,
    height:number
}

export type IsEditType = {
    pinId:string
    type: '' | 'editHeader' | 'editDescription' | 'editUrl' | 'dragPin' | 'dragInfo' | 'resizeInfo' | 'resizeImage' 
}

export const isEditObject:IsEditType = {
    pinId: '',
    type: ''
}

type PinpointsUiContextType = {
    transition:boolean,

    isEdit:IsEditType,
    setIsEdit:Dispatch<SetStateAction<IsEditType>>,

    isMouseDown:boolean, 
    setIsMouseDown:Dispatch<SetStateAction<boolean>>,
    isDragged:boolean, 
    setIsDragged:Dispatch<SetStateAction<boolean>>,
    isMouseEnter:boolean, 
    setIsMouseEnter:Dispatch<SetStateAction<boolean>>,

    mouseStartPosition:Vec2, 
    setMouseStartPosition:Dispatch<SetStateAction<Vec2>>,
    infoStartPosition:Vec2, 
    setInfoStartPosition:Dispatch<SetStateAction<Vec2>>,
    infoStartSize:size,
    setInfoStartSize:Dispatch<SetStateAction<size>>,
    imageHeightStart:number, 
    setImageHeightStart:Dispatch<SetStateAction<number>>,
    editedPinInfo:PinpointType, 
    setEditedPinInfo:Dispatch<SetStateAction<PinpointType>>
}

export const PinpointsUiContext = createContext<PinpointsUiContextType>({} as PinpointsUiContextType)
const PinpointsUi = ({transition}:{transition:boolean}) => {
    const {selectedProject, setSelectedProject} = useContext(VrViewerContext)
    const {selectedScene, currentView, isAutoplay, camera, mainMeshRef, isEditorMode, setEnableOrbitControl} = useContext(VrViewerDepthContext)

    const [isEdit, setIsEdit] = useState(isEditObject)
    const [editedPinInfo, setEditedPinInfo] = useState(pinpointObject)

    const [isDragged, setIsDragged] = useState(false)
    const [isMouseDown, setIsMouseDown] = useState(false)
    const [isMouseEnter, setIsMouseEnter] = useState(false)

    const [mouseStartPosition, setMouseStartPosition] = useState({
        x:0,
        y:0
    })
    const [infoStartPosition, setInfoStartPosition] = useState({
        x:0,
        y:0,
    })

    const [infoStartSize, setInfoStartSize] = useState({
        width:0,
        height:0
    })

    const [imageHeightStart, setImageHeightStart] = useState(0)

    
    // Filtered out info with view pinpoints
    const viewPinpoints = currentView.pinpoints.map(pin=>{
        const findCustomPin = selectedProject.customPinpoints.find(p=>{return p._id === pin.customPinpointId})
        if(findCustomPin){
            if(findCustomPin.type === 'view'){
                return pin
            }
        }
    }).filter(pin=>{return pin}) as PinpointType[]
    // const infoPinpoints = _.difference(currentView.pinpoints,viewPinpoints)
    const infoPinpoints = currentView.pinpoints.map(pin=>{
        const findCustomPin = selectedProject.customPinpoints.find(p=>{return p._id === pin.customPinpointId})
        if(findCustomPin){
            if(findCustomPin.type === 'info'){
                return pin
            }
        }
    }).filter(pin=>{return pin}) as PinpointType[]

    // Info Pinpoint event related
    const handleDragPin = (e:MouseEvent)=>{
        if(isMouseDown && isEdit.type === 'dragPin'){
            // Raycast to mesh object
            const clientHeight = innerHeight;
            const clientWidth = innerWidth;
            const mouse = new THREE.Vector2();

            mouse.x = (e.clientX / clientWidth) * 2 - 1;
            mouse.y = -(e.clientY / clientHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();

            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObject(mainMeshRef.current)
            
            const intersectPosition = intersects[0].point

            // To Current View
            currentView.pinpoints = currentView.pinpoints.map(p=>{
                if(p._id === isEdit.pinId){
                    return {...p,
                        position:{
                            x:intersectPosition.x,
                            y:intersectPosition.y,
                            z:intersectPosition.z 
                        }
                    }
                }
                else{
                    return {...p}
                }
            })
            
            // Selected Scene
            selectedScene.viewList = selectedScene.viewList.map(view=>{
                return {...view,
                    pinpoints:view.pinpoints.map(p=>{
                        if(p._id === isEdit.pinId){
                            return {...p,
                                position:{
                                    x:intersectPosition.x,
                                    y:intersectPosition.y,
                                    z:intersectPosition.z 
                                }
                            }
                        }
                        else{
                            return {...p}
                        }
                    })
                }
         
            })
            
            // To Selected Project
            selectedProject.scenes = selectedProject.scenes.map(scene=>{
                return {...scene,
                    viewList:scene.viewList.map(view=>{
                        return {...view,
                            pinpoints:view.pinpoints.map(p=>{
                                if(p._id === isEdit.pinId){
                                    return {...p,
                                        position:{
                                            x:intersectPosition.x,
                                            y:intersectPosition.y,
                                            z:intersectPosition.z 
                                        }
                                    }
                                }
                                else{
                                    return {...p}
                                }
                            })
                        }
                 
                    })
                }
            })
            setSelectedProject(prev=>{return {...prev}})
        }
    }

    const handleDragInfo = (e:MouseEvent)=>{
        if(isMouseDown && isEdit.type === 'dragInfo'){
            const moveX = (e.clientX - mouseStartPosition.x)
            const moveY = (e.clientY - mouseStartPosition.y)
            const posX = infoStartPosition.x + moveX
            const posY = infoStartPosition.y + moveY
            
            // To view
            currentView.pinpoints = currentView.pinpoints.map(p=>{
                if(p._id === isEdit.pinId){
                    return {...p,
                        info:{...p.info,
                            position:{
                                x:posX,
                                y:posY,
                            }
                        }
                    }
                }
                else{
                    return {...p}
                }
            })
            
            // To project
            selectedProject.scenes = selectedProject.scenes.map(scene=>{
                return {...scene,
                    viewList:scene.viewList.map(view=>{
                        if(view._id === currentView._id){
                            return {...view,
                                pinpoints:view.pinpoints.map(p=>{
                                    if(p._id === isEdit.pinId){
                                        return {...p,
                                            info:{...p.info,
                                                position:{
                                                    x:posX,
                                                    y:posY,
                                                }
                                            }
                                        }
                                    }
                                    else{
                                        return {...p}
                                    }
                                })
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

    const handleResizeInfo = (e:MouseEvent)=>{
        // return
        if(isMouseDown && isEdit.type === 'resizeInfo'){
            const moveX = (e.clientX - mouseStartPosition.x)
            const moveY = (e.clientY - mouseStartPosition.y)
            const width = infoStartSize.width + moveX
            const height = infoStartSize.height + moveY

            // To view
            currentView.pinpoints = currentView.pinpoints.map(p=>{
                if(p._id === isEdit.pinId){
                    return {...p,
                        info:{...p.info,
                            width:width,
                            height:height
                        }
                    }
                }
                else{
                    return {...p}
                }
            })

            // For Project
            selectedProject.scenes = selectedProject.scenes.map(scene=>{
                return {...scene,
                    viewList:scene.viewList.map(view=>{
                        if(view._id === currentView._id){
                            return {...view,
                                pinpoints:view.pinpoints.map(p=>{
                                    if(p._id === isEdit.pinId){
                                        return {...p,
                                            info:{...p.info,
                                                width:width,
                                                height:height
                                            }
                                        }
                                    }
                                    else{
                                        return {...p}
                                    }
                                })
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

    const handleResizeImage = (e:MouseEvent)=>{
        // return
        if(isMouseDown && isEdit.type === 'resizeImage'){
            const moveY = (e.clientY - mouseStartPosition.y)
            const height = Math.max(imageHeightStart + moveY, 50)

            // To view
            currentView.pinpoints = currentView.pinpoints.map(p=>{
                if(p._id === isEdit.pinId){
                    return {...p,
                        info:{...p.info,
                            images:{...p.info.images,
                                containerHeight:height
                            }
                        }
                    }
                }
                else{
                    return {...p}
                }
            })
            // To project
            selectedProject.scenes = selectedProject.scenes.map(scene=>{
                return {...scene,
                    viewList:scene.viewList.map(view=>{
                        if(view._id === currentView._id){
                            return {...view,
                                pinpoints:view.pinpoints.map(p=>{
                                    if(p._id === isEdit.pinId){
                                        return {...p,
                                            info:{...p.info,
                                                images:{...p.info.images,
                                                    containerHeight:height
                                                }
                                            }
                                        }
                                    }
                                    else{
                                        return {...p}
                                    }
                                })
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
    // Drag mouse on editor mode
    useEffect(()=>{
        const handleMouseUp = ()=>{
            setTimeout(()=>{
                setIsDragged(false)
                setEnableOrbitControl(true)
                setIsMouseDown(false)
                
                if(isEditorMode){
                    setMouseStartPosition({
                        x:0,
                        y:0
                    })
                    setInfoStartPosition({
                        x:0,
                        y:0
                    })
                    setInfoStartSize({
                        width:0,
                        height:0
                    })
                    setImageHeightStart(0)
    
                    if(isEdit.type === 'dragPin' || isEdit.type === 'dragInfo' || isEdit.type === 'resizeInfo' || isEdit.type === 'resizeImage'){
                        setIsEdit(isEditObject)
                    }
                }
            },10)
        }
        const handleMouseMove = (e:MouseEvent)=>{
            if(isMouseDown){
                setIsDragged(true)
            }
            if(isEditorMode){
                handleDragPin(e)
                handleDragInfo(e)
                handleResizeInfo(e)
                handleResizeImage(e)
            }
        }
        
        const handleMouseDown = ()=>{
            setIsMouseDown(true)
        }

        addEventListener('mousedown', handleMouseDown)
        addEventListener('mousemove',handleMouseMove)
        addEventListener('mouseup',handleMouseUp)
        return()=>{
            removeEventListener('mousedown', handleMouseDown)
            removeEventListener('mousemove',handleMouseMove)
            removeEventListener('mouseup',handleMouseUp)
        }
    },)
    return (  
        <PinpointsUiContext.Provider
            value={{
                transition,

                isEdit,setIsEdit,
                editedPinInfo, setEditedPinInfo,

                isMouseDown, setIsMouseDown,
                isDragged, setIsDragged,
                isMouseEnter, setIsMouseEnter,
                
                infoStartPosition,setInfoStartPosition,
                infoStartSize,setInfoStartSize,
                mouseStartPosition,setMouseStartPosition,
                imageHeightStart,setImageHeightStart,
                

            }}
        >
            <div
                className='no-select'
                style={{
                    opacity:isAutoplay?`0%`:`100%`,
                }}
            >
                {viewPinpoints.map((pin,index)=>
                    <ViewPinpointContainer
                        key={index}
                        pin={pin}
                    />
                )}
                {infoPinpoints.map((pin,index)=>
                    <InfoPinpointContainer
                        key={index}
                        pin={pin}
                    />
                )}
            </div>
        </PinpointsUiContext.Provider>
    );
}
 
export default PinpointsUi;