import { useContext, useEffect, useMemo, useState } from "react";

// @ts-ignore
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import * as THREE from 'three'
import { VrViewerStaticContext } from "../../../../..";
import { ViewPinpointContext } from "../..";

const Text = () => {
    const {fontBold} = useContext(VrViewerStaticContext)
    const {textRef, pinpoint, size, isTextRendered, setIsTextRendered, textSize, textOpacity} = useContext(ViewPinpointContext)

    const textGeometry = useMemo(()=>{
        if(fontBold){
            return new TextGeometry(pinpoint.labelName, {
                font: fontBold,
                size: size * ( 1 / textSize ) * 0.5,
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
    },[fontBold])

    return (  
        <mesh
            onAfterRender={()=>{
                if(!isTextRendered){
                    setIsTextRendered(true)
                }
            }}
            ref={textRef}
            scale={0.000010}
            geometry={textGeometry}
            position={[
                0,
                0,
                size * 0.1
            ]}
            material={new THREE.MeshBasicMaterial({
                color:`white`,
                side:THREE.DoubleSide,
                transparent:true,
                opacity:textOpacity
            })}
        />
    );
}
 
export default Text;