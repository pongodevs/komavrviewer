import {useContext, useState} from 'react';
import { PropertyContext } from '..';
import { VrViewerContext } from '../../..';

const Enumerator = () => {
    const {setSelectedProject} = useContext(VrViewerContext)
    const {enumerator, selected, labelKey} =useContext(PropertyContext)
    return (  
        <div
            style={{
                marginLeft:`4px`
            }}
        >
            <select
                onChange={(e)=>{
                    selected[labelKey] = e.target.value
                    setSelectedProject(prev=>{return {...prev}})
                }}
                value={selected[labelKey]}
                className='bg-lighter-grey text-white'
                style={{
                    outline:`none`,
                    border:`none`,
                    borderRadius:`4px`,
                    padding:`4px`,
                    fontSize:`1.2rem`,
                    fontWeight:`400`,
                }}
            >
                {enumerator.map((e,index)=>
                    <option 
                        id={e}
                        key={index}
                    >
                        {e}
                    </option>
                )}
            </select>
        </div>
    );
}
 
export default Enumerator;