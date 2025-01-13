import {useContext} from 'react';
import { CustomPinpointType, customPinpointObject, sceneObject } from "@/types/vrProjectType";
import { MdLocationPin } from "react-icons/md";
import PinPreview from "./pinPreview";
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import DropdownPanel from '@/components/homepage/bodyContainer/vrViewer/common/dropdownPanel';
import Property from '@/components/homepage/bodyContainer/vrViewer/common/property';
import EnumList from '@/components/homepage/bodyContainer/vrViewer/common/enumList';

const CustomPinProperties = () => {
    const {selectedCustomPinpoint, setSelectedCustomPinpoint} = useContext(VrViewerStaticContext)
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    return (  
        <>
            <EnumList
                enumList={selectedProject.customPinpoints}
                labelKey='label'
                defaultObject={customPinpointObject}
                icon={<MdLocationPin size={15}/>}
                setSelected={setSelectedCustomPinpoint}
                selected={selectedCustomPinpoint}
                defaultName='Pin'
            />
            {selectedCustomPinpoint._id !== ''?
                <div
                    style={{
                        marginTop:`3rem`
                    }}
                >
                    <DropdownPanel
                        label="Preview"
                    >
                        <PinPreview/>
                        {/* Pin */}
                        {selectedCustomPinpoint?
                            <>
                                {/* <Property
                                    label='Is 3D'
                                    type='boolean'
                                    selected={selectedCustomPinpoint}
                                    labelKey={'is3d'}
                                /> */}
                                <div
                                    style={{
                                        margin:`1rem 0rem`
                                    }}
                                >
                                    Pin Related:
                                </div>
                                <Property
                                    label='Size Percentage'
                                    type='integer'
                                    selected={selectedCustomPinpoint}
                                    labelKey={'sizePercentage'}
                                    max={100}
                                    min={1}
                                />
                                <Property
                                    label='Opacity'
                                    type='integer'
                                    selected={selectedCustomPinpoint}
                                    labelKey={'opacity'}
                                    max={100}
                                    min={0}
                                />
                                
                                <Property
                                    label='Font Scale'
                                    type='integer'
                                    selected={selectedCustomPinpoint}
                                    labelKey={'fontScale'}
                                    max={200}
                                    min={20}
                                />
                                <div
                                    style={{
                                        margin:`1rem 0rem`
                                    }}
                                >
                                    Thumbnail Related:
                                </div>
                                <Property
                                    label='Show Thumbnail'
                                    type='boolean'
                                    selected={selectedCustomPinpoint}
                                    labelKey={'showThumbnail'}
                                />
                                
                                <Property
                                    label='Size'
                                    type='integer'
                                    selected={selectedCustomPinpoint}
                                    labelKey={'thumbnailSize'}
                                    max={100}
                                    min={1}
                                />
                                <Property
                                    label='Y Pos'
                                    type='integer'
                                    selected={selectedCustomPinpoint}
                                    labelKey={'thumbnailYPosition'}
                                    max={20}
                                    min={0.1}
                                    precision={0.1}
                                />
                                <Property
                                    label='Type'
                                    type='enumerator'
                                    selected={selectedCustomPinpoint}
                                    labelKey={'type'}
                                    enumerator={['view','info']}
                                />
                            </>
                        :null}
                    </DropdownPanel>
                </div>
            :null}
        </>
    );
}
 
export default CustomPinProperties;