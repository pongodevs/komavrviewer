import { useContext } from "react";
import { FooterUiContext } from "..";
import Autoplay from "./autoplay";
import ScreenshootUi from "./screenshotUi";
import AmbientSound from "./ambientSound";
import FullscreenUi from "./fullscreenUi";
import DeviceOrientation from "./deviceOrientation";
import { isMobile } from "react-device-detect";
import ShowUi from "./showUi";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import { VrViewerStaticContext } from "../../../..";

const UtilsUi = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {isEditorMode, isFullscreen, setIsFullscreen} = useContext(VrViewerStaticContext)
    const {uiRef, uiLength} = useContext(FooterUiContext)
    return (  
        <div
            style={{
                position:`relative`,
                width:`100%`,
                height:`100%`,
                display:isEditorMode?`none`:`flex`,
                flexDirection:`row-reverse`
            }}
        >
            <div  
                ref={uiRef}
                style={{
                    position:`absolute`,
                    top:`calc(${uiLength} * -5rem)`,
                    right:`2rem`
                }}
            >
                {selectedProject.globalSettings.autoplay.isPlay?
                    <Autoplay/>
                :null}
                <ScreenshootUi/>
                {selectedProject.globalSettings.music.url !== ''?
                    <AmbientSound/>
                :null}
                {!isFullscreen?
                    <FullscreenUi/>
                :null}
                {isMobile?
                    <DeviceOrientation/>
                :null}
                <ShowUi/>
            </div>
        </div>
    );
}
 
export default UtilsUi;