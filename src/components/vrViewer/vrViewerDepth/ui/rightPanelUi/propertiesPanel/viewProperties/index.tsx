
import {useContext} from 'react';
import Property from '@/components/homepage/bodyContainer/vrViewer/common/property';
import DropdownPanel from '@/components/homepage/bodyContainer/vrViewer/common/dropdownPanel';
import { VrViewerDepthContext } from '../../../..';
import ViewPreview from './viewPreview';
import DepthPreview from './depthPreview';

const ViewProperties = () => {
    const {currentView, nextView} = useContext(VrViewerDepthContext)
    return (  
        <>
            <DropdownPanel
                label="View"
            >
                <ViewPreview/>
            </DropdownPanel>
            <DropdownPanel
                label="Depth"
            >
                <DepthPreview/>
            </DropdownPanel>
        </>
    );
}
 
export default ViewProperties;