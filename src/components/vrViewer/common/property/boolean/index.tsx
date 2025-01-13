import {useContext, useRef, useState} from 'react';
import { PropertyContext } from '..';
import { FaCheck } from 'react-icons/fa';
import { VrViewerContext } from '../../..';
const Boolean = () => {
    const {setSelectedProject} = useContext(VrViewerContext)
    const { selected, labelKey, disable} = useContext(PropertyContext)
    const booleanRef = useRef<HTMLDivElement>(null)
    return (  
        <div
            ref={booleanRef}
            className={selected[labelKey]?`bg-blue text-white`:`bg-grey text-white`}
            style={{
                width:`1.5rem`,
                height:`1.5rem`,
                borderRadius:`4px`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`
            }}
            onMouseEnter={()=>{
                if(booleanRef.current){
                    booleanRef.current.style.filter = `brightness(1.2)`
                }
            }}
            onMouseLeave={()=>{
                if(booleanRef.current){
                    booleanRef.current.style.filter = `brightness(1.0)`
                }
            }}
            onClick={()=>{
                if(!disable){
                    selected[labelKey] = !selected[labelKey]
                    setSelectedProject(prev=>{return {...prev}})
                }
            }}
        >
            {selected[labelKey]?
                <FaCheck/>
            :null}
        </div>
    );
}
 
export default Boolean;