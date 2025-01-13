import { PointsType, SceneType, ViewListType, infoPinpointObject, spatialAudioObject } from "@/types/vrProjectType";
import _ from "lodash";
import { useContext, useMemo } from "react";
import * as THREE from 'three';
import { v4 } from "uuid";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { ThreeEvent } from "@react-three/fiber";
import { Interactive } from "@react-three/xr";

const MainObject = () => {
    const {
        mainMeshRef, 
        mainGeometry, 
        player, 
        cameraRig, 
        currentView,
        pointer,
        camera,
        material360,
        parallaxTeleport,
        isMeasureMode, setIsMeasureMode,
        measurementState, setMeasurementState,
        measurementArray,setMeasurementArray,
        selectedMeasurement, setSelectedMeasurement,
        isDragInfoPinpoint,setIsDragInfoPinpoint,
        selectedProject,
        selectedDraggedInfoPinpoint,
        isEditorMode,
        isDragSpatialAudio, setIsDragSpatialAudio,
        enableOrbitControl,
        flooredViewArray,
        isXrMode,
        isProjectInitialize,
        nextView
    } = useContext(VrViewerDynamicContext)

    const handlePointerUpMeasurement = ()=>{
        if(isMeasureMode){
            if(measurementState.phase == 2){
                setMeasurementState(prev=>{
                    return {...prev,
                        phase:0
                    }
                })
                setIsMeasureMode(false)
            }
        }
    }

    const handlePointerUpInfoPinpoint = (e:ThreeEvent<PointerEvent>)=>{
        if(isDragInfoPinpoint){
            const info = {...infoPinpointObject}
            info._id = v4()
            info.position = {
                x:e.point.x,
                y:e.point.y,
                z:e.point.z,
            }
            selectedProject.infoPinpoints.pinpoints.push(info)
        }
    }

    const handlePointerUpTeleportation = (e:ThreeEvent<PointerEvent>)=>{
        if(player.canTeleport && !player.isViewTransition && !isDragInfoPinpoint && !isDragSpatialAudio && enableOrbitControl && !isXrMode){
            
            const rayLocation = new THREE.Vector3(e.point.x, e.point.y, e.point.z)
            const filteredViewList = flooredViewArray.filter((view:ViewListType)=>{
                const cameraRigPos = new THREE.Vector3(cameraRig.position.x, cameraRig.position.y, cameraRig.position.z)
                
                const charForwardVector = camera.getWorldDirection(new THREE.Vector3())
                const dirToViewLocation = new THREE.Vector3(view.position.x, view.position.y, view.position.z).sub(cameraRigPos).normalize()
                const dirToViewLocationXZ = new THREE.Vector3(dirToViewLocation.x, 0, dirToViewLocation.z).normalize()
                const dirToTeleportLocation = new THREE.Vector3().copy(rayLocation).sub(cameraRigPos).normalize()
                const dirToTeleportLocationXZ = new THREE.Vector3(dirToTeleportLocation.x, 0, dirToTeleportLocation.z).normalize()
                
                const viewDotProduct = dirToViewLocationXZ.dot(dirToTeleportLocationXZ)
                
                const cameraDotProduct = dirToViewLocation.dot(charForwardVector)
                const cameraAngleInDegrees = (Math.acos(cameraDotProduct) * 180) / Math.PI;
    
                const condition1 = viewDotProduct > 0 // View to View location must be align
                const condition2 = cameraAngleInDegrees < 90 // Camera angle under 65 degrees
                const condition3 = Math.abs(view.position.y - cameraRig.position.y) < 3 // Height < 3
                const condition4 = view._id !== currentView._id // Not this view

                return condition1 && condition2 && condition3 && condition4
            })
            
            const distanceArray = filteredViewList.map((view:ViewListType)=>{
                const rayLocation = new THREE.Vector3(e.point.x, e.point.y, e.point.z)
                const viewPos = new THREE.Vector3(view.position.x,view.position.y,view.position.z)
                return rayLocation.distanceTo(viewPos)
            })

            const minDistance = _.minBy(distanceArray) as number
            const index = distanceArray.indexOf(minDistance)
            
            if(index !== -1){
                //Set View to nearest click
                const view = filteredViewList[index]
                const condition1 = view._id !== currentView._id // not this view
                const peekingDistance = 0.4 // 40 cm to all angle
                const sphereGeometry = new THREE.SphereGeometry(peekingDistance, 3, 3) as any;
                const positionArray = _.chunk(sphereGeometry.attributes.position.array,3)
                const isHitArray = positionArray.map((pos:any)=>{
                    const position = new THREE.Vector3(pos[0],pos[1],pos[2])
                    const cameraRigPos = new THREE.Vector3(cameraRig.position.x, cameraRig.position.y, cameraRig.position.z)
                    const newPosition = new THREE.Vector3().copy(cameraRigPos).add(position)

                    const raycaster = new THREE.Raycaster()
                    const raycastDirection = new THREE.Vector3(view.position.x, view.position.y, view.position.z).sub(new THREE.Vector3(newPosition.x, newPosition.y, newPosition.z)).normalize()
                    raycaster.set(new THREE.Vector3(newPosition.x, newPosition.y, newPosition.z), raycastDirection)
                    const intersectObject = raycaster.intersectObject(mainMeshRef.current, false)
                    const intersectDistance = _.minBy(intersectObject,'distance')?.distance
                    const viewDistance = new THREE.Vector3(view.position.x, view.position.y, view.position.z).distanceTo(new THREE.Vector3(newPosition.x, newPosition.y, newPosition.z))
                    const condition = ((intersectDistance || 10000) > viewDistance) // is view not obstructed 
                    return condition
                })
                const condition2 = _.includes(isHitArray, true)
                if(condition1 && condition2){
                    parallaxTeleport(view, selectedProject.globalSettings.transition.duration)
                }
            }
        }
    }

    const handlePointerUpSpatialAudio = (e:ThreeEvent<PointerEvent>)=>{ 
        if(isDragSpatialAudio){
            const spatialAudio = {...spatialAudioObject}
            spatialAudio._id = v4()
            spatialAudio.audioName = `Audio ${selectedProject.spatialAudio.audios.length + 1}`
            spatialAudio.position = {
                x:Math.round(e.point.x * 100)/100,
                y:Math.round((e.point.y + 0.2) * 100) /100,
                z:Math.round(e.point.z * 100)/100,
            }
            spatialAudio.refDistance = 1.5
            spatialAudio.maxDistance = 3
            selectedProject.spatialAudio.audios.push(spatialAudio)
        }
    }

   

    return (  
        <Interactive
            onSelect={()=>{
                console.log('select')
            }}
        >
            <mesh
                ref={mainMeshRef}
                geometry={mainGeometry}
                material={material360}
                onPointerDown={(e)=>{
                    // Measurement
                    const measurement = measurementArray.find(m=>{return m._id === selectedMeasurement._id}) as PointsType
                    if(isMeasureMode){
                        if(measurementState.phase == 1){
                            measurement.point1.x = e.point.x
                            measurement.point1.y = e.point.y
                            measurement.point1.z = e.point.z
                            setMeasurementArray(prev=>{return [...prev]})
                        }
                        setMeasurementState(prev=>{
                            return {...prev,
                                phase:2
                            }
                        })
                    }
                }}
                onPointerUp={e=>{
                    // Measurement
                    handlePointerUpMeasurement()
    
                    // Info Pinpoint
                    handlePointerUpInfoPinpoint(e)
    
                    // Spatial Audio
                    // handlePointerUpSpatialAudio(e)
    
                    //Teleportation
                    handlePointerUpTeleportation(e)
                }}
                
                onPointerMove={(e:any)=>{
                    // For pointer variable
                    const intersectLocation = e.point
                    const intersectNormal = e.face.normal
                    const intersectDistance =  e.distance
            
                    pointer.position3d.x = intersectLocation.x;
                    pointer.position3d.y = intersectLocation.y;
                    pointer.position3d.z = intersectLocation.z;
            
                    pointer.normal.x =  intersectNormal.x;
                    pointer.normal.y =  intersectNormal.y;
                    pointer.normal.z =  intersectNormal.z;
                    
                    pointer.distance = intersectDistance;
    
                    // Info Pinpoint
                    if(selectedDraggedInfoPinpoint._id !== '' && isEditorMode){
                        selectedDraggedInfoPinpoint.position.x = intersectLocation.x
                        selectedDraggedInfoPinpoint.position.y = intersectLocation.y
                        selectedDraggedInfoPinpoint.position.z = intersectLocation.z
                    }
                    // Measure
                    if(isMeasureMode){
                        const measurement = measurementArray.find(m=>{return m._id === selectedMeasurement._id}) as PointsType
                        if(measurementState.phase == 1){
                            measurement.point1.x = e.point.x
                            measurement.point1.y = e.point.y
                            measurement.point1.z = e.point.z
                            setMeasurementArray(prev=>{return [...prev]})
                        }
                        if(measurementState.phase == 2){
                            measurement.point2.x = e.point.x
                            measurement.point2.y = e.point.y
                            measurement.point2.z = e.point.z
                            setMeasurementArray(prev=>{return [...prev]})
                        }
                    }
                    
                }}
                
            />
        </Interactive>
    );
}
 
export default MainObject;