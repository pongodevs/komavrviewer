import { useContext } from "react";
import { VrViewerContext } from "../../../..";
import useMainUrl from "@/hooks/mainUrl";

const ProjectLogo = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {mainUrl} = useMainUrl()
    return (  
        <div
            style={{
                position:`relative`,
                width:`calc(${selectedProject.globalSettings.logo.sizePercentage/100} * 20rem)`,
                minHeight:`calc(${selectedProject.globalSettings.logo.sizePercentage/100} * 10rem)`,
            }}
        >
            {selectedProject.globalSettings.logo.logoUrl !== '' && selectedProject.globalSettings.logo.showLogo?
                <img
                    className='no-select'
                    src={`${mainUrl}/thumbnails/thumbnail.png`}
                    style={{
                        cursor:`pointer`,
                        width:`100%`,
                        zIndex:`1`
                    }}
                />
            :null}
        </div>
    );
}
 
export default ProjectLogo;