import UpdateProject from "./updateProject";
import { useContext, useState, Dispatch, SetStateAction } from 'react';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import NavigationListIcons from "./navigationListIcons";
import PropertiesPanel from "./propertiesPanel";
import {createContext} from 'react';
import { BiWorld } from "react-icons/bi";

export type NavigationListType = {
    icon:any,
    label:string,
    showCondition:boolean,
}

export const navigationListObject = {
    icon:<></>,
    label:''
}
type RightPanelUiContextType = {
    selectedNavigationList:NavigationListType, 
    setSelectedNavigationList:Dispatch<SetStateAction<NavigationListType>>
}


export const RightPanelUiContext = createContext<RightPanelUiContextType>({} as RightPanelUiContextType)
const RightPanelUi = () => {
    const {isEditorMode, currentView, setEnableOrbitControl, enableZoom, setEnableZoom} = useContext(VrViewerDynamicContext)
    const [selectedNavigationList, setSelectedNavigationList] = useState<NavigationListType>({
        label:'Global Settings',
        icon:<BiWorld size={20}/>,
        showCondition:true
    })
    return (  
        <RightPanelUiContext.Provider
            value={{
                selectedNavigationList, setSelectedNavigationList
            }}
        >
            <div
                className="text-white bg-darkest-grey no-select"
                style={{
                    cursor:`initial`,
                    zIndex:`1`,
                    position:`absolute`,
                    opacity:`100%`,
                    width:isEditorMode?`20%`:`0%`,
                    height:`100%`,
                    right:`0`,
                    bottom:`0`,
                    transition:`all 0.2s`,
                    display:`flex`,
                }}
                onMouseEnter={()=>{
                    setEnableZoom(false)
                }}
                onMouseLeave={()=>{
                    setEnableZoom(true)
                }}
            >   
                <NavigationListIcons/>
                <PropertiesPanel/>
                {isEditorMode? 
                    <UpdateProject/>
                :null}
            </div>
        </RightPanelUiContext.Provider>
    );
}
 
export default RightPanelUi;