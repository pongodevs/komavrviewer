import { useContext } from "react";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import LoadingUi from "./loadingUi";

import ProjectInfo from "./projectInfo";
import EnterEditorMode from "./enterEditorMode";
import RightPanelUi from "./rightPanelUi";
import { isDesktop } from "react-device-detect";
import { VRButton } from "@react-three/xr";
import { VrViewerDepthContext } from "..";
import HeaderUi from "./headerUi";
import PinpointsUi from "./pinpointsUi";
import FooterUi from "./footerUi";
import TeleportLoading from "./teleportLoading";
import Instruction from "./instruction";
import BackgroundOverlay from "./backgroundOverlay";

const Ui = () => {
    const {selectedProject, isDev, isLocal, loginUser} = useContext(VrViewerContext)
    const {isEditorMode, isGameStart, isXrMode,showUi, isTeleportLoading, isProjectInitialize, currentView} = useContext(VrViewerDepthContext)
    return (  
        <>  
            {!isProjectInitialize?
                <BackgroundOverlay/>
            :null}
            <Instruction/>
            {isTeleportLoading?
                <TeleportLoading/>
            :null}
            {/* {!selectedProject.globalSettings.loading.autoLoad && !isEditorMode && !isGameStart?
                <LoadingUi/>
            :null} */}
            {showUi?
                <>
                    <FooterUi/>
                    <HeaderUi/>
                    <ProjectInfo/>
                    {isDev || isLocal || loginUser._id === selectedProject.creatorId?
                        <EnterEditorMode/>
                    :null}
                    <RightPanelUi/>
                    {/* VR BUTTON */}
                    {!isDesktop?
                        <VRButton/>
                    :null}
                    {!isXrMode && selectedProject.globalSettings.teleportation.showPinpoint?
                        <PinpointsUi
                            transition
                        />
                    :null}
                </>
            :null}
        </>
    );
}
 
export default Ui;