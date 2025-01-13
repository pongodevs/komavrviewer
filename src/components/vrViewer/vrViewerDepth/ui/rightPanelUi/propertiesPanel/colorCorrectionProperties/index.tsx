
import {useContext} from 'react';
import DropdownPanel from "../../../../../common/dropdownPanel";
import Property from '../../../../../common/property';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';


const ColorCorrectionProperties = () => {
    const {selectedProject} = useContext(VrViewerContext)
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