import { useContext } from "react";
import Pinpoint from "./pinpoint";
import { VrViewerDepthContext } from "../../../..";


const Pinpoints = () => {
    const {selectedMap,mapContainerRef} = useContext(VrViewerDepthContext)
    return (  
        <div
            ref={mapContainerRef}
            // className="bg-blue"
            style={{
                // pointerEvents:`none`,
                position:`absolute`,
                top:`0`,
                width:`100%`,
                height:`100%`
            }}
        >
            {selectedMap.pinpoints.map((pin,index)=>
                <Pinpoint
                    key={index}
                    pin={pin}
                />
            )}
        </div>
    );
}
 
export default Pinpoints;