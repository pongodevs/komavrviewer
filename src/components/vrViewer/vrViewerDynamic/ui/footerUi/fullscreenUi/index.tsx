import React, {useContext, useState} from 'react'
import { useRef } from 'react';
import { FaExpand } from 'react-icons/fa';
import { isDesktop, isMobile } from 'react-device-detect'
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

const FullscreenUi = () => {
    const {masterContainerRef, isFullscreen, setIsFullscreen, showInstruction} = useContext(VrViewerDynamicContext)
    const iconRef = useRef<HTMLDivElement>(null)
    return ( 
        <React.Fragment>
            <div
                className = 'no-select'
                style={{
                    display:`flex`,
                }}
            >
                <div 
                    ref={iconRef}
                    style={{
                        padding:`0.5rem`,
                        zIndex:`2`,
                        fontSize:`3rem`,
                        cursor:`pointer`,
                        opacity:`70%`,
                    }}
                    className='text-white'
                    onClick={()=>{
                        if(isMobile){
                            showInstruction('DOUBLE TAP TO EXIT',3,false)
                        }
                        // For windows
                        const element = masterContainerRef.current as any
                        if(element){
                            if(element.requestFullscreen){
                                element.requestFullscreen()
                            }
                            else if(element.webkitRequestFullscreen){
                                element.webkitRequestFullscreen()
                            }
                            else if(element.msRequestFullscreen){
                                element.msRequestFullscreen()
                            }
                        }
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
                    <FaExpand/>
                </div>
            </div>
        </React.Fragment>
     );
}
 
export default FullscreenUi;