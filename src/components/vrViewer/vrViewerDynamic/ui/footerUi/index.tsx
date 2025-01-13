import { isDesktop, isMobile } from "react-device-detect";
import AmbientSound from "./ambientSound";
import DeviceOrientation from "./deviceOrientation";
import FullscreenUi from "./fullscreenUi";
import ScreenshootUi from "./screenshotUi";
import {useContext, useEffect, useRef, useState} from 'react';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import Autoplay from "./autoplay";
import ShowUi from "./showUi";
import Measurement from "./measurement";
import DollHouse from "./dollHouse";

const FooterUi = () => {
    const {isEditorMode, selectedProject, isFullscreen, setIsFullscreen, isDollHouseMode, isMeasureMode} = useContext(VrViewerDynamicContext)
    const uiRef = useRef<HTMLDivElement>(null)
    const [uiLength, setUiLength] = useState(0)
    useEffect(()=>{
        if(uiRef.current){
            setUiLength(uiRef.current.children.length)
        }
    })

    
    return (  
        <div
            style={{
                cursor:`initial`,
                zIndex:`2`,
                position:`fixed`,
                bottom:`0`,
                width:isEditorMode?`80%`:`100%`,
                transition:`all 0.2s`
            }}
        >
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
                        right:isDesktop?`2rem`:`1rem`,
                        display:`flex`,
                        flexDirection:`column`,
                        alignItems:`end`
                    }}
                >
                    {/* {!isMeasureMode && isMobile && !isDollHouseMode?
                        <ZoomUi/>
                    :null} */}
                    {!isMeasureMode && selectedProject.globalSettings.dollHouse.enable?
                        <DollHouse/>
                    :null}
                    {selectedProject.type === 'dynamic' && !isMeasureMode && selectedProject.globalSettings.measurement.enable?
                        <Measurement/>
                    :null}
                    {selectedProject.globalSettings.autoplay.isPlay && !isDollHouseMode && !isMeasureMode?
                        <Autoplay/>
                    :null}
                    {!isMeasureMode?
                        <ScreenshootUi/>
                    :null}
                    {selectedProject.globalSettings.music.url !== '' && !isMeasureMode?
                        <AmbientSound/>
                    :null}
                    {!isFullscreen && !isMeasureMode?
                        <FullscreenUi/>
                    :null}
                    {isMobile && !isMeasureMode?
                        <DeviceOrientation/>
                    :null}   
                    {!isMeasureMode?
                        <ShowUi/>
                    :null}   
                </div>
            </div>
        </div>
    );
}
 
export default FooterUi;