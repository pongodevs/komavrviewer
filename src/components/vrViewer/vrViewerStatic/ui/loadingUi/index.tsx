import { useContext } from "react";

import EnterVrButton from "./enterVrButton";
import ProgressBar from "./progressBar";
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';

const LoadingUi = () => {
    const {
        isGameStart,
        
    } = useContext(VrViewerStaticContext)

    const {
        loadingProgress, setLoadingProgress,
        loadingProcessName, setLoadingProcessName,
        selectedProject
    } = useContext(VrViewerContext)
    return (  
        <>
            {!isGameStart?
                <div
                    className=" text-white"
                    style={{
                        background:`rgba(0,0,0,0.7)`,
                        backdropFilter:`blur(10px)`,
                        zIndex:`100`,
                        width:`100%`,
                        height:`100%`,
                        position:`fixed`,
                        display:`flex`,
                        justifyContent:`center`,
                        alignItems:`center`,
                        transition:`all 0.5s`,
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