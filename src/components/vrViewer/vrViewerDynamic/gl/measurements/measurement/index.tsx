import { Line } from "@react-three/drei";
import * as THREE from 'three';
import {useEffect, useRef} from 'react';
import { MeasurementType, PointsType } from "@/types/vrProjectType";

const Measurement = ({measurement}:{measurement:PointsType}) => {
    const point1 = new THREE.Vector3(measurement.point1.x, measurement.point1.y, measurement.point1.z)

    const pickPoint = measurement.point2.x == 0? measurement.point1 : measurement.point2
    const point2 = new THREE.Vector3(pickPoint.x, pickPoint.y, pickPoint.z)
    const midPoint = new THREE.Vector3().copy(point1).add(point2).multiplyScalar(0.5)
    
    const getMidPoint = (point:any, midPoint:any)=>{
        const pointVector = new THREE.Vector3().copy(midPoint).sub(point)
        const pointVectorLength = new THREE.Vector3().copy(pointVector).length()
        const pointVectorNormalized = new THREE.Vector3().copy(pointVector).normalize()
        const pointVectorLengthSubs = new THREE.Vector3().copy(pointVectorNormalized).multiplyScalar(pointVectorLength - 0.05)
        const newPoint = new THREE.Vector3().copy(point).add(pointVectorLengthSubs)
        return newPoint
    }
    const getEndPoint = (point:any, midPoint:any)=>{
        const pointVector = new THREE.Vector3().copy(midPoint).sub(point)
        const pointVectorLength = new THREE.Vector3().copy(pointVector).length()
        const pointVectorNormalized = new THREE.Vector3().copy(pointVector).normalize()
        const pointVectorLengthSubs = new THREE.Vector3().copy(pointVectorNormalized).multiplyScalar(pointVectorLength - 0.05)
        const newPoint = new THREE.Vector3().copy(midPoint).sub(pointVectorLengthSubs)
        return newPoint
    }

    const getAxis = (point:any, midPoint:any)=>{
        const pointVector = new THREE.Vector3().copy(point).sub(midPoint)
        const pointVectorNormalized = new THREE.Vector3().copy(pointVector).normalize()
        const upVector = new THREE.Vector3(0,1,0)
        const cross = new THREE.Vector3().copy(upVector).cross(pointVectorNormalized).normalize()
        return cross
    }

    const getRotation = (point:any, midPoint:any)=>{
        const pointVector = new THREE.Vector3().copy(point).sub(midPoint)
        const pointVectorNormalized = new THREE.Vector3().copy(pointVector).normalize()
        const upVector = new THREE.Vector3(0,1,0)
        const dot = new THREE.Vector3().copy(upVector).dot(pointVectorNormalized)
        const rotation = Math.acos(dot)
        return rotation
    }

    const point3 = getMidPoint(point1, midPoint)
    const point4 = getMidPoint(point2, midPoint)

    const point5 = getEndPoint(point1, midPoint)
    const point5Axis = getAxis(point1, midPoint)
    const point5Rotation = getRotation(point1, midPoint)

    const point6 = getEndPoint(point2, midPoint)
    const point6Axis = getAxis(point2, midPoint)
    const point6Rotation = getRotation(point2, midPoint)

    const coneRef1 = useRef<any>(null)
    const coneRef2 = useRef<any>(null)

    useEffect(()=>{
        if(coneRef1.current){
            coneRef1.current.rotation.x = 0
            coneRef1.current.rotation.y = 0
            coneRef1.current.rotation.z = 0
            coneRef1.current.rotateOnWorldAxis(point5Axis,point5Rotation)
        }
    },[measurement.point1.x, measurement.point2.x])

    useEffect(()=>{
        if(coneRef2.current){
            coneRef2.current.rotation.x = 0
            coneRef2.current.rotation.y = 0
            coneRef2.current.rotation.z = 0
            coneRef2.current.rotateOnWorldAxis(point6Axis,point6Rotation)
        }
    },[measurement.point1.x, measurement.point2.x])

    const offsetY = 0.01

    const lineWidth = 2
    const coneMaterial = new THREE.MeshBasicMaterial({
        color:`white`, 
        opacity: 1,
        transparent:true,
    })
    return (  
        <>
            {/* Line */}
            <Line
                points={[
                    new THREE.Vector3(point5.x, point5.y + offsetY , point5.z), 
                    new THREE.Vector3(point3.x, point3.y + offsetY , point3.z)
                ]}
                color={'white'}
                lineWidth={lineWidth}
                transparent={true}
            />
            <Line
                points={[
                    new THREE.Vector3(point6.x, point6.y + offsetY , point6.z), 
                    new THREE.Vector3(point4.x, point4.y + offsetY , point4.z)
                ]}
                color={'white'}
                lineWidth={lineWidth}
                transparent={true}
            />
            {/* Cone */}
            <mesh
                ref={coneRef1}
                position={new THREE.Vector3(point5.x, point5.y + offsetY , point5.z)}
                material={coneMaterial}
            >
                <coneBufferGeometry
                    args={[0.02,0.1, 8]}
                />
            </mesh>
            <mesh
                material={coneMaterial}
                ref={coneRef2}
                position={new THREE.Vector3(point6.x, point6.y + offsetY , point6.z)}
            >
                <coneBufferGeometry
                    args={[0.02,0.1, 8]}
                />
            </mesh>
        </>
    );
}
 
export default Measurement;