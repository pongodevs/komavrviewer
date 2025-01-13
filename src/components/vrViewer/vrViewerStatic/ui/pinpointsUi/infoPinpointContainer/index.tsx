import { CustomPinpointType,  PinpointType,  pinpointObject, viewListObject } from "@/types/vrProjectType";
import { createContext, useContext, useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';
import * as THREE from 'three'
import Pinpoint from "./pinpoint";
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import _ from "lodash";



type InfoPinpointContainerContextType = {
    pin:PinpointType,
    pinpointRef:any,
    infoPadding:number,
    isRenderInfo:boolean, 
    setIsRenderInfo:Dispatch<SetStateAction<boolean>>,
    pinSize:number,
    findCustomPinpoint:CustomPinpointType,
    pinRef:HTMLDivElement | any,
}

export const InfoPinpointContainerContext = createContext<InfoPinpointContainerContextType>({} as InfoPinpointContainerContextType)
const InfoPinpointContainer = ({pin}:{pin:PinpointType}) => {
    const {isEditorMode,setEnableOrbitControl, 
        currentView, camera, mainMeshRef, 
        cameraRig,
    } = useContext(VrViewerStaticContext)

    const {selectedProject} = useContext(VrViewerContext)    
    
    const pinpointRef = useRef<HTMLDivElement>(null)
    const pinRef = useRef<HTMLDivElement>(null) as any
    const [isRenderInfo, setIsRenderInfo] = useState(false)

    const infoPadding = 16

    const findCustomPinpoint = selectedProject.customPinpoints.find(p=>p._id === pin.customPinpointId) as CustomPinpointType
    const pinSize = Number(findCustomPinpoint?.sizePercentage)/400 *100


    // Render pinpoint to 3D view
    useEffect(()=>{
        let animationFrameId:any

        const render = () => {
            if((camera as any).fov > 0){
                // Rotated value
                const quaternion = new THREE.Quaternion()
                const radians = currentView.rotation * (Math.PI/180)
                quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), radians)
                // 
                const currentPosition = new THREE.Vector3(pin.position.x, pin.position.y, pin.position.z)
                
                // Get dot product
                const cameraToPoint = new THREE.Vector3().subVectors(cameraRig.position,currentPosition).normalize()
                
                const rotatedCameraToPoint = cameraToPoint.applyQuaternion(quaternion)
                const cameraDir = camera.getWorldDirection(new THREE.Vector3())

                const dotProduct = cameraDir.dot(rotatedCameraToPoint)

                // Translate UI according to 2D space
                const screenPosition = currentPosition.clone()
                const rotatedScreenPosition = screenPosition.applyQuaternion(quaternion)
                rotatedScreenPosition.project(camera as any)
                const translateX =  dotProduct > 0? 999999 : (rotatedScreenPosition.x * innerWidth * 0.5) 
                const translateY =  dotProduct > 0? 999999 : (-rotatedScreenPosition.y * innerHeight * 0.5)
                if(pinpointRef.current){
                    pinpointRef.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
                }
            }
 
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    },)

    
    return (  
        <InfoPinpointContainerContext.Provider
            value={{
                pin,
                pinpointRef,
                infoPadding,
                isRenderInfo, setIsRenderInfo,
                pinSize,
                findCustomPinpoint,
                pinRef,
            }}
        >
            <div
                className='text-white no-select bg-red'
                ref={pinpointRef}
                style={{
                    opacity:currentView.labelName === pin._id? `0%` : `100%`,
                    zIndex:`3`,
                    position:`absolute`,
                    cursor:`pointer`,
                    left:`50%`,
                    top:`50%`,
                    display:`flex`,
                    justifyContent:`center`,
                    alignItems:`center`,
                    flexWrap:`wrap`,
                }}
                
            >  
                <Pinpoint/>
            </div>
        </InfoPinpointContainerContext.Provider>
    );
}
 
export default InfoPinpointContainer;