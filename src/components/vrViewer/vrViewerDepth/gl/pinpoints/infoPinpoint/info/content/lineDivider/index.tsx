import { useContext } from 'react';
import * as THREE from 'three'
import { InfoPinpointContext } from '../../..';

const LineDivider = () => {
    const {pinpoint, gap, headerSize, size} = useContext(InfoPinpointContext)
    const planeGeometry = new THREE.PlaneGeometry(pinpoint.info.width * size, 1 * size)
    return (  
        <mesh
            geometry={planeGeometry}
            position={[
                0,
                -headerSize * size/2,
                0
            ]}
            material={new THREE.MeshBasicMaterial({
                color:`white`,
                side:THREE.DoubleSide,
                transparent:true,
                opacity:1,
            })}
        />
    );
}
 
export default LineDivider;