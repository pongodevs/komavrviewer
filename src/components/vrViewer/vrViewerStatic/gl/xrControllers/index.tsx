import { Controllers, Hands, useXR } from "@react-three/xr"
import { useEffect, useMemo } from "react"
import * as THREE from 'three'
const textureLoader = new THREE.TextureLoader()
const XrControllers = () => {
    const {controllers} = useXR()
    const envTexture = useMemo(()=>{
        const texture = textureLoader.load('/images/hdri/simons_town_road_1k.jpg')
        texture.mapping = THREE.EquirectangularReflectionMapping
        return texture
    },[])

    return (  
        <group>
            <Controllers
                envMap={envTexture}
                envMapIntensity={1}
            />
            <Hands
            />
        </group>
    );
}
 
export default XrControllers;