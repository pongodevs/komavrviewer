import {useContext, useEffect, useRef, useState} from 'react';
import { VrViewerStaticContext } from '../../..';

const UiHiddenInstruction = ({condition, text}:{condition:boolean,text:string}) => {
    const {borderRadius, isFullscreen, showUi} = useContext(VrViewerStaticContext)
    const [isTouchMove, setIsTouchMove] = useState(false)

    useEffect(()=>{
        const handleTouchMove = ()=>{
            if(instructionRef.current){
                instructionRef.current.style.opacity = `0%`
                instructionRef.current.style.transform = `translateY(10rem)`
            }
        }

        addEventListener('touchmove',handleTouchMove)

        return()=>{
            removeEventListener('touchmove',handleTouchMove)
        }
    },)

    const instructionRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        if(condition){
            if(instructionRef.current){
                instructionRef.current.style.opacity = `100%`
                instructionRef.current.style.transform = `translateY(0rem)`
            }
        }
    },[condition])


    return (  
        <div
            className=''
            style={{
                pointerEvents:`none`,
                width:`100%`,
                height:`30%`,
                bottom:`0`,
                position:`fixed`,
                display:`flex`,
                zIndex:`100`,
                justifyContent:`center`
            }}
        >
            <div
                ref={instructionRef}
                className="text-white"
                style={{
                    position:`absolute`,
                    top:`0rem`,
                    opacity:condition?`100%`:`0%`,
                    transform:condition?``:`translateY(10rem)`,
                    background:`rgba(0,0,0,0.5)`,
                    padding:`1rem`,
                    fontSize:`1.2rem`,
                    fontWeight:`600`,
                    transition:`all 0.5s`,
                    borderRadius,
                }}
            >
                {text}
            </div>
        </div>

    );
}
 
export default UiHiddenInstruction;