import {useContext, useState, useRef} from 'react';
import { VrViewerStaticContext } from '../../../..';
import { VrViewerContext } from '@/components/vrViewer';

const ProjectName = () => {
    const {showInfo, isDev} = useContext(VrViewerStaticContext)
    const [isDoubleClick, setIsDoubleClick] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    return (  
        <>
            {!isDoubleClick?
                <div
                    style={{
                        cursor:`text`,
                        pointerEvents:showInfo?`all`:`none`,
                        fontSize:`3rem`,
                        fontWeight:`600`
                    }}
                    onDoubleClick={()=>{
                        if(isDev){
                            setIsDoubleClick(true)
                            if(inputRef.current){
                                inputRef.current.value = selectedProject.projectName
                                inputRef.current.focus()
                                inputRef.current.select()
                                setSelectedProject(prev=>{return {...prev}})
                            }
                        }
                    }}
                >
                    {selectedProject.projectName}
                </div>
            :null}
            <div
                style={{
                    pointerEvents:showInfo?`all`:`none`,
                    width:isDoubleClick?`100%`:`0%`,
                    height:isDoubleClick?``:`0%`,
                    opacity:isDoubleClick?`100%`:`0%`,
                }}
            >
                <input
                    ref={inputRef}
                    className='text-white'
                    onKeyDown={(e)=>{
                        if(e.code === 'Enter'){
                            if(inputRef.current){
                                selectedProject.projectName = inputRef.current.value
                                setSelectedProject(prev=>{return {...prev}})
                            }
                            setIsDoubleClick(false)
                        }
                    }}
                    style={{
                        pointerEvents:showInfo?`all`:`none`,
                        background:`rgba(0,0,0,0.2)`,
                        fontSize:`3rem`,
                        fontWeight:`600`,
                        outline:`none`,
                        border:`none`
                    }}
                />
            </div>
        </>
    );
}
 
export default ProjectName;