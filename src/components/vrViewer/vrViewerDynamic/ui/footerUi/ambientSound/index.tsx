import React from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FaVolumeDown, FaVolumeMute } from 'react-icons/fa';
import {useContext} from 'react';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

const AmbientSound = () => {
    const {selectedProject} = useContext(VrViewerDynamicContext)
    const [isVolumeOn, setIsVolumeOn] = useState(false)

    const [audio, setAudio] = useState(new Audio())
    useEffect(()=>{
        const audio = new Audio(selectedProject.globalSettings.music.url);
        audio.loop = true
        
        setAudio(audio)
    },[])

    useEffect(()=>{
        audio.volume = selectedProject.globalSettings.music.volume/100
    },[selectedProject.globalSettings.music.volume])
    
    const iconRef = useRef<HTMLDivElement>(null)
    return (  
        <div 
            className='no-select'
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