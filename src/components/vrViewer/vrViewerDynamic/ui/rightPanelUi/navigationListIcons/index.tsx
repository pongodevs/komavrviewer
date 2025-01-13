import { BiWorld } from "react-icons/bi";
import { BsFillInfoCircleFill, BsHeadsetVr, BsSoundwave } from "react-icons/bs";
import { CgDanger } from "react-icons/cg";
import { VscSymbolColor } from "react-icons/vsc";
import { NavigationListType } from "..";
import NavigationList from "./navigationList";

const NavigationListIcons = () => {
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
            label:'Info Pinpoints',
            icon:<BsFillInfoCircleFill size={20}/>,
            showCondition:true,
        },
        {
            label:'Spatial Sound',
            icon:<BsSoundwave size={20}/>,
            showCondition:true,
        },
        {
            label:'Virtual Reality',
            icon:<BsHeadsetVr size={20}/>,
            showCondition:true,
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