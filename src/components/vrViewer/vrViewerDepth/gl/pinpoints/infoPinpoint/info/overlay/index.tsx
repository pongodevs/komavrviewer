import { useContext } from "react"
import { InfoPinpointContext } from "../.."
import * as THREE from 'three'
import { Interactive } from "@react-three/xr"

const Overlay = () => {
    const {size, pinpoint, setIsRenderInfo} = useContext(InfoPinpointContext)
    
    const xDistance = pinpoint.info.width 
    const yDistance = pinpoint.info.height 
    const padding = 30
    const x = 0
    const y = 0
    const width = (xDistance + padding) * size
    const height = (yDistance + padding) * size
    const radius = 5 * size
    
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
    
    const geometry = new THREE.ShapeGeometry( roundedRect, 12 );
    return (  
        <Interactive
            
        >
            <mesh
                onPointerLeave={()=>{
                    setIsRenderInfo(false)
                }}
                position={[
                    -width/2,
                    -height/2,
                    0.01
                ]}
                geometry={geometry}
                material={new THREE.MeshBasicMaterial({
                    color:`black`,
                    transparent:true,
                    opacity: 0.5,
                })}
            />
        </Interactive>
    );
}
 
export default Overlay;