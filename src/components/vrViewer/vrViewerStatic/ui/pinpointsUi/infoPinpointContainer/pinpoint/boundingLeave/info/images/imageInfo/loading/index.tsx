import { useContext } from "react";
import { TailSpin } from "react-loading-icons";
import { ImageInfoContext } from "..";
import { InfoPinpointContainerContext } from "../../../../../..";

const Loading = () => {
    const {pin} = useContext(InfoPinpointContainerContext)
    const {image} = useContext(ImageInfoContext)
    return (  
        <div
            className="bg-dark-grey text-light-grey"
            style={{
                zIndex:`3`,
                width:`${pin.info.images.containerHeight}px`,
                height:`100%`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                position:`relative`,
                borderRadius:`4px`
            }}
        >
            <TailSpin/>
            {/* Progress bar */}
            <div
                style={{
                    position:`absolute`,
                    width:`90%`,
                    height:`0.5rem`,
                    border:`0.3px solid grey`,
                    borderRadius:`25px`,
                    bottom:`0.5rem`,
                    overflow:`hidden`
                }}
            >
                {/* Bar */}
                <div
                    id={`progress-bar-${image._id}`}
                    className="bg-blue"
                    style={{
                        width:`0%`,
                        height:`100%`,
                        borderRadius:`25px`
                    }}
                >
                </div>
            </div>
        </div>
    );
}
 
export default Loading;