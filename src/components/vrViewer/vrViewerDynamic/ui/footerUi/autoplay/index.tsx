
import React from 'react'
import { useRef,  useContext} from 'react';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { BsFillPauseFill, BsFillPlayFill, BsPause } from 'react-icons/bs';

const Autoplay = () => {
    const { isAutoplay, setIsAutoplay} = useContext(VrViewerDynamicContext)
    const iconRef = useRef<HTMLDivElement>(null)
    return (  
        <div 
            ref={iconRef}
            className='text-white no-select'
            style={{
                padding:`0.5rem`,
                cursor:`pointer`,
                zIndex:`50`,
                fontSize:`3rem`,
            }}
            onClick={()=>{
                setIsAutoplay(prev=>!prev)
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
            {isAutoplay?
                <BsFillPauseFill/>
            :
                <BsFillPlayFill/>
            }
        </div>
    );
}
 
export default Autoplay;