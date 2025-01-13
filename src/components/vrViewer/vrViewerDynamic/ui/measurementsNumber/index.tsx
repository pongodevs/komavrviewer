import MeasurementNumber from './measurementNumber';
import { useContext } from 'react';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { MeasurementType, PointsType } from '@/types/vrProjectType';

const MeasurementsNumbers = () => {
    const {measurementArray} = useContext(VrViewerDynamicContext)
    return (  
        <>
            {measurementArray.map((measurement:PointsType, index:number)=>
                <MeasurementNumber
                    key={index}
                    measurement={measurement}
                />
            )}
        </>
    );
}
 
export default MeasurementsNumbers;