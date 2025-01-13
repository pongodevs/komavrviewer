import { useContext, useEffect, useState } from 'react';
import * as THREE from 'three'
import { SpatialAudioContext } from '..';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

// const getCircleHelperGeo = (outerRadius:number, innerRadius:number, depth:number)=>{
//     // Define the parameters of the ring
//     const finalOuter = outerRadius < innerRadius? 0.01 : outerRadius
//     const outerRingShape = new THREE.Shape().absarc(0,0, finalOuter, 0, Math.PI * 2, false);
//     const innerRingShape = new THREE.Path().absarc(0,0, innerRadius, 0, Math.PI * 2, false)
    
//     // Create a ring shape using THREE.Shape
//     outerRingShape.holes.push(innerRingShape);
    
//     // Create the extruded ring geometry
//     const shapeGeometry = new THREE.ShapeGeometry(outerRingShape)

//     return shapeGeometry
// }



const RadiusHelper = () => {
    const {spatialAudio, audioSource} = useContext(SpatialAudioContext)
    const {selectedSpatialAudio, cameraRig, setSelectedSpatialAudio, player} = useContext(VrViewerDynamicContext)
    const audioPosition = new THREE.Vector3(spatialAudio.position.x, spatialAudio.position.y, spatialAudio.position.z)

    const [isPointerDown, setIsPointerDown] = useState(false)
    const [isDrag, setIsDrag] = useState(false)
    useEffect(()=>{
        const handlePointerDown = ()=>{
            setIsPointerDown(true)
        }    
        const handlePointerMove = ()=>{
            if(isPointerDown){
                setIsDrag(true)
            }
        }
        const handlePointerUp = ()=>{
            setIsDrag(false)
            setIsPointerDown(false)
        }

        addEventListener('pointerdown',handlePointerDown)
        addEventListener('pointermove',handlePointerMove)
        addEventListener('pointerup',handlePointerUp)
        
        return()=>{
            removeEventListener('pointerdown',handlePointerDown)
            removeEventListener('pointermove',handlePointerMove)
            removeEventListener('pointerup',handlePointerUp)
        }
    })
    return (  
        <group>
            {/* Selection */}
            {selectedSpatialAudio._id !== spatialAudio._id?
                <mesh
                    geometry={new THREE.SphereGeometry(0.2,16,16)}
                    material={new THREE.MeshBasicMaterial({
                        color:`white`, 
                        side:THREE.DoubleSide, 
                        transparent:true, 
                        opacity:1,
                        depthFunc:1
                    })}
                    position={audioPosition}
                    onPointerUp={()=>{
                        if(!isDrag){
                            player.canTeleport = false
                            setSelectedSpatialAudio(spatialAudio)
                            console.log(audioSource)
                            try{
                                console.log('start')
                                audioSource.start()
                            }
                            catch{

                            }
                        }
                    }}
                />
            :null}
            {/* Ref Distance */}
            <mesh
                geometry={new THREE.SphereGeometry(spatialAudio.refDistance,16,16)}
                material={new THREE.MeshBasicMaterial({
                    color:`white`, 
                    side:THREE.DoubleSide, 
                    transparent:true, 
                    opacity:selectedSpatialAudio._id === spatialAudio._id? 0.5 : 0.1
                })}
                position={audioPosition}
            />
            {/* Max Distance */}
            <mesh
                geometry={new THREE.SphereGeometry(spatialAudio.maxDistance,16,16)}
                material={new THREE.MeshBasicMaterial({
                    color:`white`, 
                    side:THREE.DoubleSide, 
                    transparent:true, 
                    opacity:selectedSpatialAudio._id === spatialAudio._id? 0.25 : 0.1
                })}
                position={audioPosition}
            />
        </group>
    );
}
 
export default RadiusHelper;