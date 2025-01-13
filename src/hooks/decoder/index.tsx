import { decode } from "fast-png";
import * as THREE from 'three'

const useDecoder = () => {
    const decode16BitPng = async(url:string)=>{
        const arrayBuffer = await(await fetch(url)).arrayBuffer();
        const {data, channels, height, width, depth} = await decode(arrayBuffer);
        const r = [] as any
        const g = [] as any
        data.forEach(d=>{
            const divider = (d / 65536) * 255
            const rd = Math.floor(divider) 
            const gd = Math.floor((divider % 1) * 100)
            
            for(let i = 0; i < 5 - channels; i++){
                r.push(rd)
                g.push(gd)
            }
        })

        // used the buffer to create a DataArrayTexture
        const macroTexture = new THREE.DataTexture( new Uint8Array(r), width, height);
        const microTexture = new THREE.DataTexture( new Uint8Array(g), width, height);

        macroTexture.magFilter = THREE.LinearFilter
        macroTexture.magFilter = THREE.LinearFilter

        microTexture.minFilter = THREE.LinearFilter
        microTexture.minFilter = THREE.LinearFilter
        
        macroTexture.needsUpdate = true;
        microTexture.needsUpdate = true

        return {
            macroTexture,
            microTexture
        }
    }
    return ({decode16BitPng});
}
 
export default useDecoder;