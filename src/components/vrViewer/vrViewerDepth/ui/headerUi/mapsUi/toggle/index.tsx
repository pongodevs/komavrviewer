import { IoIosClose, IoMdPin } from "react-icons/io";
import {useContext} from 'react';
import { BsPinMap } from "react-icons/bs";
import { MapsUiContext } from "..";

const Toggle = () => {
    const {setIsShowMap, isShowMap} = useContext(MapsUiContext)
    return (  
        <div
            style={{
                position:`fixed`,
                zIndex:`4`,
                top:`2rem`,
                right:`2rem`
            }}
        >
            {isShowMap?
                <div
                    className="text-red"
                    style={{
                        cursor:`pointer`
                    }}
                    onClick={()=>{
                        setIsShowMap(false)
                    }}
                >
                    <IoIosClose
                        size={35}
                    />
                </div>
            :
                <div
                    className="text-white"
                    style={{
                        cursor:`pointer`
                    }}
                    onClick={()=>{
                        setIsShowMap(true)
                    }}
                >
                    <BsPinMap
                        size={35}
                    />
                </div>
            }
        </div>
    );
}
 
export default Toggle;