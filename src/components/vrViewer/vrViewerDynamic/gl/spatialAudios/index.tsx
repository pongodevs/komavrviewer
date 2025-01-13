import SpatialAudio from "./spatialAudio";
import { useContext } from "react";
import { VrViewerContext} from '@/components/homepage/bodyContainer/vrViewer';


const SpatialAudios = () => {
    const {selectedProject} = useContext(VrViewerContext)
    return (  
        <>
            {selectedProject?.spatialAudio?.audios.map((spatialAudio,index)=>
                <SpatialAudio
                    key={index}
                    spatialAudio={spatialAudio}
                />
            )}
        </>
    );
}
 
export default SpatialAudios;