import {useContext} from 'react';
import { RightPanelUiContext } from '..';
import GlobalSettingsProperties from './globalSettingsProperties';
import ColorCorrectionProperties from './colorCorrectionProperties';
import InfoPinpointsProperties from './infoPinpointsProperties';
import DangerZoneProperties from './dangerZoneProperties';
import SpatialSoundProperties from './spatialSoundProperties';
import VirtualRealityProperties from './virtualRealityProperties';
const PropertiesPanel = () => {
    const {selectedNavigationList} = useContext(RightPanelUiContext)
    return (  
        <div
            className="bg-grey"
            style={{
                width:`100%`,
                height:`100%`,
                padding:`1rem`
            }}
        >
            <div
                style={{
                    width:`100%`,
                    height:`92%`,
                    overflowY:`auto`,
                    overflowX:`hidden`,
                }}
            >
                {selectedNavigationList.label === 'Global Settings'?
                    <GlobalSettingsProperties/>
                :null}
                {selectedNavigationList.label === 'Color Correction'?
                    <ColorCorrectionProperties/>
                :null}
                {selectedNavigationList.label === 'Info Pinpoints'?
                    <InfoPinpointsProperties/>
                :null}
                {selectedNavigationList.label === 'Danger Zone'?
                    <DangerZoneProperties/>
                :null}
                {selectedNavigationList.label === 'Spatial Sound'?
                    <SpatialSoundProperties/>
                :null}
                {selectedNavigationList.label === 'Virtual Reality'?
                    <VirtualRealityProperties/>
                :null}
            </div>
        </div>
    );
}
 
export default PropertiesPanel;