import { MapType } from "@/types/vrProjectType";
import { useContext } from "react";
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';
import { TopgolfUiContext } from "../..";

const NavList = ({map}:{map:MapType}) => {
    const {setSelectedMap, selectedMap, selectedScene, teleport, setSelectedPinpoint} = useContext(VrViewerStaticContext)
    const {selectedBlueColor, unselectedDarkBlueColor} = useContext(TopgolfUiContext)
    return (  
        <div
            onClick={()=>{
                const filteredViewList = selectedScene.viewList.filter(view=>{return view.mapId === map._id})
                const toView = filteredViewList[0]
                const toPin = map.pinpoints.find(pin=>{return pin.toViewId === toView._id})
                if(toView){
                    teleport(filteredViewList[0])
                }
                if(toPin){
                    setSelectedPinpoint(toPin)
                }
                setSelectedMap(map)
                

            }}
            style={{
                background:selectedMap._id == map._id?selectedBlueColor:unselectedDarkBlueColor,
                borderRadius:`4px`,
                height:`100%`,
                padding:`0rem 2rem`,
                cursor:`pointer`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`
            }}
        >
            {map.mapName}
        </div>
    );
}
 
export default NavList;