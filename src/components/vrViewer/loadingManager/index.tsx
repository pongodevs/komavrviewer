import { useContext, useEffect } from "react";
import { VrViewerContext } from "../";


const LoadingManager = () => {
    const {loadingManager, selectedProject, 
        loadingProgress, setLoadingProgress,
        loadingProcessName, setLoadingProcessName} = useContext(VrViewerContext)

    useEffect(()=>{
        loadingManager.onStart = function ( url:any, itemsLoaded:any, itemsTotal:any ) {
            setLoadingProgress(0.01)
            setLoadingProcessName('Initializing Project...')
        
        };
        
        loadingManager.onLoad = function ( ) {
            setLoadingProgress(1)
            setLoadingProcessName('Project Loaded...')
        };
        
        loadingManager.onProgress = function ( url:any, itemsLoaded:any, itemsTotal:any ) {
            setLoadingProgress(itemsLoaded/itemsTotal)
            const extension = url.split('.')[url.split('.').length-1]
            if(extension == 'glb'){
                setLoadingProcessName('Loading the 3d file...')
            }
            else{
                setLoadingProcessName('Loading all view...')
            }
        };
        
        loadingManager.onError = function ( url:any ) {
            console.log( 'There was an error loading ' + url );
        };
    },[selectedProject])

    return ( null );
}
 
export default LoadingManager;