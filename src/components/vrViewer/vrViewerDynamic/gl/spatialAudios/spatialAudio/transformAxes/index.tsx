import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { SpatialAudioContext } from '..';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import Axis from './axis';

type TransformAxesContextType = {
    hoveredMovement:string, 
    setHoveredMovement:Dispatch<SetStateAction<string>>,
    axesSize:number, 
    axesHeight:number, 
    division:number
}
export const TransformAxesContext = createContext<TransformAxesContextType>({} as TransformAxesContextType)



const TransformAxes = ({axesSize, axesHeight, division}:{axesSize:number, axesHeight:number, division:number}) => {
    const {spatialAudio} = useContext(SpatialAudioContext)
    const {setSelectedProject, setSelectedSpatialAudio, setEnableOrbitControl, cameraRig} = useContext(VrViewerDynamicContext)
    
    const [hoveredMovement, setHoveredMovement] = useState('')


    return (  
        <TransformAxesContext.Provider
            value={{
                hoveredMovement, setHoveredMovement,
                axesSize, axesHeight, division
            }}
        >
            <group
                onPointerDown={()=>{
                    setSelectedSpatialAudio(spatialAudio)
                    setEnableOrbitControl(false)
                }}
                onPointerUp={()=>{
                    setEnableOrbitControl(true)
                }}
                // position={[-cameraRig.position.x, -cameraRig.position.y, -cameraRig.position.z]}
            >
                {/* Z Axis */}
                <Axis
                    axis='x'
                />
                <Axis
                    axis='y'
                />
                <Axis
                    axis='z'
                />
            </group>
        </TransformAxesContext.Provider>
    );
}
 
export default TransformAxes;