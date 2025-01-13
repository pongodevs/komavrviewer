import React, {useContext, useState} from 'react'
import { useRef } from 'react';
import { FaExpand } from 'react-icons/fa';
import { VrViewerDepthContext } from '../../../..';
import { isMobile } from 'react-device-detect';

const FullscreenUi = () => {
    const {masterContainerRef, isFullscreen, setIsFullscreen, showInstruction} = useContext(VrViewerDepthContext)
    const iconRef = useRef<HTMLDivElement>(null)
    return ( 
        <React.Fragment>
            <div
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

                        // For mobile
                        if(isMobile){
                            showInstruction('DOUBLE TAP TO LEAVE FULL SCREEN',3)
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