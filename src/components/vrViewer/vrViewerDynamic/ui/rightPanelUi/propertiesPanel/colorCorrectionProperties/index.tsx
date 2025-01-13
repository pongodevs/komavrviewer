
import {useContext} from 'react';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import DropdownPanel from "../../../../../common/dropdownPanel";
import Property from '../../../../../common/property';


const ColorCorrectionProperties = () => {
    const {selectedProject} = useContext(VrViewerDynamicContext)
    return (  
        <>
            <DropdownPanel
                label="Color Correction"
            >
                <Property
                    label='Enable?'
                    type='boolean'
                    selected={selectedProject.globalSettings.colorCorrection}
                    labelKey={'enable'}
                />
                <Property
                    label='Contrast'
                    type='integer'
                    selected={selectedProject.globalSettings.colorCorrection}
                    labelKey={'contrast'}
                    max={200}
                    min={0}
                />
                <Property
                    label='Saturation'
                    type='integer'
                    selected={selectedProject.globalSettings.colorCorrection}
                    labelKey={'saturation'}
                    max={200}
                    min={0}
                />
                <Property
                    label='Brightness'
                    type='integer'
                    selected={selectedProject.globalSettings.colorCorrection}
                    labelKey={'brightness'}
                    max={200}
                    min={0}
                />
                
            </DropdownPanel>
        </>
    );
}
 
export default ColorCorrectionProperties;