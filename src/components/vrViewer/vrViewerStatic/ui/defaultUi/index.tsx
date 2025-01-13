import { isMobile } from "react-device-detect";
import UiHiddenInstruction from "./uiHiddenInstruction";
import { useContext } from "react";
import { VrViewerStaticContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerStatic";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import ProjectInfo from "./projectInfo";
import HeaderUi from "./headerUi";
import RightPanelUi from "./rightPanelUi";
import FooterUi from "./footerUi";

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
                    <RightPanelUi/>
                    <FooterUi/>
                </>
            :null}
        </>
    );
}
 
export default DefaultUi;