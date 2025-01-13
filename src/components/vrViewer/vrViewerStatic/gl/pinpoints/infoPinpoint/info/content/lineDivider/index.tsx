import { useContext } from 'react';
import * as THREE from 'three'
import { InfoPinpointContext } from '../../..';

const LineDivider = () => {
    const {pinpoint, gap, headerSize} = useContext(InfoPinpointContext)
    const planeGeometry = new THREE.PlaneGeometry(pinpoint.info.width,0.8)
    return (  
        <mesh
            geometry={planeGeometry}
            position={[
                0,
                (pinpoint.info.height/2) - (headerSize + gap),
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