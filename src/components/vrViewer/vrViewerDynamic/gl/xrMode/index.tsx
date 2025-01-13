import { useContext, useEffect } from "react";
import { VrViewerDynamicContext } from "../..";
import { useXR } from "@react-three/xr";
import { VrViewerContext } from "../../..";

const XrMode = () => {
    const {player:xrPlayer} = useXR()
    const {selectedProject} = useContext(VrViewerContext)
    const {isXrMode, cameraRig, flooredViewArray, currentView, mainMeshRef, setMainGeometry, gltfLoader} = useContext(VrViewerDynamicContext)
    useEffect(()=>{
        // Starting XR Mode
        if(isXrMode){
            const flooredView = flooredViewArray.find(view=>{return view._id == currentView._id})
            if(flooredView){
                cameraRig.position.x = flooredView.position.x
                cameraRig.position.y = flooredView.position.y
                cameraRig.position.z = flooredView.position.z

                xrPlayer.position.x = flooredView.position.x
                xrPlayer.position.y = flooredView.position.y
                xrPlayer.position.z = flooredView.position.z
            }

            // Load detailed glb
            gltfLoader.load(selectedProject.detailedGlbUrl,async(gltf:any)=>{
                const mesh = gltf.scene.children[0]
                setMainGeometry(mesh.geometry)
            })
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