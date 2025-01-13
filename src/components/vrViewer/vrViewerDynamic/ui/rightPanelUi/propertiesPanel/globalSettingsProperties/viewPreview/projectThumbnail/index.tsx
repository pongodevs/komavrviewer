import {useContext} from 'react'
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { VrViewerContext} from '@/components/homepage/bodyContainer/vrViewer';

const ProjectThumbnail = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {borderRadius} = useContext(VrViewerDynamicContext)
    return (  
        <>
            {selectedProject.projectThumbnail !== ''?
                <img
                    style={{
                        borderRadius:borderRadius,
                        width:`100%`,
                        height:`100%`
                    }}
                    src={selectedProject.projectThumbnail}
                />
            :
                'Please drag & drop your thumbnail here.'
            }
        </>
    );
}
 
export default ProjectThumbnail;