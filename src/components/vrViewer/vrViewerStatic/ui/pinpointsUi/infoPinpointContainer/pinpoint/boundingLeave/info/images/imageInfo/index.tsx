import { ImageInfoType } from "@/types/vrProjectType";
import { createContext, useContext } from "react";
import { TailSpin } from "react-loading-icons";
import { InfoPinpointContainerContext } from "../../../../..";
import Delete from "./delete";
import { VrViewerStaticContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerStatic";
import Image from "./image";
import Loading from "./loading";

type ImageInfoContextType = {
    image:ImageInfoType
}
export const ImageInfoContext = createContext<ImageInfoContextType>({} as ImageInfoContextType)
const ImageInfo = ({image}:{image:ImageInfoType}) => {
    const {isEditorMode} = useContext(VrViewerStaticContext)
    const {pin} = useContext(InfoPinpointContainerContext)
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