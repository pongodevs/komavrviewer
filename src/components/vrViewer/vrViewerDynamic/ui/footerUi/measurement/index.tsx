import { useRef , useContext , useEffect} from "react";
import { BiRuler } from "react-icons/bi";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { pointsObject } from "@/types/vrProjectType";
import { v4 } from "uuid";

const Measurement = () => {
    const iconRef = useRef<HTMLDivElement>(null)
    const {isMeasureMode, setIsMeasureMode, 
        measurementArray, setMeasurementArray, 
        measurementState, setMeasurementState,
        setSelectedMeasurement
    } = useContext(VrViewerDynamicContext)
    return (  
        <div 
            ref={iconRef}
            className='text-white no-select'
            style={{
                padding:`0.5rem`,
                cursor:`pointer`,
                zIndex:`50`,
                fontSize:`3rem`,
                opacity:measurementArray.length > 0? `50%`: `100%`,
                transition:`all 0.5s`
            }}
            onClick={()=>{
                if(measurementArray.length > 0){
                    setMeasurementArray([])
                }
                else{
                    setIsMeasureMode(true)
                    const newPoint = {...pointsObject}
                    newPoint._id = v4()
                    newPoint.point1.x = 0
                    newPoint.point1.y = 0
                    newPoint.point1.z = 0
    
                    newPoint.point2.x = 0
                    newPoint.point2.y = 0
                    newPoint.point2.z = 0
                    setSelectedMeasurement(newPoint)
                    // setMeasurementArray(prev=>{return [...prev, newPoint]})
                    setMeasurementArray([newPoint])
                    setMeasurementState(prev=>{return {...prev,
                        phase: 1,
                        indexSelection: 0
                    }})
                }
            }}
            onMouseEnter={()=>{
                if(iconRef.current){
                    iconRef.current.style.transition=`all 0.15s ease-out`
                    iconRef.current.style.transform=`scale(1.2)`
                }
            }}
            onMouseLeave={()=>{
                if(iconRef.current){
                    iconRef.current.style.transform=`scale(1.0)`
                }
            }}
        >
            <BiRuler/>
        </div>
    );
}
 
export default Measurement;