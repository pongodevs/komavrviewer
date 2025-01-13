import React from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FaVolumeDown, FaVolumeMute } from 'react-icons/fa';
import {useContext} from 'react';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import { VrViewerDepthContext } from '../../../..';

const AmbientSound = () => {
    const { isVolumeOn, setIsVolumeOn, audio, setAudio} = useContext(VrViewerDepthContext)
    const {selectedProject} = useContext(VrViewerContext)
    
    const iconRef = useRef<HTMLDivElement>(null)
    return (  
        <div 
            style={{
                display:`flex`,
                
            }}
        >
            <div
                ref={iconRef}
                className='text-white'
                style={{
                    padding:`0.5rem`,
                    cursor:`pointer`,
                    zIndex:`50`,
                    fontSize:`3rem`,
                    
                    opacity:`70%`
                }}
                onClick={()=>{
                    console.log(audio)
                    if(!isVolumeOn){
                        audio.play();
                    }
                    else{
                        audio.pause();
                    }
                    setIsVolumeOn(!isVolumeOn)
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
                {isVolumeOn?
                    <FaVolumeDown/>
                :
                    <FaVolumeMute/>
                }
            </div>
        </div>
    );
}
 
export default AmbientSound;