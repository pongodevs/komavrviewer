import { useContext, useEffect, useState } from "react";
import { InfoPinpointContext } from "../../..";
import Image from "./image";
import { ImageInfoType } from "@/types/vrProjectType";
import * as THREE from 'three'

export type TexturedImageType = {
    _id:string,
    url:string,
    texture:any,
    height:number,
    width:number,
    index:0,
    offset:number
}

const textureLoader = new THREE.TextureLoader()
const Images = () => {
    const {pinpoint} = useContext(InfoPinpointContext)

    const [texturedImages, setTexturedImages] = useState<TexturedImageType[]>([])
    useEffect(()=>{
        const init = async()=>{
            const texturedImages = pinpoint.info.images.imageList.map(async(image,index)=>{
                const promise = new Promise((resolve,reject)=>{
                    textureLoader.load(image.url, (t)=>{
                        t.encoding = THREE.sRGBEncoding
                        resolve({
                            ...image,
                            texture:t,
                            width:t.image.width,
                            height:t.image.height,
                            index:index,
                            offset:0
                        })
                    })
                })
        
                return await promise
            })
            const result = await Promise.all(texturedImages) as TexturedImageType[]

            const finalImages = result.map((image)=>{
                const totalOffsetArray = result.filter(img=>{return img.index < image.index })
                let totalOffset = 0
                if(totalOffsetArray.length > 0){
                    totalOffset = totalOffsetArray.map(img=>{return img.width}).reduce((a,b)=>{return a + b})
                }
                return {...image,
                    offset:totalOffset
                }
            })
            setTexturedImages(finalImages)
        }
        init()
    },[])


    return (  
        <>
            {texturedImages.map((image,index)=>
                <Image
                    key={index}
                    image={image}
                />
            )}
        </>
    );
}
 
export default Images;