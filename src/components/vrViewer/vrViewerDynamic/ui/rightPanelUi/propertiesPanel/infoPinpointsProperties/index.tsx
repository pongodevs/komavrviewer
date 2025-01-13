import _ from "lodash";
import { useContext, useRef, useState } from "react";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import DropItem from "../../../../../common/dropItem";

const InfoPinpointsProperties = () => {
    const {setIsDragInfoPinpoint} = useContext(VrViewerDynamicContext)
    return (  
        <>
            <DropItem
                image={
                    <BsFillInfoCircleFill
                        size={50}
                        style={{
                            opacity:`100%`,
                            textShadow:`0px 0px 20px black`
                        }}
                    />
                }
                onMouseDown={()=>{
                    setIsDragInfoPinpoint(true)
                }}
                onMouseUp={(e:any)=>{
                    setIsDragInfoPinpoint(false)
                }}
            />
        </>
    );
}
 
export default InfoPinpointsProperties;