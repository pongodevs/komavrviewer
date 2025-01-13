import { InfoPinpointType, infoPinpointObject } from "@/types/vrProjectType";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useRef, useState } from "react";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import * as THREE from 'three'
import _ from "lodash";
import Description from "./description";
import Icon from "./icon";
import DeleteIcon from "./deleteIcon";

const raycaster = new THREE.Raycaster()

export type InfoContainerContextType = {
    isShowDescription:boolean, 
    setIsShowDescription:Dispatch<SetStateAction<boolean>>,
    pin:InfoPinpointType,
    isMouseDown:boolean, 
    setIsMouseDown:Dispatch<SetStateAction<boolean>>,
    iconRef:any,
    pinpointRef:any
}
export const InfoContainerContext = createContext<InfoContainerContextType>({} as InfoContainerContextType)
const InfoContainer = ({pin}:{pin:InfoPinpointType}) => {
    const {
        currentView, camera, mainMeshRef, 
        cameraRig,
        selectedDraggedInfoPinpoint,setSelectedDraggedInfoPinpoint,
        isEditorMode,
        player,
        isDollHouseMode
    } = useContext(VrViewerDynamicContext)
    const pinpointRef = useRef<HTMLDivElement>(null)

    const [isMouseDown, setIsMouseDown] = useState(false)
    const [isShowDescription, setIsShowDescription] = useState(false)

    const iconRef = useRef<HTMLDivElement>(null)


    // Render pinpoint to 3D view
    useEffect(()=>{
        let animationFrameId:any

        const render = () => {
            if(camera.fov > 0){
                // Rotated value
                const quaternion = new THREE.Quaternion()
                const radians = 0 * (Math.PI/180)
                quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), radians)
                // 
                const currentPosition = new THREE.Vector3(pin.position.x, pin.position.y, pin.position.z)
                
                // Get dot product
                const cameraToPoint = new THREE.Vector3().subVectors(cameraRig.position,currentPosition)
                const cameraToPointNormalize = new THREE.Vector3().copy(cameraToPoint).normalize()
                
                const rotatedCameraToPoint = cameraToPointNormalize.applyQuaternion(quaternion)
                const cameraDir = camera.getWorldDirection(new THREE.Vector3())

                const dotProduct = cameraDir.dot(rotatedCameraToPoint)
                // Translate UI according to 2D space
                const screenPosition = currentPosition.clone()
                const rotatedScreenPosition = screenPosition.applyQuaternion(quaternion)
                rotatedScreenPosition.project(camera as any)
                

                // Raycast
                
                if(pinpointRef.current && mainMeshRef && mainMeshRef.current){
                    raycaster.set(cameraRig.position, cameraToPointNormalize)
                    const intersect = raycaster.intersectObject(mainMeshRef.current,false)
                    
                    const translateX =  dotProduct > 0? 999999 : (rotatedScreenPosition.x * innerWidth * 0.5) 
                    const translateY =  dotProduct > 0? 999999 : (-rotatedScreenPosition.y * innerHeight * 0.5)

                    if(intersect.length > 0){
                        const cameraToPointLength = cameraToPoint.length()
                        if(cameraToPointLength < intersect[0].distance  || cameraToPointLength < 0.2){
                            pinpointRef.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
                        }
                        else{
                            if(pinpointRef.current.style.transform != `translateX(${999999}px) translateY(${999999}px)`){
                                pinpointRef.current.style.transform = `translateX(${999999}px) translateY(${999999}px)`
                            }
                        }
                    }
                    else{
                        pinpointRef.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
                    }

                }
            }
 
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    },)

    // Event Listener
    useEffect(()=>{
        const handleMouseUp = ()=>{
            if(isMouseDown){
                if(pinpointRef.current){
                    pinpointRef.current.style.pointerEvents = `initial`
                }
                setSelectedDraggedInfoPinpoint(infoPinpointObject)   
            }
        }

        addEventListener('mouseup', handleMouseUp)

        return()=>{
            
            removeEventListener('mouseup',handleMouseUp)
        }
    },)
    return (  
        <InfoContainerContext.Provider
            value={{
                isShowDescription, setIsShowDescription,
                pin,
                isMouseDown, setIsMouseDown,
                iconRef,
                pinpointRef
            }}
        >
            <div
                className='text-white no-select'
                ref={pinpointRef}
                style={{
                    opacity:!player.isTeleport || isEditorMode?`100%`:`0%`,
                    zIndex:`1`,
                    position:`absolute`,
                    cursor:`pointer`,
                    left:`50%`,
                    top:`50%`,
                    display:`flex`,
                    justifyContent:`center`,
                    alignItems:`center`,
                    flexWrap:`wrap`,
                    transition:`opacity 0.2s`,
                }}
            >
                {/* Center Div */}
                <div
                    style={{
                        transform:`translate(-50%,-50%)`,
                        display:`flex`,
                        justifyContent:`center`,
                        width:`100%`
                    }}
                >
                    {isEditorMode?
                        <DeleteIcon/>
                    :null}
                    <Icon/>
                    {!isDollHouseMode?
                        <Description/>
                    :null}
                </div>
            </div>
        </InfoContainerContext.Provider>
       
  
    );
}
 
export default InfoContainer;