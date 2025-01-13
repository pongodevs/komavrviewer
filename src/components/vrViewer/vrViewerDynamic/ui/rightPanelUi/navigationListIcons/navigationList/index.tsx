import {useState, useEffect, useRef, useContext} from 'react';
import { NavigationListType, RightPanelUiContext } from '../..';


const NavigationList = ({navigationList,index}:{navigationList:NavigationListType, index:number}) => {
    const labelRef = useRef<HTMLDivElement>(null)
    const navigationRef = useRef<HTMLDivElement>(null)
    const {selectedNavigationList, setSelectedNavigationList} = useContext(RightPanelUiContext)
    return (  
        <div
            ref={navigationRef}
            className={selectedNavigationList.label === navigationList.label? "bg-grey": "bg-darker-grey"}
            style={{
                width:`100%`,
                height:`3.5rem`,
                borderTopLeftRadius:`4px`,
                borderBottomLeftRadius:`4px`,
                marginTop:`4px`,
                marginBottom:`4px`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                position:`relative`,
                zIndex: `${1000 - index}`
            }}
            onClick={()=>{
                setSelectedNavigationList(navigationList)
                if(navigationRef.current){
                    navigationRef.current.className = `bg-grey`
                }
            }}
            onMouseEnter={()=>{
                if(labelRef.current){
                    labelRef.current.style.opacity = `100%`
                }
                if(navigationRef.current && selectedNavigationList.label !== navigationList.label){
                    navigationRef.current.className = `bg-dark-grey`
                }
            }}
            onMouseLeave={()=>{
                // Clear all timeout
                if(labelRef.current){
                    labelRef.current.style.opacity = `0%`
                }

                if(navigationRef.current && selectedNavigationList.label !== navigationList.label){
                    navigationRef.current.className = `bg-darker-grey`
                }
            }}
        >
            {navigationList.icon}
            <div
                ref={labelRef}
                className='bg-dark-grey'
                style={{
                    pointerEvents:`none`,
                    opacity:`0%`,
                    position:`absolute`,
                    transform:`translate(3.5rem,3.5rem)`,
                    whiteSpace:`nowrap`,
                    padding:`1rem`,
                    borderRadius:`4px`,
                    boxShadow:`2px 2px 4px rgba(0,0,0,0.5)`,
                    zIndex:`1`
                }}
            >
                {navigationList.label}
            </div>
        </div>
    );
}
 
export default NavigationList;