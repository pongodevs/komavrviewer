import { Controllers, Hands, XR } from "@react-three/xr";
import MainObject from "./mainObject/index";
import OrbitControls from "./orbitControls";
import { useContext } from "react";
import { VrViewerDepthContext } from "..";
import { Canvas } from "@react-three/fiber";
import { VrViewerContext } from "../..";
import WasdMovement from "./wasdMovement";
import TeleportCircles from "./teleportCircles";
import Zooming from "./zooming";
import Autoplay from "./autoplay";
import XrMode from "./xrMode";
import Pinpoints from "./pinpoints";
import InitProject from "./initProject";
import DeviceOrientationControl from "./deviceOrientationControl";
import { isDesktop, isMobile } from "react-device-detect";
import LoadingXrObject from "./loadingXrObject";
import AutoLoadViews from "./autoLoadViews";

const Gl = () => {
    const {setIsXrMode, isTeleportCirclesEnable, isXrMode, enableDoc} = useContext(VrViewerDepthContext)
    const {selectedProject, isLocal} = useContext(VrViewerContext)
    const {setGl} = useContext(VrViewerDepthContext)
    return (  
        <Canvas
            flat
            linear
            style={{
                width:`100%`,
                height:`100%`,
                filter:selectedProject.globalSettings.colorCorrection.enable? `brightness(${selectedProject.globalSettings.colorCorrection.brightness}%) saturate(${selectedProject.globalSettings.colorCorrection.saturation}%) contrast(${selectedProject.globalSettings.colorCorrection.contrast}%)` : ``
            }}
            gl={{
                powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
                setGl(gl)
                gl.localClippingEnabled = true
            }}
        >
            <XR
                onSessionStart={()=>{
                    setIsXrMode(true)
                }}
                onSessionEnd={()=>{
                    setIsXrMode(false)
                    
                }}
            >
                {isDesktop?
                    <AutoLoadViews/>
                :null}
                <XrMode/>
                {isXrMode?
                    <>
                        <Pinpoints/>
                        <Controllers />
                        <Hands />
                    </>
                :null}
                <ambientLight
                    intensity={1}
                />
                <Autoplay/>
                <InitProject/>
                <OrbitControls/>
                {enableDoc?
                    <DeviceOrientationControl/>
                :null}
                <MainObject/>
                {isLocal?
                    <WasdMovement/>
                :null}
                {selectedProject.globalSettings.teleportation.showCircle?
                    <TeleportCircles/>
                :null}
                <Zooming/>
                
                {isXrMode?
                    <LoadingXrObject/>
                :null}
            </XR>
        </Canvas>
    );
}
 
export default Gl;