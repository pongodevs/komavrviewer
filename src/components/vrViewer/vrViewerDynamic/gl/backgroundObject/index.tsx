import { useContext, useEffect, useMemo, useState } from "react";

import * as THREE from 'three'
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

const BackgroundObject = () => {
    const {material360, mainGeometry} = useContext(VrViewerDynamicContext)
    const backgroundGeometry = useMemo(()=>{
        if(mainGeometry && mainGeometry.boundingBox){
            //Search for min max of bounding box
            const max = mainGeometry.boundingBox.max
            const min = mainGeometry.boundingBox.min
    
            // Create bounding box geometry
            const geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array( [
                //Front face
                min.x, min.y,  min.z,
                max.x, min.y,  min.z,
                max.x, max.y,  min.z,
    
                min.x, max.y,  min.z,
                min.x, min.y,  min.z,
                max.x, max.y,  min.z,
    
                //Back face
                max.x, min.y,  max.z,
                min.x, min.y,  max.z,
                max.x, max.y,  max.z,
    
                min.x, min.y,  max.z,
                min.x, max.y,  max.z,
                max.x, max.y,  max.z,
    
                //Right face
                max.x, min.y,  min.z,
                max.x, max.y,  max.z,
                max.x, max.y,  min.z,
    
                max.x, min.y,  max.z,
                max.x, max.y,  max.z,
                max.x, min.y,  min.z,
    
                //Left face
                min.x, max.y,  max.z,
                min.x, min.y,  min.z,
                min.x, max.y,  min.z,
    
                min.x, max.y,  max.z,
                min.x, min.y,  max.z,
                min.x, min.y,  min.z,
    
                //Top Face
                max.x, max.y,  max.z,
                min.x, max.y,  max.z,
                min.x, max.y,  min.z,
    
                max.x, max.y,  max.z,
                min.x, max.y,  min.z,
                max.x, max.y,  min.z,
    
                //Bottom Face
                min.x, min.y,  max.z,
                max.x, min.y,  max.z,
                min.x, min.y,  min.z,
    
                min.x, min.y,  min.z,
                max.x, min.y,  max.z,
                max.x, min.y,  min.z,
               
            ] );
            geometry.setAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );
    
            return geometry
        }
        else{
            return new THREE.BoxGeometry()
        }
    },[mainGeometry])

    return (
        <mesh
            material={material360}
            geometry={backgroundGeometry}
        />
    );
}
 
export default BackgroundObject;