import { useContext } from "react";
import Pinpoint from "./pinpoint";
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';


const Pinpoints = () => {
    const {selectedMap,mapContainerRef} = useContext(VrViewerStaticContext)
    return (  
        <div
            ref={mapContainerRef}
            style={{
                position:`absolute`,
                top:`0`,
                width:`100%`,
                height:`100%`,
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