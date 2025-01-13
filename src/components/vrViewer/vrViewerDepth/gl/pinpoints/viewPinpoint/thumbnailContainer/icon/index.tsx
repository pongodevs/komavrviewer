import { PinpointsContext } from "../../..";
import { useContext } from "react";
import * as THREE from 'three';
import { ViewPinpointContext } from "../..";

const Icon = () => {
    const {mapPinpointTexture} = useContext(PinpointsContext)
    const {size, pinpoint} = useContext(ViewPinpointContext)
    return (  
        <mesh
            name={pinpoint._id}
            position={[0,0,0]}
            geometry={new THREE.PlaneGeometry( size * 4 , size * 4)}
            material={new THREE.MeshBasicMaterial({
                map:mapPinpointTexture,
                transparent:true,
            })}
        />
    );
}
 
export default Icon;