import { createContext, useContext, useRef, Dispatch, SetStateAction, useEffect } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/router';
import Pinpoints from './pinpoints';
import PlayerUi from './playerUi';
import Toggle from './toggle';
import {useState} from 'react';
import MapsSelection from './mapsSelection';
import { BsPlusCircleDotted } from 'react-icons/bs';
import UseMap from './useMap';
import { VrViewerStaticContext } from '@/components/vrViewer/vrViewerStatic';
import { VrViewerContext } from '@/components/vrViewer';

type MapsUiContextType = {
    isShowMap:boolean, 
    setIsShowMap:Dispatch<SetStateAction<boolean>>
}
export const MapsUiContext = createContext<MapsUiContextType>({} as MapsUiContextType)
const Maps = () => {
    const router = useRouter()
    const {selectedMap, setSelectedMap, isEditorMode, 
        mapContainerRef, selectedPinpoint, borderRadius
    } = useContext(VrViewerStaticContext)
    
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    const [isShowMap, setIsShowMap] = useState(false)
    
    const [showPlayerUi, setShowPlayerUi] = useState(false)

    const mapRef = useRef<HTMLDivElement>(null)
    const getWidth = ()=>{
        if(mapContainerRef.current){
            const width = `${(selectedProject.globalSettings.map.widthPercentage/100) * (selectedMap.sizePercentage/100) * 35}rem`
            const finalWidth = Math.round(Number(width.replace('rem','')) * 10)
            const containerWidth = mapContainerRef.current.getBoundingClientRect().x
            if(finalWidth > containerWidth){
                return containerWidth
            }
            else{
                return finalWidth
            }
        }
    }
    getWidth()
    const width = `${(selectedProject.globalSettings.map.widthPercentage/100) * (selectedMap.sizePercentage/100) * 35}rem`

    // If selected map no reference, don't render player ui
    useEffect(()=>{
        const findPin = selectedMap.pinpoints.find(pin=>pin._id === selectedPinpoint._id)
        if(findPin){
            setShowPlayerUi(true)
        }
        else{
            setShowPlayerUi(false)
        }
    },[selectedMap])

    useEffect(()=>{
        setShowPlayerUi(true)
    },[selectedPinpoint])
    return (  
        <MapsUiContext.Provider
            value={{
                isShowMap, setIsShowMap
            }}
        >
            <div
                ref={mapRef}
                className={selectedMap.imageUrl === ''?"bg-darker-grey no-select":`no-select`}
                style={{
                    height:selectedMap.imageUrl === ''?`${width}`:``,
                    width:isShowMap || isEditorMode?`${getWidth()}px`:`0rem`,
                    position:`fixed`,
                    top:`6rem`,
                    right:isEditorMode?`calc(20% + 2rem)`:`2rem`,
                    zIndex:`3`,
                    overflow:isShowMap?`initial`:`hidden`,
                    transition:`all 0.2s ease-out`,
                }}
            >
                {selectedMap.imageUrl !== ''?
                    <img
                        className='no-select'
                        src={selectedMap.imageUrl}
                        style={{
                            pointerEvents:`none`,
                            width:`100%`,
                            borderRadius
                        }}
                    />
                :null}
                
                {selectedPinpoint._id !== '' && showPlayerUi?
                    <PlayerUi/>
                :null}

                <Pinpoints/>

                {isEditorMode && selectedMap.imageUrl !== ''?
                    <UseMap/>
                :null}
       
                <MapsSelection/>
            </div>
            {selectedProject.maps.length > 0 && !isEditorMode?
                <Toggle/>
            :null}
        </MapsUiContext.Provider>
    );
}
 
export default Maps;