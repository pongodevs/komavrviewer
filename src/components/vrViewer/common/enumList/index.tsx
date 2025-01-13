import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import MiniButton from "../miniButton";
import _ from "lodash";
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import {createContext} from 'react';
import Enumerator from "./enumerator";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { v4 } from "uuid";

export type EnumType = {
    enumList:any[], 
    icon:any, 
    labelKey:string, 
    defaultObject:any,
    selected:any,
    setSelected:Dispatch<SetStateAction<any>>, 
    defaultName:string,
    disablePlus?:any, 
    disableMinus?:any, 
    disableUp?:any, 
    disableDown?:any, 
    disableAll?:any, 
    onPlus?:any, 
    disableClick?:boolean, 
    onClick?:any
}
export const enumObject = {
    label:'',
}

type EnumListContextType = {
    enumList:any[],
    icon:any,
    labelKey:string,
    selected:any,
    disableClick?:boolean,
    setSelected:Dispatch<SetStateAction<any>>,
    onClick?:any
}
export const EnumListContext = createContext({} as EnumListContextType)
const EnumList = (
        {
            enumList, 
            icon, 
            labelKey, 
            defaultObject, 
            setSelected, 
            selected, 
            defaultName, 
            disablePlus, 
            disableMinus, 
            disableUp, 
            disableDown, 
            disableAll, 
            onPlus, 
            onClick, 
            disableClick
        }:EnumType
    ) => {

    return (  
        <EnumListContext.Provider
            value={{
                enumList,
                icon,
                labelKey,
                selected,
                setSelected,
                disableClick,
                onClick
            }}
        >
            <div
                style={{
                    width:`100%`,
                    height:`20rem`,
                    display:`flex`,
                }}
            >
                {/* Lists */}
                <div
                    className="bg-dark-grey"
                    style={{
                        padding:`1rem`,
                        // margin:`1rem`,
                        width:`100%`,
                        height:`calc(100% - 2rem)`,
                        borderRadius:`4px`,
                        border:`0.5px solid rgba(255,255,255,0.1)`,
                    }}
                >
                    <div
                        style={{
                            width:`100%`,
                            height:`100%`,
                            overflowY:`auto`,
                            overflowX:`hidden`,
                        }}
                    >
                        {enumList.map((enumerator,index)=>  
                            <Enumerator
                                key={index}
                                enumerator={enumerator}
                                index={index}
                            />
                        )}
                    </div>
                </div>
                {/* Right */}
                <div
                    style={{
                        marginLeft:`1rem`,
                        height:`100%`,
                        display:`flex`,
                        flexDirection:`column`,
                        gap:`1rem`
                    }}
                >
                    <div>
                        <MiniButton
                            disable={disableAll || disablePlus}
                            icon={<AiOutlinePlus size={13}/>}
                            onClick={onPlus? onPlus : ()=>{
                                const newEnum = {...defaultObject,
                                    _id:v4(),
                                    [labelKey]:`${defaultName} ${enumList.length + 1}`
                                }
                                enumList.push(newEnum)
                                setSelected(newEnum)
                            }}
                            type="top"
                        />
                        <MiniButton
                            disable={disableAll || disableMinus}
                            icon={<AiOutlineMinus size={13}/>}
                            onClick={()=>{
                                const finder = enumList.find(f=>f._id == selected._id)
                                const index = enumList.indexOf(finder)
                                enumList.splice(index,1)
                                if(enumList.length !== 0){
                                    setSelected(enumList[Math.max(index - 1,0)])
                                }
                                else{
                                    setSelected(defaultObject)
                                }
                            }}
                            type="bottom"
                        />
                    </div>
                    <div>
                        <MiniButton
                            disable={disableAll || disableUp}
                            icon={<IoMdArrowDropup size={13}/>}
                            onClick={()=>{
                                const finder = enumList.find(f=>f._id == selected._id)
                                const index = enumList.indexOf(finder)
                                if(index > 0){
                                    enumList.splice(index,1)
                                    enumList.splice(index - 1,0, finder)
                                    setSelected((prev:any)=>{return {...finder}})
                                }
                            }}
                            type="top"
                        />
                        <MiniButton
                            disable={disableAll || disableDown}
                            icon={<IoMdArrowDropdown size={13}/>}
                            onClick={()=>{
                                const finder = enumList.find(f=>f._id == selected._id)
                                const index = enumList.indexOf(finder)
                                if(index < enumList.length - 1){
                                    enumList.splice(index,1)
                                    enumList.splice(index + 1,0, finder)
                                    setSelected((prev:any)=>{return {...finder}})
                                }
                            }}
                            type="bottom"
                        />
                    </div>
                </div>
            </div>
        </EnumListContext.Provider>
    );
}
 
export default EnumList;