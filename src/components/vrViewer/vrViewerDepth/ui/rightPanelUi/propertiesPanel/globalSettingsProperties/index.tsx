import { useContext } from "react";
import Music from "./music";
import ViewPreview from "./viewPreview";
import DropdownPanel from "../../../../../common/dropdownPanel";
import Property from "../../../../../common/property";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";

const GlobalSettingsProperties = () => {
    const {selectedProject} = useContext(VrViewerContext)
    return (  
        <>
            <DropdownPanel
                label="Project Thumbnail"
            >
                <ViewPreview/>
            </DropdownPanel>
            <DropdownPanel
                label="Publish Settings"
            >
                <Property
                    label='Is Published'
                    type='boolean'
                    selected={selectedProject}
                    labelKey={'isPublished'}
                />
            </DropdownPanel>
            <DropdownPanel
                label="Autoplay"
            >
                <Property
                    label='Enable?'
                    type='boolean'
                    selected={selectedProject.globalSettings.autoplay}
                    labelKey={'isPlay'}
                />
                <Property
                    label='Flip Flop'
                    type='boolean'
                    selected={selectedProject.globalSettings.autoplay}
                    labelKey={'flipFlop'}
                />
                <Property
                    label='Speed'
                    type='integer'
                    selected={selectedProject.globalSettings.autoplay}
                    labelKey={'speed'}
                    max={100}
                    min={20}
                />
                <Property
                    label='Timeout'
                    type='integer'
                    selected={selectedProject.globalSettings.autoplay}
                    labelKey={'timeout'}
                    max={10}
                    min={1}
                />
            </DropdownPanel>
            <DropdownPanel
                label="Camera"
            >
                <Property
                    label='Enable zoom'
                    type='boolean'
                    selected={selectedProject.globalSettings.camera}
                    labelKey={'enableZoom'}
                />
                
            </DropdownPanel>
            <DropdownPanel
                label="Instruction"
            >
                <Property
                    label='Show instruction on start?'
                    type='boolean'
                    selected={selectedProject.globalSettings.instruction}
                    labelKey={'showInstruction'}
                />
                
            </DropdownPanel>
            <DropdownPanel
                label="Loading"
            >
                <Property
                    label='Autoload when possible?'
                    type='boolean'
                    selected={selectedProject.globalSettings.loading}
                    labelKey={'autoLoad'}
                />
                
            </DropdownPanel>
            <DropdownPanel
                label="Music"
            >
                <Property
                    label='Enable?'
                    type='boolean'
                    selected={selectedProject.globalSettings.music}
                    labelKey={'enable'}
                />
                <Music/>
                <Property
                    label='Volume'
                    type='integer'
                    selected={selectedProject.globalSettings.music}
                    labelKey={'volume'}
                    max={100}
                    min={0}
                />
            </DropdownPanel>
            <DropdownPanel
                label="Logo"
            >
                <Property
                    label='Show Logo'
                    type='boolean'
                    selected={selectedProject.globalSettings.logo}
                    labelKey={'showLogo'}
                />
                <Property
                    label='Size Percentage'
                    type='integer'
                    selected={selectedProject.globalSettings.logo}
                    labelKey={'sizePercentage'}
                    max={100}
                    min={20}
                />
            </DropdownPanel>
            <DropdownPanel
                label="Teleportation"
            >
                <Property
                    label='Style'
                    type='enumerator'
                    selected={selectedProject.globalSettings.transition}
                    labelKey={'style'}
                    enumerator={['parallax','fade']}
                />
                <Property
                    label='Duration '
                    type='integer'
                    selected={selectedProject.globalSettings.transition}
                    labelKey={'duration'}
                    precision={0.1}
                    max={5}
                    min={0}
                />
                <Property
                    label='Show Teleportation Circles'
                    type='boolean'
                    selected={selectedProject.globalSettings.teleportation}
                    labelKey={'showCircle'}
                />
                <Property
                    label='Show Teleportation Pinpoint'
                    type='boolean'
                    selected={selectedProject.globalSettings.teleportation}
                    labelKey={'showPinpoint'}
                />
                <Property
                    label='Circle Size'
                    type='integer'
                    selected={selectedProject.globalSettings.teleportation}
                    labelKey={'circleSize'}
                    precision={1.0}
                    max={300}
                    min={20}
                />
                <Property
                    label='Min Opacity'
                    type='integer'
                    selected={selectedProject.globalSettings.teleportation}
                    labelKey={'minOpacity'}
                    precision={0.01}
                    max={1}
                    min={0}
                />
                <Property
                    label='Max Opacity'
                    type='integer'
                    selected={selectedProject.globalSettings.teleportation}
                    labelKey={'maxOpacity'}
                    precision={0.01}
                    max={1}
                    min={0}
                />
            </DropdownPanel>
        </>
    );
}
 
export default GlobalSettingsProperties;