import { BiWorld } from "react-icons/bi";
import { BsFillInfoCircleFill, BsFillPinFill, BsHeadsetVr, BsMap, BsSoundwave } from "react-icons/bs";
import { CgDanger } from "react-icons/cg";
import { VscSymbolColor } from "react-icons/vsc";
import { NavigationListType } from "..";
import NavigationList from "./navigationList";
import { FaCamera } from "react-icons/fa";
import { VrViewerDepthContext } from "../../..";
import { useContext } from "react";

const NavigationListIcons = () => {
    const {currentView} = useContext(VrViewerDepthContext)
    const navigationLists:NavigationListType[] = [
        {
            label:'Global Settings',
            icon:<BiWorld size={20}/>,
            showCondition:true,
        },
        {
            label:'Color Correction',
            icon:<VscSymbolColor size={20}/>,
            showCondition:true,
        },
        {
            label:'Map Manager',
            icon:<BsMap size={19}/>,
            showCondition:true,
        },
        {
            label:'Pinpoint Manager',
            icon:<BsFillPinFill size={20}/>,
            showCondition:true,
        },
        {
            label:'View Properties',
            icon:<FaCamera size={19}/>,
            showCondition:currentView._id !== ''
        },
        {
            label:'Danger Zone',
            icon:<CgDanger size={20}/>,
            showCondition:true,
        },
       
    ]
    return (  
        <div
            className="bg-darkest-grey"
            style={{
                width:`4rem`,
                paddingLeft:`4px`,
                height:`100%`
            }}
        >
            {navigationLists.filter(navList=>navList.showCondition).map((navigationList,index)=>
                <NavigationList
                    navigationList={navigationList}
                    key={index}
                    index={index}
                />
            )}
        </div>
    );
}
 
export default NavigationListIcons;