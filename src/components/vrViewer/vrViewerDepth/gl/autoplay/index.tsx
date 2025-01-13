import { useFrame } from '@react-three/fiber';
import { useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { VrViewerDepthContext } from '../..';
import { VrViewerContext } from '../../..';

const Autoplay = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {camera,  selectedScene, parallaxTeleport, currentView, isAutoplay} = useContext(VrViewerDepthContext)
    const clock = new THREE.Clock()

    const [isTeleport, setIsTeleport] = useState(false)
    const [isFlip, setIsFlip] = useState(false)

    useEffect(()=>{
        const handleMouseMove = ()=>{
            setIsTeleport(false)
            clock.elapsedTime = 0
        }

        addEventListener('mousemove',handleMouseMove)
        return()=>{
            removeEventListener('mousemove',handleMouseMove)
        }
    },)

    clock.start()
    useFrame(()=>{
        if(isAutoplay){
            const timeout = selectedProject.globalSettings.autoplay.timeout
            const teleportDuration = 1

            // Rotate Camera
            if(isFlip || !selectedProject.globalSettings.autoplay.flipFlop){
                camera.rotation.y += selectedProject.globalSettings.autoplay.speed/100 * 0.003
            }
            else{
                camera.rotation.y -= selectedProject.globalSettings.autoplay.speed/100 * 0.003
            }
     
            // Do Teleportation
            if(Math.round(clock.getElapsedTime()) % timeout == 0 && Math.round(clock.getElapsedTime()) !== 0){
                const index = selectedScene.viewList.indexOf(currentView)
                const nextIndex = index + 1 > selectedScene.viewList.length - 1? 0 : index + 1
                const findView = selectedScene.viewList[nextIndex]

                parallaxTeleport(findView, teleportDuration)
                setIsFlip(prev=>{return !prev})
                setIsTeleport(true)
            }
        }
    })
    return ( null
    );
}
 
export default Autoplay;