import { useFrame, useThree } from "@react-three/fiber";
import { useContext } from "react";
import { VrViewerContext } from "../../..";
import { VrViewerDepthContext } from "../..";

const Zooming = () => {
    const {camera} = useThree()
    const {zoomState} = useContext(VrViewerDepthContext)
    const {selectedProject} = useContext(VrViewerContext)
    useFrame(()=>{
        if(Math.abs(zoomState.zoomSpeed) > 0.01 && selectedProject.globalSettings.camera.enableZoom){
            zoomState.zoomSpeed = zoomState.zoomSpeed * 0.8;
            (camera as any).fov = Math.max(65,Math.min((camera as any).fov + zoomState.zoomSpeed, 125))
            camera.updateProjectionMatrix()
        }
    })
    return (  
        <>
        </>
    );
}
 
export default Zooming;