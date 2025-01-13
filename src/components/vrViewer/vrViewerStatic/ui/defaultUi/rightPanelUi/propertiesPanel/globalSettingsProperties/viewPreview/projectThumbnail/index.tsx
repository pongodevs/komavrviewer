import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import {useContext} from 'react'
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';

const ProjectThumbnail = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {borderRadius} = useContext(VrViewerStaticContext)
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