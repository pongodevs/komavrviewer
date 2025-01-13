import {useRef, useEffect, useContext} from 'react';
import { MdLocationPin } from 'react-icons/md';
import { PinpointType, ViewListType, VrProjectType, viewListObject } from '@/types/vrProjectType/index';
import { useRouter } from 'next/router';
import LabelName from './labelName';
import {createContext} from 'react';
import {useState} from 'react';
import _ from 'lodash';
import { PinpointsUiContext } from '../..';
import { ViewPinpointContainerContext } from '..';
import { VrViewerStaticContext } from '@/components/vrViewer/vrViewerStatic';
import { VrViewerContext } from '@/components/vrViewer';


type PinpointContextType = {
    labelRef:any,
    pin:PinpointType
}
export const PinpointContext = createContext<PinpointContextType>({} as PinpointContextType)
const Pinpoint = () => {
    const {pin,pinpointRef, setOpacity} = useContext(ViewPinpointContainerContext)
    const {isMouseDown, setIsMouseEnter, isDragged, setIsDragged, setIsEdit, setIsMouseDown} = useContext(PinpointsUiContext)
    const router = useRouter()
    const {projectId} = router.query
    const {
        currentView, teleport, selectedScene, isEditorMode, setCurrentView, 
        draggedView,setDraggedView,
        setSelectedPinpoint,
        selectedMap, setSelectedMap,
        player,
        setEnableOrbitControl,
        teleportToPin
    } = useContext(VrViewerStaticContext)
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)

    const [progress, setProgress] = useState(0)    

    const findCustomPinpoint = selectedProject.customPinpoints.find(p=>p._id === pin.customPinpointId) 
    const labelRef = useRef<HTMLDivElement>(null)

    const finalTransition = isEditorMode? `all 0.1s` : `all 0.5s`
    // Every change project
    useEffect(()=>{
        const animate = (ref:any)=>{
            if(ref.current){
                ref.current.style.transition = `none`
                ref.current.style.opacity = `0%`
            }
    
            setTimeout(()=>{
                if(ref.current){
                    ref.current.style.transition = finalTransition
                    ref.current.style.opacity = `100%`
                }
            },1500)
        }
        animate(pinRef)
    },[projectId])
    // Every teleport fade thumbnail
    useEffect(()=>{
        if(player.isTeleport){
            if(pinRef.current){
                pinRef.current.style.transition = `none`
                pinRef.current.style.opacity = `0%`
            }
        }
        else{
            if(pinRef.current){
                pinRef.current.style.transition = finalTransition
                pinRef.current.style.opacity = `100%`
            }
        }
    },[player.isTeleport])

    const pinRef = useRef<HTMLDivElement>(null)
    

    return (  
        <PinpointContext.Provider
            value={{
                labelRef,
                pin
            }}
        >
            <div
                className='no-select'
                draggable={false}
                ref={pinRef}
                style={{
                    opacity:`0%`,
                    position:`absolute`,
                }}
            >

                {/* Pin */}
                <div
                    className='no-select'
                    draggable={false}
                    style={{
                        position:`relative`,
                        display:`flex`,
                        justifyContent:`center`,
                        alignItems:`center`
                    }}
                    onMouseDown={()=>{
                        setIsMouseDown(true)
                        if(isEditorMode){
                            setEnableOrbitControl(false)
                            setIsEdit({
                                pinId:pin._id,
                                type:`dragPin`
                            })
                        }
                    }}
                    
                    onMouseUp={async()=>{
                        console.log('KASODFKO')
                        if(!isDragged && draggedView._id === ''){
                            teleportToPin(pin)
                        }
                        setIsDragged(false)

                        // // Teleport
                        // if(!isDragged && draggedView._id === ''){
                        //     if(pin.redirectUrl){
                        //         console.log(`THERE'S REDIRECT URL: ${pin.redirectUrl}`)
                        //         const redirectArray = pin.redirectUrl.split('/')
                        //         console.log(redirectArray)
                        //         const getNextProjectId = ()=>{
                        //             if(_.includes(pin.redirectUrl,'?startIndex=')){
                        //                 if(pin.redirectUrl.endsWith('/')){
                        //                     return redirectArray[redirectArray.length -3]
                        //                 }
                        //                 else{
                        //                     return redirectArray[redirectArray.length -2]
                        //                 }
                        //             }
                        //             else{
                        //                 if(pin.redirectUrl.endsWith('/')){
                        //                     return redirectArray[redirectArray.length -2]
                        //                 }
                        //                 else{
                        //                     return redirectArray[redirectArray.length -1]
                        //                 }
                        //             }
                        //         }
                                
                        //         const getStartIndex = ()=>{
                        //             if(_.includes(pin.redirectUrl,'?startIndex=')){
                        //                 if(pin.redirectUrl.endsWith('/')){
                        //                     return Number(pin.redirectUrl[pin.redirectUrl.length - 2])
                        //                 }
                        //                 else{
                        //                     return Number(pin.redirectUrl[pin.redirectUrl.length - 1])
                        //                 }
                        //             }
                        //             else{
                        //                 return 0
                        //             }
                        //         }
                        //         const nextProjectId = getNextProjectId()
                        //         const startIndex = getStartIndex()
                        //         console.log(nextProjectId)
                        //         console.log(startIndex)
                        //         const nextProjectDoc = doc(db,'vrProjects',nextProjectId)
                                
                        //         const nextProject = (await getDoc(nextProjectDoc)).data() as VrProjectType
                        //         console.log(nextProject)
                        //         if(nextProject){
                        //             const nextView = nextProject.scenes[0].viewList[startIndex]
    
                        //             if(nextView){
                        //                 setOpacity(0)
                        //                 teleport(nextView,pin)
                        //             }
                                    
                        //             // Jump to other project
                        //             console.log(location.origin)
                        //             console.log(redirectArray.slice(-2, redirectArray.length).join('/'))
                        //             const redirectUrl = `${location.origin}/vrViewer/${nextProjectId}/?startIndex=${startIndex}`
                        //             console.log(redirectUrl)

                        //             setTimeout(()=>{
                        //                 router.push(redirectUrl)
                        //             },(selectedProject.globalSettings.transition.duration * 1000) + 500)

                        //             // if(pin.redirectUrl.startsWith(location.origin)){
                        //             //     setTimeout(()=>{
                        //             //         router.push(pin.redirectUrl)
                        //             //     },(selectedProject.globalSettings.transition.duration * 1000) + 500)
                        //             // }
                        //         }
                        //         else{
                        //             // Jump to external
                        //             open(pin.redirectUrl, '_blank');
                        //         }
                        //     }
                        //     else{
                        //         const findView = selectedScene.viewList.find(v=>v._id === pin.toViewId) as ViewListType
                        //         if(findView){
                        //             // Change map
                        //             const findMap = selectedProject.maps.find(map=>map._id === findView.mapId)
                        //             if(findMap){
                        //                 setSelectedMap(findMap)
                        //                 // Change pin
                        //                 const findPin =findMap.pinpoints.find(pin=>pin.toViewId === findView._id)
                        //                 if(findPin){
                        //                     setSelectedPinpoint(findPin)
                        //                 }
                        //             }
                        //             teleport(findView,pin)
                        //         }
                        //     }
                        // }
                    }}
                >
                    {/* Pin */}
                    {findCustomPinpoint?.imageUrl === ''?
                        <MdLocationPin
                            size={Number(findCustomPinpoint?.sizePercentage)/100 *100}
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
                                width:`calc(${Number(findCustomPinpoint?.sizePercentage)/100} * 100px)`,
                            }}
                        />
                    }
                    {/* Thumbnail */}
                    {(pin.thumbnailUrl !== '' && progress === 0) && findCustomPinpoint?.showThumbnail?
                        <img
                            draggable={false}
                            style={{
                                position:`absolute`,
                                width:`calc(${Number(findCustomPinpoint?.sizePercentage)/100 * findCustomPinpoint?.thumbnailSize/100} * 5rem)`,
                                aspectRatio:`1:1`,
                                borderRadius:`4rem`,
                                transform:`translateY(calc(${Number(findCustomPinpoint?.sizePercentage)/100} * -${findCustomPinpoint?.thumbnailYPosition}rem))`,
                                boxShadow:`0px 0px 10px rgba(0,0,0,0.2)`
                            }}
                            // src={pin.thumbnailUrl}
                            src={selectedScene.viewList.find(view=>{return view._id === pin.toViewId})?.thumbnailUrl || pin.thumbnailUrl}
                        />
                    :null}
                </div>
                <LabelName/>
            </div>
        </PinpointContext.Provider>
    );
}
 
export default Pinpoint;