import {useContext} from 'react'
import { VrViewerContext} from '@/components/homepage/bodyContainer/vrViewer';
import { VrViewerDepthContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDepth';

const ProjectThumbnail = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {borderRadius} = useContext(VrViewerDepthContext)
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