import { createContext, useContext, useState } from 'react';
import { VrViewerContext } from '../..';
import Boolean from './boolean';
import Enumerator from './enumerator';
import Integer from './integer';

type PropertyContextType = {
    type:'boolean' | 'enumerator' | 'integer',
    selected:any,
    labelKey:string,
    max:number,
    min:number,
    precision:number,
    enumerator:string[],
    isGlobal?:boolean,
    disable?:boolean
}

type PropertyType = {
    label:string,
    type:'boolean' | 'enumerator' | 'integer', 
    selected:any,
    labelKey:string,
    max?:number,
    min?:number,
    precision?:number,
    enumerator?:string[],
    isGlobal?:boolean,
    disable?:boolean,
}

export const PropertyContext = createContext<PropertyContextType>({} as PropertyContextType)

const Property = ({label, type, selected, labelKey, max, min, precision, enumerator, isGlobal, disable}:PropertyType) => {
    const [isMouseDown, setIsMouseDown] = useState(false)
    const {setEnableOrbitControl} = useContext(VrViewerContext)
    return (  
        <PropertyContext.Provider
            value={{
                enumerator:enumerator || [],
                type,
                selected,
                labelKey,
                max:max || 99999,
                min:!Number.isNaN(min) && !undefined? min as number : -99999,
                precision:precision || 1,
                isGlobal,
                disable
            }}
        >
            <div
                style={{
                    display:`flex`,
                    alignItems:`center`,
                    padding:`4px 0rem`,
                    fontSize:`1rem`,
                    fontWeight:`400`,
                    opacity:disable?`50%`: `100%`
                }}
                onMouseDown={()=>{
                    setEnableOrbitControl(false)
                }}
            >
                {/* Checker */}
                {type === 'boolean'?
                    <Boolean/>
                :null}
                {/* Label */}
                <div
                    className='text-lightest-grey'
                    style={{
                        marginLeft:`4px`,
                        whiteSpace:`nowrap`
                    }}
                >
                    {label}
                </div>
                {/* Integer */}
                {type === 'integer'?
                    <Integer/>
                :null}
                {/* Enumerator */}
                {type === 'enumerator'?
                    <Enumerator/>
                :null}
            </div>
        </PropertyContext.Provider>
    );
}
 
export default Property;