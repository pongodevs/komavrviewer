import { useContext } from "react";
import * as THREE from 'three';
import { ViewPinpointContext } from "../..";

const TextOverlay = () => {
    const {xDistance, yDistance, size, textOpacity} = useContext(ViewPinpointContext)
    const padding = size * 1
    const x = 0
    const y = 0
    const width = xDistance + padding
    const height = yDistance + padding
    const radius = size * 0.3
    
    const roundedRect = new THREE.Shape();
    
    roundedRect.moveTo( x, y + radius );
    roundedRect.lineTo( x, y + height - radius );
    roundedRect.quadraticCurveTo( x, y + height, x + radius, y + height );
    roundedRect.lineTo( x + width - radius, y + height );
    roundedRect.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
    roundedRect.lineTo( x + width, y + radius );
    roundedRect.quadraticCurveTo( x + width, y, x + width - radius, y );
    roundedRect.lineTo( x + radius, y );
    roundedRect.quadraticCurveTo( x, y, x, y + radius );
    
    const geometry = new THREE.ShapeGeometry( roundedRect,12 );
    return (  
        <mesh
            position={[
                -padding/2,
                -padding/2,
                0,
            ]}
            geometry={geometry}
            material={new THREE.MeshBasicMaterial({
                depthWrite:false,
                color:`black`,
                transparent:true,
                opacity:textOpacity * 0.5,
            })}
        />
    );
}
 
export default TextOverlay;