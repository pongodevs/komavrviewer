import { ImageInfoType } from "@/types/vrProjectType";
import { createContext, useContext } from "react";
import Delete from "./delete";
import Image from "./image";
import Loading from "./loading";
import { VrViewerDepthContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerDepth";

type ImageInfoContextType = {
    image:ImageInfoType
}
export const ImageInfoContext = createContext<ImageInfoContextType>({} as ImageInfoContextType)
const ImageInfo = ({image}:{image:ImageInfoType}) => {
    const {isEditorMode} = useContext(VrViewerDepthContext)
    return (  
        <ImageInfoContext.Provider
            value={{
                image
            }}
        >
            <div
                style={{
                    position:`relative`
                }}
            >
                {isEditorMode?
                    <Delete/>
                :null}
                {/* Image Loading */}
                {image.url === ''?
                    <Loading/>
                :
                    <Image/>
                }
            </div>
        </ImageInfoContext.Provider>
    );
}
 
export default ImageInfo;