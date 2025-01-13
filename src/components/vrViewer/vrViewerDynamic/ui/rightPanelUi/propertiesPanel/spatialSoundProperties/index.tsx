import { spatialAudioObject } from "@/types/vrProjectType";
import { useContext, useEffect, useState } from "react";
import { BsSoundwave } from "react-icons/bs";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { VrViewerContext} from '@/components/homepage/bodyContainer/vrViewer';
import DropItem from "../../../../../common/dropItem";
import EnumList from "../../../../../common/enumList";
import DropdownPanel from "../../../../../common/dropdownPanel";
import Property from "../../../../../common/property";
import { v4 } from "uuid";
import _ from 'lodash';
import { AmbientSoundType, ambientSoundObject } from "@/types/ambientSoundType";

const ambientSounds:AmbientSoundType[] = [
    {
        _id:v4(),
        name:'Forest 1',
        source:'/sounds/ambient/forest1.mp3'
    },
    {
        _id:v4(),
        name:'Forest 2',
        source:'/sounds/ambient/forest2.mp3'
    },
    {
        _id:v4(),
        name:'Forest Rain 1',
        source:'/sounds/ambient/forestRain1.mp3'
    },
    {
        _id:v4(),
        name:'Bird Ambience 1',
        source:'/sounds/ambient/birdAmbience1.mp3'
    },
    {
        _id:v4(),
        name:'Beach 1',
        source:'/sounds/ambient/beach1.mp3'
    },
    {
        _id:v4(),
        name:'Stream Flow 1',
        source:'/sounds/ambient/streamFlow1.mp3'
    },
]

const SpatialSoundProperties = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {
        selectedSpatialAudio, setSelectedSpatialAudio, isDragSpatialAudio, setIsDragSpatialAudio, 
        selectedAmbientSound, setSelectedAmbientSound
    } = useContext(VrViewerDynamicContext)

    useEffect(()=>{
        selectedSpatialAudio.source = selectedAmbientSound.source
    },[selectedAmbientSound])

    useEffect(()=>{
        const findAmbient = ambientSounds.find(a=>{return a.source === selectedSpatialAudio.source})
        setSelectedAmbientSound(findAmbient || ambientSoundObject)
    },[selectedSpatialAudio])
    return (  
        <>
            <DropItem
                    image={
                        <BsSoundwave
                            size={50}
                            style={{
                                opacity:`100%`,
                                textShadow:`0px 0px 20px black`
                            }}
                        />
                    }
                    onMouseDown={()=>{
                        setIsDragSpatialAudio(true)
                    }}
                    onMouseUp={()=>{
                        setIsDragSpatialAudio(false)
                    }}
                    onDrop={()=>{
                        
                    }}
            /> 
            <EnumList
                enumList={selectedProject.spatialAudio.audios}
                labelKey='audioName'
                defaultObject={spatialAudioObject}
                icon={<BsSoundwave size={15}/>}
                setSelected={setSelectedSpatialAudio}
                selected={selectedSpatialAudio}
                defaultName='Spatial Audio'
                disablePlus
                // disableMinus
            />
            <EnumList
                enumList={ambientSounds}
                labelKey='name'
                defaultObject={ambientSoundObject}
                icon={<BsSoundwave size={15}/>}
                setSelected={setSelectedAmbientSound}
                selected={selectedAmbientSound}
                defaultName='Ambient Audio'
                disableAll
                
            />
            <DropdownPanel
                label="Selected Audio"
            >
                <Property
                    label="X Position"
                    selected={selectedSpatialAudio.position}
                    labelKey="x"
                    type="integer"
                    precision={0.01}
                    min={-9999}
                    max={9999}
                />
                <Property
                    label="Y Position"
                    selected={selectedSpatialAudio.position}
                    labelKey="z"
                    type="integer"
                    precision={0.01}
                    min={-9999}
                    max={9999}
                />
                <Property
                    label="Z Position"
                    selected={selectedSpatialAudio.position}
                    labelKey="y"
                    type="integer"
                    precision={0.01}
                    min={-9999}
                    max={9999}
                />
                <Property
                    label="Ref Distance"
                    selected={selectedSpatialAudio}
                    labelKey="refDistance"
                    type="integer"
                    precision={0.01}
                    min={0.1}
                    max={9999}

                />
                <Property
                    label="Max Distance"
                    selected={selectedSpatialAudio}
                    labelKey="maxDistance"
                    type="integer"
                    precision={0.01}
                    min={0.1}
                    max={9999}
                />
                <Property
                    label="Volume"
                    selected={selectedSpatialAudio}
                    labelKey="volume"
                    type="integer"
                    precision={0.01}
                    min={0}
                    max={1}
                />

            </DropdownPanel>
        </>
    );
}
 
export default SpatialSoundProperties;