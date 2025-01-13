import { CustomPinpointType,  PinpointType,  pinpointObject, viewListObject } from "@/types/vrProjectType";
import { createContext, useContext, useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import * as THREE from 'three'
import Pinpoint from "./pinpoint";
import _ from "lodash";
import { VrViewerDepthContext } from "../../..";
import { VrViewerContext } from "../../../..";


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
    } = useContext(VrViewerDepthContext)

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
                const currentPosition = new THREE.Vector3(pin.position.x, pin.position.y, pin.position.z)
                
                // Get dot product
                const cameraToPoint = new THREE.Vector3().subVectors(cameraRig.position,currentPosition).normalize()
                
                const cameraDir = camera.getWorldDirection(new THREE.Vector3())

                const dotProduct = cameraDir.dot(cameraToPoint)

                // Translate UI according to 2D space
                const screenPosition = currentPosition.clone()
                screenPosition.project(camera as any)
                const translateX =  dotProduct > 0? 999999 : (screenPosition.x * innerWidth * 0.5) 
                const translateY =  dotProduct > 0? 999999 : (-screenPosition.y * innerHeight * 0.5)
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