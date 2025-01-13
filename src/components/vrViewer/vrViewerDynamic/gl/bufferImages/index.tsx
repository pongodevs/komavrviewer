import { useContext, useEffect } from "react";
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

const BufferImages = () => {
    const {setLoadingProcessName} = useContext(VrViewerContext)
    const {selectedScene, mainMeshRef, selectedProject, currentView, setBufferProgress,  setSelectedScene} = useContext(VrViewerDynamicContext)
    useEffect(()=>{
        const timeout = 200
        const viewLength = selectedProject?.scenes[0].viewList.length
        const sceneLength = selectedProject?.scenes.length
        
        // Buffer every view
        selectedProject.scenes.forEach((scene, index1)=>{
            scene.viewList.forEach((view,index2)=>{
                setTimeout(()=>{
                    if(mainMeshRef.current){
                        mainMeshRef.current.material.uniforms.currentTexture.value = view.texture
                    }
                    const bufferProgress = ( ((index1 * viewLength) + index2) + 1) / (viewLength * sceneLength)
                    setBufferProgress(bufferProgress)
                    setLoadingProcessName('Buffering images...')
                },(index1 * viewLength * timeout) + ((index2 + 1) * timeout))
            })
        })
        // Lastly go back to original view
        setTimeout(()=>{
            mainMeshRef.current.material.uniforms.currentTexture.value = selectedProject.scenes[0].viewList[0].texture
            setSelectedScene(selectedProject.scenes[0])
        },((sceneLength * viewLength * timeout) + (timeout)))
    },[])
    return (  
        <>
        </>
    );
}
 
export default BufferImages;