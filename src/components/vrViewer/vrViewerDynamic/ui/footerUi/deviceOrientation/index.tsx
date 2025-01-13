
import React from 'react'
import { useRef,  useContext} from 'react';
import { TbRotate360, TbRotateClockwise } from 'react-icons/tb';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import {isIOS, isSafari, isMobileSafari, isAndroid} from 'react-device-detect'

const DeviceOrientation = () => {
    const {enableDoc,setEnableDoc, masterContainerRef} = useContext(VrViewerDynamicContext)
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
                opacity:enableDoc?`70%`:`35%`,
            }}
            onClick={()=>{
                if(!enableDoc){
                    if(isIOS){
                        (DeviceMotionEvent as any).requestPermission().then((response:any) => {
                            if (response == 'granted') {
                                if(masterContainerRef.current){
                                   
                                    if (masterContainerRef.current.requestFullscreen) {
                                        masterContainerRef.current.requestFullscreen()
                                    } 
                                    else if (masterContainerRef.current.webkitRequestFullscreen){
                                        masterContainerRef.current.webkitRequestFullscreen()
                                    }
                                    else if (masterContainerRef.current.webkitEnterFullscreen){
                                        masterContainerRef.current.webkitEnterFullscreen()
                                    }
                                    else if (masterContainerRef.current.msRequestFullscreen){
                                        masterContainerRef.current.msRequestFullscreen();
                                    }
                                }
                            }
                        });
                    }
                }
                setEnableDoc(prev=>!prev)
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
            <TbRotate360/>
        </div>
    );
}
 
export default DeviceOrientation;