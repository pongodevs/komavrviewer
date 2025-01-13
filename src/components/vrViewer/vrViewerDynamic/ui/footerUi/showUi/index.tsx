import {useRef,useContext, useEffect} from 'react';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { isMobile } from 'react-device-detect';

const ShowUi = () => {
    const {showUi, setShowUi, showInstruction} = useContext(VrViewerDynamicContext)
    const iconRef = useRef<HTMLDivElement>(null)
    
    return (  
        <div
            className='no-select'
            style={{
                cursor:`pointer`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                padding:`0.5rem`
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
                        showInstruction('DOUBLE TAP TO EXIT',3,false)
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