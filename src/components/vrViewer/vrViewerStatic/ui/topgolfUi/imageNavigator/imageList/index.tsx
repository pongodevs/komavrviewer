import { useContext } from "react";
import { ViewListType } from "@/types/vrProjectType";
import { isDesktop } from "react-device-detect";
import { VrViewerStaticContext } from "@/components/vrViewer/vrViewerStatic";

const ImageList = ({view}:{view:ViewListType}) => {
    const {currentView, setCurrentView, teleport, selectedMap, setSelectedPinpoint, player} = useContext(VrViewerStaticContext)
    return (  
        <div
            onClick={()=>{
                if(!player.isTeleport){
                    const toPin = selectedMap.pinpoints.find(pin=>{return pin.toViewId === view._id})
                    if(toPin){
                        setSelectedPinpoint(toPin)
                    }
                    teleport(view)
                }
            }}
            className="no-select"
            style={{
                fontSize:isDesktop?`1.4rem`:`1rem`,
                fontWeight:`700`,
                background:currentView._id == view._id?`rgba(63,146,209,0.9)`:`rgba(12,19,25,0.9)`,
                borderRadius:`4px`,
                height:`1rem`,
                padding:isDesktop?`1.5rem 4rem`:`1.5rem 2rem`,
                cursor:`pointer`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`
            }}
        >
            {view.labelName}
        </div>
    );
}
 
export default ImageList;