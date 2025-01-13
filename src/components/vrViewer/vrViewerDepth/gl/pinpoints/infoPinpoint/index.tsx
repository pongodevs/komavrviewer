import { CustomPinpointType, PinpointType } from "@/types/vrProjectType";
import { Interactive } from "@react-three/xr";
import { Dispatch, SetStateAction, createContext, useContext, useRef, useState } from "react";
import * as THREE from 'three'
import Pin from "./pin";
import Info from "./info";
import { VrViewerContext } from "../../../..";
import { VrViewerDepthContext } from "../../..";

type InfoPinpointContextType = {
    pinpoint:PinpointType,
    textRef:any,
    isTextRendered:boolean, 
    setIsTextRendered:Dispatch<SetStateAction<boolean>>,
    xDistance:number, 
    setXDistance:Dispatch<SetStateAction<number>>,
    yDistance:number, 
    setYDistance:Dispatch<SetStateAction<number>>,
    textSize:number,
    textOpacity:number, 
    setTextOpacity:Dispatch<SetStateAction<number>>,
    size:number,
    findCustomPinpoint:CustomPinpointType | any,
    headerSize:number,
    descriptionSize:number,
    gap:number,
    isRenderInfo:boolean, 
    setIsRenderInfo:Dispatch<SetStateAction<boolean>>
}

export const InfoPinpointContext = createContext<InfoPinpointContextType>({} as InfoPinpointContextType)
const InfoPinpoint = ({pinpoint,index}:{pinpoint:PinpointType,index:number}) => {
    const {selectedProject} = useContext(VrViewerContext)
    const {currentView,radius} = useContext(VrViewerDepthContext)
    const groupRef = useRef(null as any)

    const viewPos = new THREE.Vector3(currentView.position.x, currentView.position.y, currentView.position.z)
    const pinpointNormal = new THREE.Vector3(pinpoint.position.x, pinpoint.position.y, pinpoint.position.z).sub(new THREE.Vector3().copy(viewPos)).normalize()
    const pinpointPosition = new THREE.Vector3(currentView.position.x, currentView.position.y, currentView.position.z).add(pinpointNormal)
    const size = 0.006

    const textRef = useRef(null as any)
    const [isTextRendered, setIsTextRendered] = useState(false)

    const [xDistance, setXDistance] = useState(0)
    const [yDistance, setYDistance] = useState(0)

    const textSize = 0.00001
    const [textOpacity, setTextOpacity] = useState(0)

    const findCustomPinpoint = selectedProject.customPinpoints.find(p=>{return p._id === pinpoint.customPinpointId}) as any
    const fontScale = (findCustomPinpoint? findCustomPinpoint.fontScale/100 : 1)
    const headerSize = 10 * fontScale
    const descriptionSize = 6 * fontScale
    const gap = 10

    const [isRenderInfo, setIsRenderInfo] = useState(false)
    console.log(isRenderInfo)
    return (  
        <InfoPinpointContext.Provider
            value={{
                pinpoint,
                textRef,
                isTextRendered, setIsTextRendered,
                xDistance, setXDistance,
                yDistance, setYDistance,
                textSize,
                textOpacity, setTextOpacity,
                size,
                findCustomPinpoint,
                headerSize,
                descriptionSize,
                gap,
                isRenderInfo, setIsRenderInfo
            }}
        >
            <Interactive
                onHover={()=>{
                    setIsRenderInfo(true)
                }}
                onBlur={()=>{
                }}
                onSelect={()=>{
                }}
            >                
                {/* Mesh Group */}
                <group
                    ref={groupRef}
                    position={[
                        pinpointPosition.x,
                        pinpointPosition.y,
                        pinpointPosition.z
                    ]}
                    onUpdate={(self:any) =>{
                        self.lookAt(new THREE.Vector3(currentView.position.x, pinpoint.position.y, currentView.position.z))
                    }}
                    onPointerUp={async ()=>{
                    }}
                    onPointerEnter={()=>{
                        setIsRenderInfo(true)
                    }}
                >
                    {isRenderInfo?
                        <Info/>
                    :
                        <Pin/>
                    }
                </group>
            </Interactive>
        </InfoPinpointContext.Provider>
    );
}
 
export default InfoPinpoint;