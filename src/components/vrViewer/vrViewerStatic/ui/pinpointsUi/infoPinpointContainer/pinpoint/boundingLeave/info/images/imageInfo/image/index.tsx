import { useContext } from "react";
import { ImageInfoContext } from "..";
import { InfoPinpointContainerContext } from "../../../../../..";

const Image = () => {
    const {pin} = useContext(InfoPinpointContainerContext)
    const {image} = useContext(ImageInfoContext)
    return (  
        <img
            draggable={false}
            src={image.url}
            style={{
                height:pin.info.images.containerHeight - 8
            }}
        />
    );
}
 
export default Image;