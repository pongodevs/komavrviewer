import * as THREE from 'three'
import { isDesktop } from 'react-device-detect';
import {useContext, useEffect, useMemo, useRef, useState} from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import _ from 'lodash';
import { ViewListType } from '@/types/vrProjectType';
import { Interactive } from '@react-three/xr';
import { VrViewerDepthContext } from '../../..';
import { VrViewerContext } from '../../../..';
import useAnimation from '@/hooks/animation';



const TeleportCircle = ({view}:{view:ViewListType}) => {
    const {gl, camera} = useThree()
    const position = new THREE.Vector3(view.floorPosition.x, view.floorPosition.y + 0.1, view.floorPosition.z)
    const [isHovered, setIsHovered] = useState(false)
    const {selectedProject, currentView} = useContext(VrViewerContext)

    const planeSize = 0.25 * (selectedProject.globalSettings.teleportation.circleSize / 100)

    const {player, 
        isXrMode, gazedViewId,
        parallaxTeleport, xrTeleport, teleportCirclesRef,
        selectedScene,
        isTeleportCirclesEnable,
        mouse
    } = useContext(VrViewerDepthContext)
    

    const handleClick = ()=>{
        if(isXrMode){
            xrTeleport(view)
        }
        if(!isXrMode){
            if(player.canTeleport && !player.isTeleport){
                parallaxTeleport(view, selectedProject.globalSettings.transition.duration)
            }
        }
    }
    
    const {animate} = useAnimation()


    const circleRef = useRef(null as any)
    // Hovered animation
    useEffect(()=>{
        const duration = 0.1
        const scaleTo = 1.4
        if(isHovered){
            if(circleRef.current){
                animate(circleRef.current.scale,{
                    duration,
                    x:scaleTo,
                    y:scaleTo,
                    z:scaleTo,
                    ease:`power3.out`
                })
                animate(circleRef.current.material,{
                    duration,
                    opacity:selectedProject.globalSettings.teleportation.maxOpacity,
                    ease:`power3.out`
                })
            }
        }
        else{
            if(circleRef.current){
                animate(circleRef.current.scale,{
                    duration,
                    x:1.0,
                    y:1.0,
                    z:1.0,
                    ease:`power3.out`
                })
                animate(circleRef.current.material,{
                    duration,
                    opacity:selectedProject.globalSettings.teleportation.minOpacity,
                    ease:`power3.out`
                })
            }
        }
    },[isHovered])

    // Screenshoot opacity
    useEffect(()=>{
        if(!isTeleportCirclesEnable){
            circleRef.current.material.opacity = 0
        }
        else{
            circleRef.current.material.opacity = selectedProject.globalSettings.teleportation.minOpacity
        }
    },[isTeleportCirclesEnable])



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
                depth: 0.04, // Extrusion depth
                bevelEnabled: false, // No bevel
            };
            
            // Create the extruded ring geometry
            const extrudedGeometry = new THREE.ExtrudeGeometry(outerRingShape, extrudeSettings);
            
            return extrudedGeometry
        }
        return getRingGeometry(planeSize)
    },[planeSize])

    
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
                    scale={[1,1,1]}
                    position={position}
                    rotation={[Math.PI/2,0,0]}
                    onPointerUp={(e)=>{
                        if(!mouse.isMouseMove){
                            handleClick()
                            e.stopPropagation()
                            // const raycaster = new THREE.Raycaster()
                            // const x = ( event.clientX / innerWidth ) * 2 - 1;
                            // const y = - ( event.clientY / innerHeight ) * 2 + 1;
                            // console.log(x)
                            // console.log(y)
                            // const pointer = new THREE.Vector2(x,y)
                            // raycaster.setFromCamera( pointer, camera );
                            
                            // const intersects = raycaster.intersectObjects( teleportCirclesRef.current.children );
                            // console.log(intersects)
                            // if(intersects.length > 0){
                            //     const filterIntersects = intersects.filter(i=>{return i.object.name !== currentView._id})
                            //     console.log(filterIntersects)
                            //     if(filterIntersects.length > 0){
                            //         const nearestIntersect = _.sortBy(filterIntersects, 'distance')[0]
                            //         const findView = selectedScene.viewList.find(v=>{return v._id === nearestIntersect.object.name})
                            //         console.log(findView)
                            //         if(findView){
                            //             if(isXrMode){
                            //                 xrTeleport(findView)
                            //             }
                            //             if(!isXrMode){
                            //                 if(player.canTeleport && !player.isTeleport){
                            //                     parallaxTeleport(findView, selectedProject.globalSettings.transition.duration)
                            //                 }
                            //             }
                            //         }
                            //     }
                            // }
                        }
                    }}
                    onPointerEnter={()=>{
                        if(isDesktop){
                            setIsHovered(true)
                        }
                    }}
                    onPointerLeave={()=>{
                        if(isDesktop){
                            setIsHovered(false)
                        }
                    }}
                >
                    <mesh 
                        ref={circleRef}
                        name={view._id}
                        geometry={ringGeometry}
                    >
                        <meshBasicMaterial
                            transparent={true}
                            opacity={selectedProject.globalSettings.teleportation.minOpacity}
                        />
                    </mesh>
                    <mesh
                        name={view._id}
                        rotation={[0,Math.PI,0]}
                    >
                        <planeGeometry
                            args={[planeSize * 2, planeSize * 2]}
                        />
                        <meshBasicMaterial
                            color={`red`}
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