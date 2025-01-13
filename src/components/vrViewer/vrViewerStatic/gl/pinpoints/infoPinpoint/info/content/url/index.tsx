import { useContext, useMemo } from "react"
import { VrViewerStaticContext } from "../../../../../.."
import { InfoPinpointContext } from "../../.."
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { ContentContext } from "..";
import { Interactive } from "@react-three/xr";

const Url = () => {
    const {fontRegular} = useContext(VrViewerStaticContext)
    const {textRef, 
        pinpoint, size, 
        isTextRendered, setIsTextRendered, 
        textSize, textOpacity,
        headerSize,
        descriptionSize,
        gap,
        findCustomPinpoint
    } = useContext(InfoPinpointContext)

    const {descriptionArray} = useContext(ContentContext)

    const textGeometry = useMemo(()=>{
        if(fontRegular){
            return new TextGeometry(pinpoint.info.url, {
                font: fontRegular,
                size: descriptionSize,
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
    },[fontRegular,findCustomPinpoint?.fontScale])

    const height = pinpoint.info.images.containerHeight
    const headerYOffset = headerSize + headerSize + (gap * 2) + 1
    const descriptionYOffset = descriptionArray.length * (descriptionSize * 1.5)
    return (  
        <Interactive
            onSelect={()=>{
                open(pinpoint.info.url, '_blank')
            }}
        >
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
                    (pinpoint.info.height/2) - height - headerYOffset - descriptionYOffset - descriptionSize - (gap * 2),
                    0
                ]}
                material={new THREE.MeshBasicMaterial({
                    color:new THREE.Color(0x1a73e8),
                    transparent:true,
                    opacity:1,
                })}
            />
        </Interactive>
    );
}
 
export default Url;