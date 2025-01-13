import { useContext } from "react";
import UiHiddenInstruction from "./uiHiddenInstruction";
import { VrViewerDynamicContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import LoadingUi from "./loadingUi";
import MeasurementsNumbers from "./measurementsNumber";
import FooterUi from "./footerUi";
import ChangeScene from "./changeScene";
import ProjectInfo from "./projectInfo";
import EnterEditorMode from "./enterEditorMode";
import RightPanelUi from "./rightPanelUi";
import { isDesktop } from "react-device-detect";
import InfoPinpoints from "./infoPinpoints";
import { VRButton } from "@react-three/xr";
import DollHouseSectionSlider from "./dollHouseSectionSlider";

const Ui = () => {
    const {selectedProject, isDev, isLocal} = useContext(VrViewerContext)
    const {isEditorMode, isGameStart, isDollHouseMode, showUi, isAutoplay, cameraRig} = useContext(VrViewerDynamicContext)
    return (  
        <>
            <UiHiddenInstruction/> 
            {!selectedProject.globalSettings.loading.autoLoad && !isEditorMode && !isGameStart?
                <LoadingUi/>
            :null}
            {!isDollHouseMode?
                <MeasurementsNumbers/>
            :null}
            {showUi?   
                <FooterUi/>
            :null}
            {!isDollHouseMode && showUi && selectedProject.scenes.length > 1?
                <ChangeScene/>
            :null}
            {showUi?
                <ProjectInfo/>
            :null}
            {isDev || isLocal?
                <EnterEditorMode/>
            :null}
            <RightPanelUi/>
            {!isAutoplay && showUi && isDesktop && !isDollHouseMode?
                <InfoPinpoints/>
            :null}
            {isDollHouseMode?
                <DollHouseSectionSlider/>
            :null}
            {/* VR BUTTON */}
            {!isDesktop?
                <VRButton/>
            :null}
        </>
    );
}
 
export default Ui;