import { isMobile } from "react-device-detect";
import UiHiddenInstruction from "./uiHiddenInstruction";
import { useContext } from "react";
import ProjectInfo from "./projectInfo";
import HeaderUi from "./headerUi";
import FooterUi from "./footerUi";
import { VrViewerStaticContext } from "../..";
import { VrViewerContext } from "@/components/vrViewer";

const DefaultUi = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {showUi, isFullscreen, isDev, isGameStart} = useContext(VrViewerStaticContext)
    return (  
        <>
            {isMobile?
                <UiHiddenInstruction
                    condition={!showUi || isFullscreen}
                    text={`DOUBLE TAP TO EXIT`}
                />
            :null}
            {showUi || selectedProject.globalSettings.customUi !== `default`?
                <>
                    <ProjectInfo/>
                    <HeaderUi/>
                    <FooterUi/>
                </>
            :null}
        </>
    );
}
 
export default DefaultUi;