import { useContext } from "react";
import DefaultUi from "./defaultUi";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import { VrViewerStaticContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerStatic";
import TopgolfUi from "./topgolfUi";
import EnterEditorMode from "./enterEditorMode";
import LoadingUi from "./loadingUi";
import PinpointsUi from "./pinpointsUi";
import { VRButton } from "@react-three/xr";
import { isDesktop } from "react-device-detect";

const Ui = () => {
    const {selectedProject, isLocal} = useContext(VrViewerContext)
    const {isEditorMode, isDev, isGameStart, isXrMode, showUi} = useContext(VrViewerStaticContext)
    const getUi = ()=>{
        if(isEditorMode){
            return (<DefaultUi/>)
        }
        if(selectedProject.globalSettings.customUi == `default`){
            return (<DefaultUi/>)
        }
        if(selectedProject.globalSettings.customUi == `topgolf`){
            return (<TopgolfUi/>)
        }
    }
    return (  
        <>
            {!isDesktop?
                <div
                    className="no-select"
                    style={{
                        width:`100%`,
                        position:`absolute`,
                        zIndex:1,
                        height:`10%`,
                    }}
                >
                    <VRButton/>
                </div>
            :null}
            {getUi()}
            {isDev && (isGameStart || selectedProject.globalSettings.loading.autoLoad) || isLocal?
                <EnterEditorMode/>
            :null}
            {!selectedProject.globalSettings.loading.autoLoad && !isEditorMode?
                <LoadingUi/>
            :null}
            {!isXrMode?
                <PinpointsUi
                    transition
                />
            :null}
        </>
    );
}
 
export default Ui;