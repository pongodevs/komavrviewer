import { Interactive } from "@react-three/xr";
import Content from "./content";
import Overlay from "./overlay";
import { useContext } from "react";
import { InfoPinpointContext } from "..";


const Info = () => {
    const {setIsRenderInfo} = useContext(InfoPinpointContext)
    return (  
        <Interactive
            onBlur={()=>{
                setIsRenderInfo(false)
            }}
        >
            <group  
            
                scale={[
                    0.125,
                    0.125,
                    1
                ]}
            >
                <Content/>
                <Overlay/>
            </group>
        </Interactive>
    );
}
 
export default Info;