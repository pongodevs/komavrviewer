import {useContext} from 'react';
import { RightPanelUiContext } from '..';
import GlobalSettingsProperties from './globalSettingsProperties';
import ColorCorrectionProperties from './colorCorrectionProperties';
import DangerZoneProperties from './dangerZoneProperties';
import CustomPinProperties from './customPinProperties';
import MapProperties from './mapProperties';
import ViewProperties from './viewProperties';
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
                {selectedNavigationList.label === 'Pinpoint Manager'?
                    <CustomPinProperties/>
                :null}
                {selectedNavigationList.label === 'Map Manager'?
                    <MapProperties/>
                :null}
                {selectedNavigationList.label === 'View Properties'?
                    <ViewProperties/>
                :null}

                {selectedNavigationList.label === 'Danger Zone'?
                    <DangerZoneProperties/>
                :null}
            </div>
        </div>
    );
}
 
export default PropertiesPanel;