import React, { useContext, useEffect} from 'react'
import { useFrame, useThree } from '@react-three/fiber';

const DeviceOrientationControl = () => {
    const {camera} = useThree()

    useEffect(()=>{
        const handleDevicemotion = (e:any)=>{
            // Rotate camera using device orientation
            const rotationMultiplier = 0.000295
            if(orientation === 0){
                camera.rotation.x += e.rotationRate.alpha * rotationMultiplier
                camera.rotation.y += e.rotationRate.beta * rotationMultiplier
            }
            if(orientation === 90){
                camera.rotation.x -= e.rotationRate.beta * rotationMultiplier
                camera.rotation.y += e.rotationRate.alpha * rotationMultiplier
            }
            if(orientation === -90){
                camera.rotation.x += e.rotationRate.beta * rotationMultiplier
                camera.rotation.y -= e.rotationRate.alpha * rotationMultiplier
            }
            if(orientation === 180){
                camera.rotation.x -= e.rotationRate.alpha * rotationMultiplier
                camera.rotation.y -= e.rotationRate.beta * rotationMultiplier
            }
        }
        addEventListener('devicemotion',handleDevicemotion)

        return()=>{
            removeEventListener('devicemotion',handleDevicemotion)
        }
    },[])

    return (
        null  
    );
}
 
export default DeviceOrientationControl;