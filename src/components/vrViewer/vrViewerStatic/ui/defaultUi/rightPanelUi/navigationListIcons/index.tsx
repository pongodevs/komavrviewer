import { BiCamera, BiPin, BiWorld } from "react-icons/bi";
import NavigationList from "./navigationList";
import { BsCloudSun, BsFillPinFill, BsMap } from "react-icons/bs";
import { NavigationListType } from "..";
import { AiFillCamera } from "react-icons/ai";
import { FaCamera } from "react-icons/fa";
import {useContext} from 'react';
import { VrViewerStaticContext } from "../../../..";
import { IoIosSettings } from "react-icons/io";



const NavigationListIcons = () => {
    const {currentView} = useContext(VrViewerStaticContext)
    const navigationLists:NavigationListType[] = [
        {
            label:'Global Settings',
            icon:<BiWorld size={20}/>,
            showCondition:true,
        },
        {
            label:'Scene Manager',
            icon:<BsCloudSun size={20}/>,
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
            label:'Setting Properties',
            icon:<IoIosSettings size={19}/>,
            showCondition:currentView._id !== ''
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