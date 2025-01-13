import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import {useRef, useContext} from 'react';
import { PropertyContext } from "../..";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";

const PlusMinusButton = ({type}:{type:string}) => {
    const {selected,labelKey, min, max, precision}=  useContext(PropertyContext)
    const {setSelectedProject}=  useContext(VrViewerContext)
    const iconRef = useRef<HTMLDivElement>(null)
    return (  
        <div
            ref={iconRef}
            className='bg-light-grey'
            style={{
                padding:`4px`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                cursor:`initial`
            }}
            onMouseEnter={()=>{
                if(iconRef.current){
                    iconRef.current.style.filter = `brightness(1.2)`
                }
            }}
            onMouseLeave={()=>{
                if(iconRef.current){
                    iconRef.current.style.filter = `brightness(1.0)`
                }
            }}
            onClick={()=>{
                if(type === 'plus'){
                    selected[labelKey] = Math.min( Math.max( ( (Number(selected[labelKey]) +  Number(precision)) ),min),max ).toFixed(Math.max( (String(precision).length -2), 0))
                }
                if(type === 'minus'){
                    selected[labelKey] = Math.min( Math.max( ( (Number(selected[labelKey]) -  Number(precision)) ),min),max ).toFixed(Math.max( (String(precision).length -2), 0))
                }

                setSelectedProject(prev=>{return {...prev}})
                if(iconRef.current){
                    iconRef.current.style.filter = `brightness(0.7)`
                }
                setTimeout(()=>{
                    if(iconRef.current){
                        iconRef.current.style.filter = `brightness(1.0)`
                    }
                },100)
            }}
        >
            {type === 'minus'?
                <MdArrowBackIos/>
            :null}
            {type === 'plus'?
                <MdArrowForwardIos/>
            :null}
        </div>
    );
}
 
export default PlusMinusButton;