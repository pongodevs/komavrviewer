import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useEffect } from "react";
import { VrViewerDepthContext } from "../..";
import * as THREE from 'three'
const WasdMovement = () => {
    const {camera} = useThree()
    const {cameraRig} = useContext(VrViewerDepthContext)
    const movement = {
        forward:false,
        backward:false,
        left:false,
        right:false,
        up:false,
        down:false,
    }
    useEffect(()=>{
        const handleKeyDown = (e:KeyboardEvent)=>{
            if(e.code === 'KeyW'){
                movement.forward = true
            }
            if(e.code === 'KeyS'){
                movement.backward = true
            }
            if(e.code === 'KeyD'){
                movement.right = true
            }
            if(e.code === 'KeyA'){
                movement.left = true
            }
            if(e.code === 'KeyE'){
                movement.up = true
            }
            if(e.code === 'KeyQ'){
                movement.down = true
            }
        }
        const hanldeKeyUp = (e:KeyboardEvent)=>{
            if(e.code === 'KeyW'){
                movement.forward = false
            }
            if(e.code === 'KeyS'){
                movement.backward = false
            }
            if(e.code === 'KeyD'){
                movement.right = false
            }
            if(e.code === 'KeyA'){
                movement.left = false
            }
            if(e.code === 'KeyE'){
                movement.up = false
            }
            if(e.code === 'KeyQ'){
                movement.down = false
            }
        }
        addEventListener('keydown',handleKeyDown)
        addEventListener('keyup',hanldeKeyUp)

        return()=>{
            removeEventListener('keydown',handleKeyDown)
            removeEventListener('keyup',hanldeKeyUp)
        }
    },)

    useFrame(()=>{
        const mult = 0.005
        const cameraDir = camera.getWorldDirection(new THREE.Vector3())
        const camDirWithoutY= new THREE.Vector3(cameraDir.x, 0, cameraDir.z).normalize()
        const upVector = new THREE.Vector3(0,1,0)
        const rightVector = new THREE.Vector3().copy(camDirWithoutY).cross(upVector)
        if(movement.forward){
            cameraRig.position.x += (camDirWithoutY.x * mult)
            cameraRig.position.y += (camDirWithoutY.y * mult)
            cameraRig.position.z += (camDirWithoutY.z * mult)
        }
        if(movement.backward){
            cameraRig.position.x -= (camDirWithoutY.x * mult)
            cameraRig.position.y -= (camDirWithoutY.y * mult)
            cameraRig.position.z -= (camDirWithoutY.z * mult)
        }
        if(movement.right){
            cameraRig.position.x += (rightVector.x * mult)
            cameraRig.position.y += (rightVector.y * mult)
            cameraRig.position.z += (rightVector.z * mult)
        }
        if(movement.left){
            cameraRig.position.x -= (rightVector.x * mult)
            cameraRig.position.y -= (rightVector.y * mult)
            cameraRig.position.z -= (rightVector.z * mult)
        }
        if(movement.up){
            cameraRig.position.x += (upVector.x * mult)
            cameraRig.position.y += (upVector.y * mult)
            cameraRig.position.z += (upVector.z * mult)
        }
        if(movement.down){
            cameraRig.position.x -= (upVector.x * mult)
            cameraRig.position.y -= (upVector.y * mult)
            cameraRig.position.z -= (upVector.z * mult)
        }
    })
    return (  
        <>
        </>
    );
}
 
export default WasdMovement;