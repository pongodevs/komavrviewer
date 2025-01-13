import { useContext } from "react";
import MapsUi from "./mapsUi";
import ChangeScene from "./changeScene";
import _ from "lodash";
import { VrViewerStaticContext } from "../../..";
import { VrViewerContext } from "../../../..";

const HeaderUi = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {selectedMap, selectedScene, isEditorMode, mapRef} = useContext(VrViewerStaticContext)
    const imageUrlArray = selectedScene.viewList.map(view=>{return view.imageUrl})
    const imageUrlIsEmpty = _.includes(imageUrlArray, '')

    return (  
        <div>
            <MapsUi/>
            {selectedProject.scenes.length > 1 && !imageUrlIsEmpty?
                <ChangeScene/>
            :null}
        </div>
        
    );
}
 
export default HeaderUi;