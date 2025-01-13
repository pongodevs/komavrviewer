import * as THREE from 'three'
import { isDesktop } from 'react-device-detect';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import {useContext, useEffect, useMemo, useRef, useState} from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import _ from 'lodash';
import { ViewListType } from '@/types/vrProjectType';
import { Interactive } from '@react-three/xr';




const TeleportCircle = ({view}:{view:ViewListType}) => {
    const position = new THREE.Vector3(view.position.x, view.position.y, view.position.z)
    const [isHovered, setIsHovered] = useState(false)
    const {pointer,clippingPlane, showUi, selectedProject, cameraRig, parallaxTeleport, xrTeleport, player, 
        isXrMode, gazedViewId, setGazedViewId, setIsTeleportCircleTouchDown,
        isTeleportCirclesEnable,
        isDollHouseMode
    } = useContext(VrViewerDynamicContext)

    const planeSize = showUi? 0.5 : 0

    const getPointerPosition = ()=>{
        if(isDesktop){
            if(pointer){
                return new THREE.Vector3(pointer.position3d.x,pointer.position3d.y, pointer.position3d.z)
            }
        }
        else{
            if(cameraRig){
                return new THREE.Vector3(cameraRig.position.x, cameraRig.position.y, cameraRig.position.z)
            }
        }
        return new THREE.Vector3(0,0,0)
    }
    
    const [meshScale, setMeshScale] = useState(0)
    const [meshOpacity, setMeshOpacity] = useState(0)

    const getOpacity = ()=>{
        const pointerPosition = getPointerPosition()
        const centerPosition = position? new THREE.Vector3(position.x, position.y, position.z) : new THREE.Vector3(0,0,0)
        const distance = pointerPosition.distanceTo(centerPosition)
        const multiplier = isDesktop? 1 : 0.7
        const finalDistance = distance / 5 * multiplier
        const minOpacity = selectedProject.globalSettings.teleportation.minOpacity
        const maxOpacity = selectedProject.globalSettings.teleportation.maxOpacity
        return Math.max(minOpacity, (maxOpacity - finalDistance))
    }

    useFrame(()=>{
        if(!isXrMode){
            if(position){
                const meshPosition = new THREE.Vector3(position.x, position.y, position.z)
                const pointerPosition = new THREE.Vector3(pointer.position3d.x, pointer.position3d.y, pointer.position3d.z)
                setMeshScale(Math.min(1, Math.max(0.5 ,1 - (meshPosition.distanceTo(pointerPosition)/3) )))
            }
    
            const opacity = getOpacity()
            setMeshOpacity(opacity)
        }
    })

    const getXrOpacity = ()=>{
        if(isXrMode){
            if(isHovered || gazedViewId === view._id){
                return 0.5
            }
            else{
                return 0.2
            }
        }
        else{
            return meshOpacity
        }
    }
    
    

    const handleClick = ()=>{
        if(isXrMode){
            xrTeleport(view)
        }
        if(!isXrMode && isDollHouseMode){
            parallaxTeleport(view, selectedProject.globalSettings.transition.duration)
        }
    }

    const scaleMultiplier = isHovered || gazedViewId === view._id? 1.1 : 1

    const getXrScale = ()=>{
        const finalMult = meshScale * scaleMultiplier
        if(isXrMode){
            return {
                x:1.2 * finalMult,
                y:1.2 * finalMult,
                z:0.1 * finalMult,
            }
        }
        else{
            return {
                x:1 * finalMult,
                y:1 * finalMult,
                z:1 * finalMult
            }
        }
    }

    const ringGeometry = useMemo(()=>{
        const getRingGeometry = (planeSize:number)=>{
            const innerRadius = .5 * planeSize; // Inner radius of the ring
            const outerRadius = 0.7 * planeSize; // Outer radius of the ring
        
            // Define the parameters of the ring
            const outerRingShape = new THREE.Shape().absarc(0,0, outerRadius, 0, Math.PI * 2, false);
            const innerRingShape = new THREE.Path().absarc(0,0, innerRadius, 0, Math.PI * 2, false)
            
            // Create a ring shape using THREE.Shape
            outerRingShape.holes.push(innerRingShape);
            
            // Define extrusion settings
            const extrudeSettings = {
                depth: 0.05, // Extrusion depth
                bevelEnabled: false, // No bevel
            };
            
            // Create the extruded ring geometry
            const extrudedGeometry = new THREE.ExtrudeGeometry(outerRingShape, extrudeSettings);
            
            return extrudedGeometry
        }
        return getRingGeometry(planeSize)
    },[])

    const teleporMaterial = useMemo(()=>{
        return new THREE.MeshBasicMaterial({
            transparent:true,
            opacity:isTeleportCirclesEnable?getXrOpacity():0,
        })
    },[meshOpacity,isTeleportCirclesEnable])

    
    return (  
        <>
            <Interactive
                onSelect={handleClick}
                onSqueeze={handleClick}
                onHover={()=>{
                    setIsHovered(true)
                }}
                onBlur={()=>{
                    setIsHovered(false)
                }}
            >
                <group
                    scale={[getXrScale().x, getXrScale().y, getXrScale().z]}
                    position={position}
                    rotation={[Math.PI/2,0,0]}
                    onPointerDown={()=>{
                        setIsTeleportCircleTouchDown(true)
                    }}
                    onPointerUp={()=>{
                        setIsTeleportCircleTouchDown(false)
                        handleClick()
                    }}
                >
                    <mesh 
                        name={view._id}
                        geometry={ringGeometry}
                        material={teleporMaterial}
                    />
                    <mesh
                        name={view._id}
                    >
                        <circleGeometry
                            args={[meshScale/2]}
                        />
                        <meshBasicMaterial
                            color={`red`}
                            side={THREE.DoubleSide}
                            opacity={0}
                            transparent={true}
                        />
                    </mesh>
                    
                </group>
            </Interactive>
        </>
    );
}
 
export default TeleportCircle;