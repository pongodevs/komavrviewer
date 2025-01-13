import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import {useState} from 'react';

const DropdownPanel = ({children, label}:{children:any, label:string}) => {
    const [isShowPanel, setIsShowPanel] = useState(true)
    return (  
        <div
            className="bg-light-grey"
            style={{
                width:`calc(100% - 2rem)`,
                margin:`0.5rem 0rem`,
                borderRadius:`4px`,
                padding:`4px 1rem 4px 1rem`,
            }}
        >
            <div
                style={{
                    width:`100%`,
                    fontSize:`1.2rem`,
                    fontWeight:`400`,
                    display:`flex`,
                    alignItems:`center`,
                    padding:`4px 0 4px 0px`
                }}
            >
                <span
                    style={{
                        height:`100%`,
                    }}
                    onClick={()=>{
                        setIsShowPanel(prev=>!prev)
                    }}
                >
                    {isShowPanel?
                        <IoIosArrowDown/>
                    :
                        <IoIosArrowForward/>
                    }
                </span>
                <span
                    style={{
                        marginLeft:`1rem`
                    }}
                >
                    {label}
                </span>
            </div>
            {isShowPanel?
                children
            :null}
            
        </div>
    );
}
 
export default DropdownPanel;