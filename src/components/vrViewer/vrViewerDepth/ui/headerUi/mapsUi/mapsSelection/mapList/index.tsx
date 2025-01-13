import { MapType } from "@/types/vrProjectType";
import {useContext} from 'react';
import { MapsSelectionContext } from "..";
import { VrViewerDepthContext } from "../../../../..";

const MapList = ({map}:{map:MapType}) => {
    const {selectedMap, setSelectedMap} = useContext(VrViewerDepthContext)
    const {isShowList,setIsShowList} = useContext(MapsSelectionContext)
    return (  
        <div
            className="text-white bg-dark-grey"
            style={{
                padding:`0.5rem 1rem`,
                margin:`0.5rem`,
                cursor:`pointer`,
                fontSize:`1rem`,
                fontWeight:`500`,
                borderRadius:`4px`
            }}
            onClick={()=>{
                setSelectedMap(map)
                setIsShowList(false)
            }}

        >
            {map.mapName}
        </div>
    );
}
 
export default MapList;