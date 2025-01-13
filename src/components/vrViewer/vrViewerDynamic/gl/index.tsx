import { Canvas, useThree } from "@react-three/fiber";
import { useContext } from "react";
import { VrViewerContext } from "../..";
import { Controllers, Hands, XR } from "@react-three/xr";
import SpatialAudios from "./spatialAudios";
import { VrViewerDynamicContext } from "..";
import Measurements from "./measurements";
import Autoplay from "./autoplay";
import BufferImages from "./bufferImages";
import OrbitControls from "./orbitControls";
import BackgroundObject from "./backgroundObject";
import DollHouseMaterial from "./dollHouseMaterial";
import Material360 from "./material360";
import MainObject from "./mainObject";
import TeleportCircles from "./teleportCircles";
import { isMobile } from "react-device-detect";
import DeviceOrientationControl from "./deviceOrientationControl";
import DeviceOrientationDetection from "./deviceOrientationDetection";
import GazeControl from "./gazeControl";
import XrMode from "./xrMode";
import Zooming from "./zooming";
import InitProject from "./initProject";

const Gl = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {setGl, 
        isDollHouseMode, 
        loadingProgress, 
        isEditorMode, 
        isGameStart, 
        isTeleportCirclesEnable, 
        enableDoc, 
        setIsXrMode, isXrMode, 
        cameraRig, 
        currentView,
        camera,
        flooredViewArray, gl,
        mainMeshRef
    } = useContext(VrViewerDynamicContext)
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
                <InitProject/>
                <Controllers />
                <Hands />
                <ambientLight
                    intensity={1}
                />
                <XrMode/>
                {isXrMode?
                    <GazeControl/>
                :null}

                {/*  */}
                <SpatialAudios/>
                {!isDollHouseMode?
                    <Measurements/>
                :null}
                <Autoplay/>
                {loadingProgress == 1 && !selectedProject.globalSettings.loading.autoLoad && !isEditorMode && !isGameStart?
                    <BufferImages/>
                :null}
                <OrbitControls/>
                {!isDollHouseMode?
                    <>
                        <BackgroundObject/>
                    </>
                :null}
                <DollHouseMaterial/>
                <Material360/>
                <MainObject/>
                <TeleportCircles/>
                {isMobile && enableDoc?
                    <DeviceOrientationControl/>
                :null}
                <DeviceOrientationDetection/>
                <Zooming/>

            </XR>
        </Canvas>
    );
}
 
export default Gl;