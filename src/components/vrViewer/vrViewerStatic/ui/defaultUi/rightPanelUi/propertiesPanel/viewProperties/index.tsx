
import {useContext} from 'react';
import ViewPreview from "./viewPreview";
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';
import Property from '@/components/homepage/bodyContainer/vrViewer/common/property';
import DropdownPanel from '@/components/homepage/bodyContainer/vrViewer/common/dropdownPanel';

const ViewProperties = () => {
    const {currentView, nextView} = useContext(VrViewerStaticContext)
    return (  
        <>
            <DropdownPanel
                label="View Settings"
            >
                <ViewPreview/>
                <Property
                    label='Rotation'
                    type='integer'
                    selected={nextView}
                    labelKey={'rotation'}
                    max={360}
                    min={-360}
                    precision={0.1}
                    isGlobal
                />
                <Property
                    label='FOV'
                    type='integer'
                    selected={currentView}
                    labelKey={'fov'}
                    max={125}
                    min={50}
                    isGlobal
                />
            </DropdownPanel>
        </>
    );
}
 
export default ViewProperties;