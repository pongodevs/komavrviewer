import { useContext, useEffect } from "react";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import * as THREE from 'three'
import _ from "lodash";

const DollHouseMaterial = () => {
    const {mainGeometry, setDollHouseMaterial, setSelectedProject, selectedProject, gl, mainMeshRef, dollHouseTexture, setDollHouseTexture} = useContext(VrViewerDynamicContext)
    useEffect(()=>{
        const zMin = _.min(_.chunk(mainGeometry?.attributes.position.array,3).map(arr=>{return arr[1]})) as number
        const finalSectionHeight = Number(zMin) + Number(selectedProject?.globalSettings.dollHouse.sectionHeight)
        // Doll House
        const clippingPlane = new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), finalSectionHeight )
        const dollHouseMaterial = new THREE.MeshBasicMaterial({
            map:dollHouseTexture,
            clippingPlanes:[clippingPlane]
        })

        setDollHouseMaterial(dollHouseMaterial)
        mainMeshRef.current.material = dollHouseMaterial

    },[selectedProject?.globalSettings.dollHouse.sectionHeight])
    return (  
        <>
        </>
    );
}
 
export default DollHouseMaterial;