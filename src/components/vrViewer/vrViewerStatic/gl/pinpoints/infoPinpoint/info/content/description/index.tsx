import { useContext, useMemo } from "react"
import { VrViewerStaticContext } from "../../../../../.."
import { InfoPinpointContext } from "../../.."
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import _ from "lodash";
import { ContentContext } from "..";

const Description = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {fontRegular} = useContext(VrViewerStaticContext)
    const {textRef, 
        pinpoint, 
        size, isTextRendered, 
        setIsTextRendered, textSize, 
        textOpacity, 
        findCustomPinpoint, 
        headerSize,
        descriptionSize,
        gap
    } = useContext(InfoPinpointContext)
    const {descriptionArray} = useContext(ContentContext)

    const description = descriptionArray.join('\n')
    const textGeometry = useMemo(()=>{
        if(fontRegular){
            return new TextGeometry(description as any, {
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
                (pinpoint.info.height/2) - headerSize - (headerSize + (gap * 2) + 1),
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
 
export default Description;