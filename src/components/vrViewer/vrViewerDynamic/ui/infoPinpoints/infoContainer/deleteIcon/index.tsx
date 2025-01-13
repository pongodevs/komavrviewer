import { useContext } from "react";
import { InfoContainerContext } from "..";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { InfoPinpointType, PinpointType } from "@/types/vrProjectType";

const DeleteIcon = () => {
    const {selectedProject, setSelectedProject, isDollHouseMode} = useContext(VrViewerDynamicContext)
    const {pin} = useContext(InfoContainerContext)
    return (  
        <div
            className="text-red"
            style={{
                position:`absolute`,
                fontSize:isDollHouseMode?`1rem`:`2rem`,
                fontWeight:`700`,
                transform:isDollHouseMode?`translate(1rem,-1rem)`:`translate(2rem,-2rem)`
            }}
            onClick={()=>{
                console.log(selectedProject.infoPinpoints.pinpoints)
                console.log(selectedProject.infoPinpoints.pinpoints.filter((p:InfoPinpointType)=>{return p._id !== pin._id}))
                selectedProject.infoPinpoints.pinpoints = selectedProject.infoPinpoints.pinpoints.filter((p:InfoPinpointType)=>{return p._id !== pin._id})
                setSelectedProject(prev=>{return {...prev}})
            }}
        >
            X
        </div>
    );
}
 
export default DeleteIcon;