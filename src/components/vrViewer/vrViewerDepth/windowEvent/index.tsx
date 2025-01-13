import {useEffect,useContext} from 'react';
import { VrViewerDepthContext } from '..';
const WindowEvent = () => {
    const {setShowUi, setIsFullscreen, isFullscreen, instructionRef} = useContext(VrViewerDepthContext)

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
                if(instructionRef.current){
                    instructionRef.current.style.transform = `translateY(10rem)`
                    instructionRef.current.style.opacity = `0%`
                }
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