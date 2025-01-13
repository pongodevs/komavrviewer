import {useRef, useEffect, useContext} from 'react';
import { VrViewerStaticContext } from '../../../../..';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
const Instruction = () => {

    const { isGameStart, borderRadius} = useContext(VrViewerStaticContext)
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    const instructionRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        const handleMouseMove = ()=>{
            if(instructionRef.current){
                instructionRef.current.style.opacity = `0%`
                instructionRef.current.style.transform = `translateY(0rem)`
            }
        }

        addEventListener('mousemove',handleMouseMove)
        addEventListener('touchmove',handleMouseMove)

        return()=>{
            removeEventListener('mousemove',handleMouseMove)
            removeEventListener('touchmove',handleMouseMove)
        }
    },)
    useEffect(()=>{
        if(instructionRef.current){
            instructionRef.current.style.opacity = `100%`
            instructionRef.current.style.transform = `translateY(-5rem)`
        }
    },[isGameStart,selectedProject.globalSettings.instruction.showInstruction])
    return (  
        <div
            className="text-white"
            style={{
                position:`absolute`,
                width:`100%`,
                display:`flex`,
                justifyContent:`center`
            }}
        >
            {selectedProject.globalSettings.instruction.showInstruction?
                <div
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
                >
                    CLICK AND DRAG TO LOOK AROUND
                </div>
            :null}
        </div>
    );
}
 
export default Instruction;