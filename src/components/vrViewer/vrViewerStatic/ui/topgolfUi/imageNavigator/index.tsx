import { useContext } from "react";
import ImageList from "./imageList";
import { TopgolfUiContext } from "..";
import { isDesktop } from "react-device-detect";
import { VrViewerStaticContext } from "../../..";

const ImageNavigator = () => {
    const {selectedMap, selectedScene} = useContext(VrViewerStaticContext)
    const filteredViewList = selectedScene.viewList.filter(view=>{
        return view.mapId == selectedMap._id
    })
    const {lightBlueColor} = useContext(TopgolfUiContext)
    return (  
        <div
            className="text-white"
            style={{
                width:`100%`,
                display:`flex`,
                flexWrap:`wrap`,
                justifyContent:`center`,
                alignItems:`center`,
                gap:isDesktop?`1rem`:`0.5rem`,
            }}
        >
            {filteredViewList.map((view,index)=>
                <ImageList
                    key={index}
                    view={view}
                />
            )}
        </div>
    );
}
 
export default ImageNavigator;