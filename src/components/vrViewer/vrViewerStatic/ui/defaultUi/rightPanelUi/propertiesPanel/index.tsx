import {useContext} from 'react';
import { RightPanelUiContext } from '..';
import SceneManagerProperties from './sceneManagerProperties';
import CustomPinProperties from './customPinProperties';
import MapProperties from './mapProperties';
import GlobalSettingsProperties from './globalSettingsProperties';
import ViewProperties from './viewProperties';
import SettingProperties from './settingProperties';
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
                {selectedNavigationList.label === 'Scene Manager'?
                    <SceneManagerProperties/>
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
                {selectedNavigationList.label === 'Setting Properties'?
                    <SettingProperties/>
                :null}
            </div>
        </div>
    );
}
 
export default PropertiesPanel;