
import React from 'react'
import { useRef,  useContext} from 'react';
import { BiRotateLeft, BiWalk } from 'react-icons/bi';
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { BsFillPauseFill, BsFillPlayFill, BsHouse, BsPause } from 'react-icons/bs';

const DollHouse = () => {
    const { toDollHouse, toWalkMode, isDollHouseMode, player} = useContext(VrViewerDynamicContext)
    const iconRef = useRef<HTMLDivElement>(null)
    return (  
        <div 
            ref={iconRef}
            className='text-white no-select'
            style={{
                padding:`0.5rem`,
                cursor:`pointer`,
                zIndex:`50`,
                fontSize:`3rem`,
            }}
            onClick={()=>{
                if(!player.isTeleport){
                    if(isDollHouseMode){
                        toWalkMode()
                    }
                    else{
                        toDollHouse()
                    }
                }
            }}
            onMouseEnter={()=>{
                if(iconRef.current){
                    iconRef.current.style.transition=`all 0.15s ease-out`
                    iconRef.current.style.transform=`scale(1.2)`
                }
            }}
            onMouseLeave={()=>{
                if(iconRef.current){
                    iconRef.current.style.transform=`scale(1.0)`
                }
            }}
        >
            {isDollHouseMode?
                <BiWalk/>
            :
                <BsHouse/>
            }
        </div>
    );
}
 
export default DollHouse;