import { Dispatch, SetStateAction, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import _ from "lodash";
import ViewPinpoint from "./viewPinpoint";
import { VrViewerContext } from "../../..";
import { PinpointType } from "@/types/vrProjectType";
import InfoPinpoint from "./infoPinpoint";
import { VrViewerDepthContext } from "../..";

type PinpointsContextType = {
    mapPinpointTexture:any,
    infoPinpointTexture:any,
}
export const PinpointsContext = createContext<PinpointsContextType>({} as PinpointsContextType)


const textureLoader = new THREE.TextureLoader();
const Pinpoints = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {currentView, setGazeTimer, gazedGroupRef} = useContext(VrViewerDepthContext)
    const mapPinpointTexture = useMemo(()=>{
        return textureLoader.load('/images/icons/map_pinpoint.png')
    },[])

    const infoPinpointTexture = useMemo(()=>{
        return textureLoader.load('/images/icons/info_pinpoint.png')
    },[])

    const viewPinpoints = currentView.pinpoints.map(pin=>{
        const findCustomPin = selectedProject.customPinpoints.find(p=>{return p._id === pin.customPinpointId})
        if(findCustomPin){
            if(findCustomPin.type === 'view'){
                return pin
            }
        }
    }).filter(pin=>{return pin}) as PinpointType[]

    const infoPinpoints = currentView.pinpoints.map(pin=>{
        const findCustomPin = selectedProject.customPinpoints.find(p=>{return p._id === pin.customPinpointId})
        if(findCustomPin){
            if(findCustomPin.type === 'info'){
                return pin
            }
        }
    }).filter(pin=>{return pin}) as PinpointType[]
    return (  
        <PinpointsContext.Provider
            value={{
                mapPinpointTexture,
                infoPinpointTexture
            }}
        >
            {infoPinpoints.map((pinpoint,index)=>
                <InfoPinpoint
                    key={`${pinpoint._id}${index}`}
                    index={index}
                    pinpoint={pinpoint}
                />
            )}
            {selectedProject.globalSettings.teleportation.showPinpoint? 
                <group
                    ref={gazedGroupRef}
                >
                    {viewPinpoints.map((pinpoint,index)=>
                        <ViewPinpoint
                            key={`${pinpoint._id}${index}`}
                            index={index}
                            pinpoint={pinpoint}
                        />
                    )}
                </group>
            :null}
        </PinpointsContext.Provider>
    );
}
 
export default Pinpoints;