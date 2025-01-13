import { useContext } from "react";
import Music from "./music";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import ViewPreview from "./viewPreview";
import DropdownPanel from "@/components/homepage/bodyContainer/vrViewer/common/dropdownPanel";
import Property from "@/components/homepage/bodyContainer/vrViewer/common/property";

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
                    label='Enable Zoom'
                    type='boolean'
                    selected={selectedProject.globalSettings.camera}
                    labelKey={'enableZoom'}
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
                label="Map"
            >
                <Property
                    label='Width Percentage'
                    type='integer'
                    selected={selectedProject.globalSettings.map}
                    labelKey={'widthPercentage'}
                    max={100}
                    min={20}
                />
                
            </DropdownPanel>
            <DropdownPanel
                label="Navigation"
            >
                <Property
                    label='Only Shown as Per Map'
                    type='boolean'
                    selected={selectedProject.globalSettings.navigation}
                    labelKey={'onlyShownAsPerMap'}
                />
            </DropdownPanel>
            <DropdownPanel
                label="Music"
            >
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
                label="Transition"
            >
                <Property
                    label='Style'
                    type='enumerator'
                    selected={selectedProject.globalSettings.transition}
                    labelKey={'style'}
                    enumerator={['fade','zoom-in']}
                />
                <Property
                    label='Duration'
                    type='integer'
                    selected={selectedProject.globalSettings.transition}
                    labelKey={'duration'}
                    max={2}
                    min={0.1}
                    precision={0.1}
                />
                <Property
                    label='Enable Zoom Transition'
                    type='boolean'
                    selected={selectedProject.globalSettings.transition}
                    labelKey={'enableZoomTransition'}
                />
                
            </DropdownPanel>
            <DropdownPanel
                label="Instruction"
            >
                <Property
                    label='Show Instruction'
                    type='boolean'
                    selected={selectedProject.globalSettings.instruction}
                    labelKey={'showInstruction'}
                />
                
            </DropdownPanel>
            <DropdownPanel
                label="Show Label"
            >
                <Property
                    label='Map Pinpoint'
                    type='enumerator'
                    selected={selectedProject.globalSettings.showLabel}
                    labelKey={'mapPinpoint'}
                    enumerator={['hover','on','off']}
                />
                <Property
                    label='Image Navigation'
                    type='enumerator'
                    selected={selectedProject.globalSettings.showLabel}
                    labelKey={'imageNavigation'}
                    enumerator={['hover','on','off']}
                />
                <Property
                    label='Viewport Pinpoint'
                    type='enumerator'
                    selected={selectedProject.globalSettings.showLabel}
                    labelKey={'viewportPinpoint'}
                    enumerator={['hover','on','off']}
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
                label="Custom UI"
            >
                <Property
                    label='Preset'
                    type='enumerator'
                    selected={selectedProject.globalSettings}
                    labelKey={'customUi'}
                    enumerator={['default','topgolf']}
                />
            </DropdownPanel>
        </>
    );
}
 
export default GlobalSettingsProperties;