import {useEffect,useContext} from 'react';
import { VrViewerDynamicContext } from '..';
const WindowEvent = () => {
    const {setShowUi, setIsFullscreen, isFullscreen} = useContext(VrViewerDynamicContext)

    useEffect(()=>{
        const handleFullscreenChange = ()=>{
            setIsFullscreen(v=>{return !v})
        }

        addEventListener('fullscreenchange', handleFullscreenChange);
        addEventListener('webkitfullscreenchange', handleFullscreenChange);
        addEventListener('mozfullscreenchange', handleFullscreenChange);
        addEventListener('MSFullscreenChange', handleFullscreenChange);

        return()=>{
            removeEventListener('fullscreenchange', handleFullscreenChange)
            removeEventListener('webkitfullscreenchange', handleFullscreenChange)
            removeEventListener('mozfullscreenchange', handleFullscreenChange)
            removeEventListener('MSFullscreenChange', handleFullscreenChange)
        }
    },)

    useEffect(()=>{
        const handleKeydown = (e:any)=>{
            if(e.code === 'Escape'){
                setShowUi(true)
            }
        }
        addEventListener('keydown',handleKeydown)
    },)
    return (  
        <>
        </>
    );
}
 
export default WindowEvent;