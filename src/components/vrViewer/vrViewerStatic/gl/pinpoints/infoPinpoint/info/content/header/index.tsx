import { useContext, useMemo } from "react"
import { VrViewerStaticContext } from "../../../../../.."
import { InfoPinpointContext } from "../../.."
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const Header = () => {
    const {fontBold} = useContext(VrViewerStaticContext)
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
                size: headerSize,
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
            scale={[1,1,0.00001]}
            geometry={textGeometry}
            position={[
                (-pinpoint.info.width/2),
                (pinpoint.info.height/2) - headerSize,
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