import {useEffect,useContext} from 'react';
import { VrViewerStaticContext } from '..';
const WindowEvent = () => {
    const {setShowUi, setIsFullscreen} = useContext(VrViewerStaticContext)
    useEffect(()=>{
        const handleKeydown = (e:any)=>{
            if(e.code === 'Escape'){
                setShowUi(true)
                setIsFullscreen(false)
            }
        }

        addEventListener('keydown',handleKeydown)

        return()=>{
            removeEventListener('keydown',handleKeydown)
        }
    },)
    return (  
        null
    );
}
 
export default WindowEvent;