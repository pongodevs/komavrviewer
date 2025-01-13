import { useContext } from "react";
import { InfoPinpointContext } from "..";
import * as THREE from 'three'
import { PinpointsContext } from "../..";

const Pin = () => {
    const {pinpoint, size} = useContext(InfoPinpointContext)
    const {infoPinpointTexture} = useContext(PinpointsContext)
    return (  
        <mesh
            name={pinpoint._id}
            geometry={new THREE.PlaneGeometry( size * 2 , size * 2)}
            material={new THREE.MeshBasicMaterial({
                map:infoPinpointTexture,
                transparent:true,
            })}
        />
    );
}
 
export default Pin;