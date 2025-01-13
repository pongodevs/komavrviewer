import {useRef,useContext, useEffect} from 'react';
import { VrViewerDepthContext } from '../../../..';
import { isDesktop, isMobile } from 'react-device-detect';

const ShowUi = () => {
    const { setShowUi, showInstruction} = useContext(VrViewerDepthContext)
    const iconRef = useRef<HTMLDivElement>(null)
    

    return (  
        <div
            className='no-select'
            style={{
                cursor:`pointer`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`
            }}
        >
            <div
                className='text-white'
                ref={iconRef}
                style={{
                    fontSize:`2.4rem`,
                    fontWeight:`800`,
                    opacity:`70%`
                }}
                onClick={()=>{
                    if(isMobile){
                        showInstruction('DOUBLE TAP TO EXIT',3)
                    }
                    if(isDesktop){
                        showInstruction('PRESS ESC KEY TO EXIT',3)
                    }
                    setShowUi(false)
                }}
                onMouseEnter={()=>{
                    if(iconRef.current){
                        iconRef.current.style.transition=`all 0.15s ease-out`
                        iconRef.current.style.transform=`scale(1.2)`
                    }
                }}
                onMouseLeave={()=>{
                    if(iconRef.current){
                        iconRef.current.style.transform=`scale(1.0)`
                    }
                }}
            >
                UI
                
            </div>
        </div>
    );
}
 
export default ShowUi;