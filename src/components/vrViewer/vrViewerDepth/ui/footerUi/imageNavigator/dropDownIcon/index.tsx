import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io';
import {useContext} from 'react';
import { ImageNavigatorContext } from '../index';

const DropDownIcon = () => {
    const {isShowNavigation, setIsShowNavigation} =useContext(ImageNavigatorContext)
    return (  
        <div
            className='text-white'
            style={{
                zIndex:`100`,
                position:`absolute`,
                bottom:`0`,
                width:`100%`,
                display:`flex`,
                justifyContent:`center`
            }}
        >
            <div
                style={{
                    textShadow:`5px 5px 5px black`,
                    cursor:`pointer`
                }}
                onClick={()=>{
                    setIsShowNavigation(prev=>!prev)
                }}
            >
                {isShowNavigation?
                    <IoMdArrowDropdown
                        size={25} 
                    />
                :
                    <IoMdArrowDropup
                        size={25}
                    />
                }
            </div>
        </div>
    );
}
 
export default DropDownIcon;