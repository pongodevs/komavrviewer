import { useContext } from 'react';
import * as THREE from 'three'
import { TransformAxesContext } from '..';
import { SpatialAudioContext } from '../..';

const Axis = ({axis}:{axis:string}) => {
    const {axesSize, axesHeight, division,setHoveredMovement, hoveredMovement} = useContext(TransformAxesContext)
    const {spatialAudio, setMovement} = useContext(SpatialAudioContext)

    const getRotation = ():any=>{
        if(axis === 'x'){
            return [0, 0, Math.PI* 3/2]
        }
        if(axis === 'y'){
            return [Math.PI/2, 0 , 0]
        }
        if(axis === 'z'){
            return [0,0,0]
        }
    }

    const getPosition = ():any=>{
        if(axis === 'x'){
            return new THREE.Vector3(spatialAudio.position.x + axesHeight/2, spatialAudio.position.y, spatialAudio.position.z)
        }
        if(axis === 'y'){
            return new THREE.Vector3(spatialAudio.position.x, spatialAudio.position.y, spatialAudio.position.z + axesHeight/2)
        }
        if(axis === 'z'){
            return new THREE.Vector3(spatialAudio.position.x, spatialAudio.position.y + axesHeight/2, spatialAudio.position.z)
        }
    }

    const getColor = ():any=>{
        if(axis === 'x'){
            return hoveredMovement === axis? `#fa4b4c`:`#da3636`
        }
        if(axis === 'y'){
            return hoveredMovement === axis? `#4bf05b`:`#28cb24`
        }
        if(axis === 'z'){
            return hoveredMovement === axis? `#5ca9f3`:`#2267de`
        }
    }
    return (  
        <group
            onPointerDown={()=>{
                setMovement(axis)
            }}
            rotation={getRotation()}
            position={getPosition()}
        >
            <mesh
                geometry={new THREE.CylinderGeometry(axesSize * 10,axesSize * 10, axesHeight + axesHeight/4,division)}
                material={new THREE.MeshBasicMaterial({
                    color:new THREE.Color("rgb(255,255,255)"), 
                    transparent:true,
                    depthTest:false,
                    depthWrite:false,
                    opacity:0
                })}
                onPointerEnter={()=>{
                    setHoveredMovement(axis)
                }}
                onPointerLeave={()=>{
                    setHoveredMovement('')
                }}
            />
            <mesh
                geometry={new THREE.CylinderGeometry(axesSize,axesSize, axesHeight,division)}
                material={new THREE.MeshBasicMaterial({color:getColor()})}
            />
            <mesh
                geometry={new THREE.ConeGeometry(axesSize * 8,axesHeight/4,division)}
                material={new THREE.MeshBasicMaterial({color:getColor()})}
                position={[0,axesHeight/2,0]}
            />
        </group>
    );
}
 
export default Axis;