import { MeasurementType, PointsType } from '@/types/vrProjectType';
import {useRef, useEffect, useContext, useState} from 'react';
import * as THREE from 'three'
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

const MeasurementNumber = ({measurement}:{measurement:PointsType}) => {
    const numberRef = useRef<HTMLDivElement>(null)
    const {cameraRig, camera, mainMeshRef} = useContext(VrViewerDynamicContext)

    const point1 = new THREE.Vector3(measurement.point1.x, measurement.point1.y, measurement.point1.z)
    const point2 = new THREE.Vector3(measurement.point2.x, measurement.point2.y, measurement.point2.z)
    const distance = point1.distanceTo(point2)
    const roundDistance = Math.round(distance * 100) /100

    const [cameraDistance, setCameraDistance] = useState(0) 
    useEffect(()=>{
        let animationFrameId:any
        const render = () => {
            if(cameraRig.position.x != 99999){
                // Rotated value
                const midPoint = new THREE.Vector3().copy(point1).add(point2).multiplyScalar(0.5)
                
                // Get dot product
                const cameraToPoint = new THREE.Vector3().subVectors(cameraRig.position,midPoint)
                const currentPos = new THREE.Vector3(cameraRig.position.x, cameraRig.position.y, cameraRig.position.z)
                setCameraDistance(currentPos.distanceTo(midPoint))
                const cameraToPointVector = new THREE.Vector3().copy(cameraToPoint).normalize()
    
                const cameraDir = camera.getWorldDirection(new THREE.Vector3())
                if(cameraDir){
                    const dotProduct = cameraDir.dot(cameraToPointVector)
                    // Translate UI according to 2D space
                    const screenPosition = midPoint.clone()
                    screenPosition.project(camera as any)

                    // Raycast
                    console.log(dotProduct)
                    const translateX =  dotProduct > 0 ? 999999 : (screenPosition.x * innerWidth * 0.5) 
                    const translateY =  dotProduct > 0 ? 999999 : (-screenPosition.y * innerHeight * 0.5)
                    if(numberRef.current){
                        numberRef.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
                    }
                }
            }
 
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    },)
    return (  
        <>
            <div
                className='no-select'
                ref={numberRef}
                style={{
                    pointerEvents:`none`,
                    zIndex:`50`,
                    position:`fixed`,
                    cursor:`pointer`,
                    left:`50%`,
                    top:`50%`,
                    display:`flex`,
                    justifyContent:`center`,
                    alignItems:`center`,
                    flexWrap:`wrap`,
                }}
            >
                <div
                    className='text-white'
                    style={{
                        transform:`translateX(-50%) translateY(-50%)`,
                        fontSize:`1.2rem`,
                        fontWeight:`600`,
                        letterSpacing:`0px`,
                        opacity:`calc( (5 - ${cameraDistance}) * 100%)`
                    }}
                >
                    {roundDistance} m
                </div>
            </div>
        </>
    );
}
 
export default MeasurementNumber;