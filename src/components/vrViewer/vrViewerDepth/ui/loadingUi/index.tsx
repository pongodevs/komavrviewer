import { useContext } from "react";
import EnterVrButton from "./enterVrButton";
import ProgressBar from "./progressBar";
import { VrViewerDepthContext } from "../..";
import { VrViewerContext } from "../../..";

const LoadingUi = () => {
    const {loadingProgress} = useContext(VrViewerContext)
    const {
        isGameStart,
        bufferProgress
    } = useContext(VrViewerDepthContext)
    const className = bufferProgress == 1? 'text-white': 'text-white bg-dark-grey'
    return (  
        <>
            {!isGameStart?
                <div
                    className={className}
                    style={{
                        backdropFilter:`blur(10px)`,
                        zIndex:`3`,
                        width:`100%`,
                        height:`100%`,
                        position:`fixed`,
                        display:`flex`,
                        justifyContent:`center`,
                        alignItems:`center`
                    }}
                >
                    {loadingProgress == 1?
                        <EnterVrButton/>
                    :
                        <ProgressBar/>
                    }
                </div>
            :null}
        </>
    );
}
 
export default LoadingUi;