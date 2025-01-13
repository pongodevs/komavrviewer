import {useRef, useEffect, useContext} from 'react';
import { VrViewerDepthContext } from '../..';

const Instruction = () => {
    const {borderRadius,instructionRef} = useContext(VrViewerDepthContext)

    const disposeInstruction = ()=>{
        if(instructionRef.current){
            instructionRef.current.style.opacity = `0%`
            instructionRef.current.style.transform = `translateY(10rem)`
        }
    }

    return (  
        <div
            className="text-white"
            style={{
                position:`fixed`,
                width:`100%`,
                display:`flex`,
                bottom:`8rem`,
                justifyContent:`center`,
                zIndex:`1`
            }}
        >
            <div
                className='no-select'
                ref={instructionRef}
                style={{
                    opacity:`0%`,
                    background:`rgba(0,0,0,0.5)`,
                    transform:`translateY(-10rem)`,
                    padding:`1rem`,
                    fontSize:`1.2rem`,
                    fontWeight:`600`,
                    transition:`all 0.5s`,
                    borderRadius
                }}  
                onMouseEnter={()=>{
                    disposeInstruction()
                }}
                onTouchEnd={()=>{
                    disposeInstruction()
                }}
            >
                CLICK AND DRAG TO LOOK AROUND
            </div>
        </div>
    );
}
 
export default Instruction;