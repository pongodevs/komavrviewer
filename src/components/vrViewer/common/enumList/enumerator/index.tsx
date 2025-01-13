
import { useContext, useEffect, useRef, useState } from 'react';
import { EnumListContext } from "..";

const Enumerator = ({enumerator,index}:{enumerator:any, index:number}) => {
    const {
        icon,
        labelKey,
        selected,
        setSelected,
        disableClick,
        onClick
    } = useContext(EnumListContext)
    const [isDoubleClick, setIsDoubleClick] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // If change index, reset double click
    useEffect(()=>{
        if(selected._id !== enumerator._id){
            setIsDoubleClick(false)
        }
    },[selected])
    return (  
        <div
            className={enumerator._id === selected._id? "bg-grey": ''}
            style={{
                margin:`2px`,
                padding:`4px`,
                borderRadius:`4px`,
                display:`flex`,
                alignItems:`center`,
                fontSize:`1.1rem`,
                fontWeight:`400`,
                opacity:disableClick?`20%`:`100%`,
            }}
            onClick={()=>{
                if(!disableClick){
                    if(onClick){
                        onClick(enumerator)
                    }
                    else{
                        setSelected(enumerator)
                    }
                    
                }
            }}
            onDoubleClick={()=>{
                if(!disableClick){
                    setIsDoubleClick(true)
                    if(inputRef.current){
                        inputRef.current.value = enumerator[labelKey]
                        inputRef.current.select()
                        inputRef.current.focus()
                    }
                }
            }}
        >
            <span
                style={{
                    marginRight:`1rem`,
                    display:`flex`,
                    alignItems:`center`,
                    justifyContent:`center`

                }}
            >
                {icon}
            </span>
            <span
                style={{
                    display:isDoubleClick?`none`:`flex`,
                    alignItems:`center`,
                    justifyContent:`center`
                }}
            >
                {enumerator[labelKey]} 
            </span>
            <input
                ref={inputRef}
                className="bg-grey text-white"
                style={{
                    cursor:isDoubleClick?`text`:`default`,
                    width:isDoubleClick?`100%`:`0%`,
                    opacity:isDoubleClick?`100%`:`0%`,
                    outline:`none`,
                    fontSize:`1.1rem`,
                    fontWeight:`400`,
                    border:`none`
                }}
                onKeyDown={(e:any)=>{
                    if(e.code === 'Enter' || e.code === 'NumpadEnter'){
                        enumerator[labelKey] = e.target.value
                        setIsDoubleClick(false)
                    }
                }}
            />
        </div>
    );
}
 
export default Enumerator;