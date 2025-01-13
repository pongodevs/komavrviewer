import { useContext, useMemo } from "react"
import { InfoPinpointContext } from "../../.."
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import { VrViewerDepthContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerDepth";

const Header = () => {
    const {fontBold} = useContext(VrViewerDepthContext)
    const {textRef, 
        pinpoint, size, 
        isTextRendered, setIsTextRendered, 
        textSize, textOpacity,
        headerSize,
        findCustomPinpoint} = useContext(InfoPinpointContext)
    const textGeometry = useMemo(()=>{
        if(fontBold){
            return new TextGeometry(pinpoint.info.header, {
                font: fontBold,
                size: headerSize * size,
                curveSegments: 3,
                bevelEnabled: false,
                bevelThickness: 10,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 5
            })
        }
        else{
            return new THREE.BoxGeometry(1,1);
        }
    },[fontBold,findCustomPinpoint?.fontScale])

    return (  
        <mesh
            onAfterRender={()=>{
                if(!isTextRendered){
                    setIsTextRendered(true)
                }
            }}
            ref={textRef}
            scale={[1,1,0.0000001]}
            geometry={textGeometry}
            position={[
                (-pinpoint.info.width/2) * size,
                0,
                0
            ]}
            material={new THREE.MeshBasicMaterial({
                color:`white`,
                transparent:true,
                opacity:1,
            })}
        />
    );
}
 
export default Header;