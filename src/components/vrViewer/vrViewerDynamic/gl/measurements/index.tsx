import { useContext } from "react";
import Measurement from "./measurement";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import {  PointsType } from "@/types/vrProjectType";

const Measurements = () => {
    const {measurementArray} = useContext(VrViewerDynamicContext)
    return (  
        <>
            {measurementArray?.map((measurement:PointsType, index:number)=>
                <Measurement
                    key={index}
                    measurement={measurement}
                />
            )}
        </>
    );
}
 
export default Measurements;