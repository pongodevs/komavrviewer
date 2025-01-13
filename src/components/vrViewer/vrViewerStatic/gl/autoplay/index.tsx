import { useContext, useEffect ,useState} from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'
import { VrViewerStaticContext } from '../..';
import { VrViewerContext } from '../../..';

const Autoplay = () => {
    const {camera,  isGameStart, selectedScene, teleport, currentView, isAutoplay} = useContext(VrViewerStaticContext)
    const {selectedProject} = useContext(VrViewerContext)
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
            // Rotate Camera
            if(isFlip || !selectedProject.globalSettings.autoplay.flipFlop){
                camera.rotation.y += selectedProject.globalSettings.autoplay.speed/100 * 0.003
            }
            else{
                camera.rotation.y -= selectedProject.globalSettings.autoplay.speed/100 * 0.003
            }
     
            // Do Teleportation
            if(Math.round(clock.getElapsedTime()) % timeout == 0 && Math.round(clock.getElapsedTime()) !== 0){
                const viewlistExceptThis = selectedScene.viewList.filter(view=>view._id !== currentView._id)
                const findView = viewlistExceptThis[Math.floor(Math.random()*viewlistExceptThis.length)]
                teleport(findView)
                setIsFlip(prev=>{return !prev})
                setIsTeleport(true)
            }
        }
    })
    return ( null
    );
}
 
export default Autoplay;