import { useContext, useEffect } from "react";
import { useXR } from "@react-three/xr";
import { VrViewerContext } from "../../..";
import { VrViewerDepthContext } from "../..";

const XrMode = () => {
    const {player:xrPlayer} = useXR()
    const {isXrMode, cameraRig,  currentView, } = useContext(VrViewerDepthContext)
    useEffect(()=>{
        // Starting XR Mode
        if(isXrMode){
            cameraRig.position.x = currentView.floorPosition.x
            cameraRig.position.y = currentView.floorPosition.y
            cameraRig.position.z = currentView.position.z

            xrPlayer.position.x = currentView.floorPosition.x
            xrPlayer.position.y = currentView.floorPosition.y
            xrPlayer.position.z = currentView.floorPosition.z

        }
        if(!isXrMode){
            // Reset cameraRig position
            cameraRig.position.x = currentView.position.x
            cameraRig.position.y = currentView.position.y
            cameraRig.position.z = currentView.position.z
    
            // Set camera position to it's floored view
            xrPlayer.position.x = 0
            xrPlayer.position.y = 0
            xrPlayer.position.z = 0
        }
        
    },[isXrMode])
    return (  
        <>
        </>
    );
}
 
export default XrMode;