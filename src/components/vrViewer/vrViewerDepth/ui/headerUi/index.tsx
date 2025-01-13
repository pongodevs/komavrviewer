import { useContext } from "react";
import MapsUi from "./mapsUi";
import _ from "lodash";
import { VrViewerDepthContext } from "../..";
import { VrViewerContext } from "../../..";
import ChangeScene from "./changeScene";

const HeaderUi = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {selectedMap, selectedScene, isEditorMode, mapRef} = useContext(VrViewerDepthContext)

    return (  
        <div>
            {(selectedMap._id !== "" && isEditorMode) || (!isEditorMode && selectedProject.maps.length > 0)?
                <MapsUi/>
            :null}
            {selectedProject.scenes.length > 1?
                <ChangeScene/>
            :null}
        </div>
        
    );
}
 
export default HeaderUi;