import { useContext, useState } from "react";
import * as THREE from 'three'
import { InfoPinpointContext } from "../../../..";
import { TexturedImageType } from "..";
import { ContentContext } from "../..";

const Image = ({image}:{image:TexturedImageType}) => {
    const {pinpoint, headerSize, gap, descriptionSize, size} = useContext(InfoPinpointContext)
    const {descriptionArray} = useContext(ContentContext)

    const aspectRatio = (pinpoint.info.images.containerHeight/image.height)
    const width = image.width * aspectRatio
    const offset = image.offset * aspectRatio
    const height = pinpoint.info.images.containerHeight
    const geometry = new THREE.PlaneGeometry(width * size, height * size)
   
    const material = new THREE.MeshBasicMaterial({
        map:image.texture,
        // side:THREE.DoubleSide,
    })

    const headerYOffset = headerSize + headerSize + (gap * 2) + 1
    const descriptionYOffset = descriptionArray.length * (descriptionSize * 1.5)
    return (  
        <>
            <mesh
                position={[
                    (-pinpoint.info.width/2 + (width/2) + offset + (image.index * 15)) * size,
                    ((pinpoint.info.height/2) - (height/2) - headerYOffset - descriptionYOffset) * size,
                    0
                ]}
                geometry={geometry}
                material={material}
            />
        </>
    );
}
 
export default Image;