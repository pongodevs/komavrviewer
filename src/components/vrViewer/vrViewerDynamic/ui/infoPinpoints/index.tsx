import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import InfoContainer from "./infoContainer";
import { InfoPinpointType, PinpointType, infoPinpointObject, pinpointObject } from "@/types/vrProjectType";

type InfoPinpointsContextType = {
    editedInfoPinpoint:InfoPinpointType, 
    setEditedInfoPinpoint:Dispatch<SetStateAction<InfoPinpointType>>
}
export const InfoPinpointsContext = createContext<InfoPinpointsContextType>({} as InfoPinpointsContextType)
const InfoPinpoints = () => {
    const {selectedProject} = useContext(VrViewerDynamicContext)
    const [editedInfoPinpoint, setEditedInfoPinpoint] = useState(infoPinpointObject)
    return (  
        <InfoPinpointsContext.Provider
            value={{
                editedInfoPinpoint, 
                setEditedInfoPinpoint
            }}
        >
            {selectedProject.infoPinpoints.pinpoints.map((pin,index)=>
                <InfoContainer
                    key={index}
                    pin={pin}
                />
            )}
        </InfoPinpointsContext.Provider>
    );
}
 
export default InfoPinpoints;