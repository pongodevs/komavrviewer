import { BsMap, BsSun } from "react-icons/bs";
import {useContext} from 'react';
import { CustomPinpointType, customPinpointObject, mapObject, sceneObject } from "@/types/vrProjectType";
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import EnumList from "@/components/homepage/bodyContainer/vrViewer/common/enumList";
import DropdownPanel from "@/components/homepage/bodyContainer/vrViewer/common/dropdownPanel";
import Property from "@/components/homepage/bodyContainer/vrViewer/common/property";

const MapProperties = () => {
    const {setSelectedMap, selectedMap} = useContext(VrViewerStaticContext)
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    return (  
        <>
            <EnumList
                enumList={selectedProject.maps}
                labelKey='mapName'
                defaultObject={mapObject}
                icon={<BsMap size={15}/>}
                setSelected={setSelectedMap}
                selected={selectedMap}
                defaultName='Map'
            />
            {selectedMap._id !== ''?
                <div
                    style={{
                        marginTop:`3rem`
                    }}
                >
                    <DropdownPanel
                        label={'Preview'}
                    >
                        {/* Pin */}
                        {selectedMap?
                            <>
                                <Property
                                    label='Show View Finder?'
                                    type='boolean'
                                    selected={selectedMap}
                                    labelKey={'showViewfinder'}
                                />
                                <Property
                                    label='Size Percentage'
                                    type='integer'
                                    selected={selectedMap}
                                    labelKey={'sizePercentage'}
                                    max={200}
                                    min={0}
                                />
                            </>
                        :null}
                    </DropdownPanel>
                </div>
            :null}
        </>
    );
}
 
export default MapProperties;