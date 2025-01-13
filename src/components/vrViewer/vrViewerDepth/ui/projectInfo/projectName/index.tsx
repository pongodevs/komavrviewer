import {useContext, useState, useRef} from 'react';
import { VrViewerDepthContext } from '../../..';
import { VrViewerContext } from '../../../..';

const ProjectName = () => {
    const {selectedProject, setSelectedProject} = useContext(VrViewerContext)
    const {showProjectInfo, isDev} = useContext(VrViewerDepthContext)
    const [isDoubleClick, setIsDoubleClick] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    return (  
        <>
            {!isDoubleClick?
                <div
                    style={{
                        cursor:`text`,
                        pointerEvents:showProjectInfo?`all`:`none`,
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
                    pointerEvents:showProjectInfo?`all`:`none`,
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
                        pointerEvents:showProjectInfo?`all`:`none`,
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