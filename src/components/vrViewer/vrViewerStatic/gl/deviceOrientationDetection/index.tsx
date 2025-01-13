import { useThree } from '@react-three/fiber'
import React, { useEffect } from 'react'
import {isDesktop, isMobile} from 'react-device-detect'

const DeviceOrientationDetection = () => {
    const {camera} = useThree() as any

    useEffect(()=>{
        const handleResize = (e:any)=>{
            // const isPotrait = e.currentTarget.innerWidth < e.currentTarget.innerHeight
            // const isLandscape = e.currentTarget.innerWidth > e.currentTarget.innerHeight

            // if(isPotrait && isDesktop){
            //     camera.fov = 100
            // }
            // if(isLandscape && isDesktop){
            //     camera.fov = 100
            // }

            // if(isPotrait && isMobile){
            //     camera.fov = 125
            // }
            // if(isLandscape && isMobile){
            //     camera.fov = 85
            // }  
            camera.updateProjectionMatrix(); 
        }
        addEventListener('resize',handleResize)

        return()=>{
            removeEventListener('resize',handleResize)
        }
    })
    return ( 
        null
    );
}
 
export default DeviceOrientationDetection;