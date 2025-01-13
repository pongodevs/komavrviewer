import { useContext, useRef } from "react";
import Pinpoints from "./pinpoints";
import PlayerUi from "./playerUi";
import { TopgolfUiContext } from "..";
import { VrViewerStaticContext } from "../../..";

const MapImage = ({backgroundColor}:{backgroundColor?:string}) => {
    const {selectedMap} = useContext(VrViewerStaticContext)
    const {mapRef, lightBlueColor} = useContext(TopgolfUiContext)
    return (  
        <div
            style={{
                width:`100%`,
                height:`100%`,
                position:`relative`,
            }}
        >
            <div
                style={{
                    position:`absolute`,
                    overflow:`hidden`,
                    width:`100%`,
                    height:`100%`,
                }}
            >
                <div
                    ref={mapRef}
                    style={{
                        backgroundColor:backgroundColor,
                        width:`100%`,
                        height:`100%`,
                        zIndex:`1`,
                        transition:`transform 1s`,
                    }}
                >
                    <Pinpoints/>
                    <PlayerUi/>
                    <img
                        src={`./project/maps/${selectedMap.mapName}.png`}
                        style={{
                            width:`100%`,
                            height:`100%`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
 
export default MapImage;