import { Canvas } from "@react-three/fiber";
import { useContext, useEffect, useMemo, useState } from "react";
import { VrViewerStaticContext } from "..";
import Pinpoints from "./pinpoints";
import GazeControl from "./gazeControl";
import Autoplay from "./autoplay";
import InitProject from "./initProject";
import OrbitControls from "./orbitControls";
import MainObject from "./mainObject";
import { isMobile } from "react-device-detect";
import DeviceOrientationControl from "./deviceOrientationcontrol";
import DeviceOrientationDetection from "./deviceOrientationDetection";
import { Controllers, Hands, XR } from "@react-three/xr";
import XrControllers from "./xrControllers";
import Zooming from "./zooming";


const Gl = () => {
    const {setGl, enableDoc, setIsXrMode, isXrMode} = useContext(VrViewerStaticContext)
    return (  
        <Canvas
            gl={{
                powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
                setGl(gl)
            }}
        >
            <XR
                foveation={0}
                onSessionStart={()=>{
                    setIsXrMode(true)
                }}
                onSessionEnd={()=>{
                    setIsXrMode(false)
                }}
            >
                <ambientLight
                    intensity={1}
                />
                {isXrMode?
                    <>
                        <XrControllers/>
                        <Pinpoints/>
                        <GazeControl/>
                    </>
                :null}
                <Zooming/>
                <Autoplay/>
                <InitProject/>
                <OrbitControls/>
                <MainObject
                    transition
                    disableTeleport
                />
                {isMobile && enableDoc?
                    <DeviceOrientationControl/>
                :null}
                <DeviceOrientationDetection/>
            </XR>
        </Canvas>
    );
}
 
export default Gl;