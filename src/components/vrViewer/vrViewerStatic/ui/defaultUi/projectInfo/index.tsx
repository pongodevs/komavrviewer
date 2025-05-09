import { useContext, useRef, useState, createContext, Dispatch, SetStateAction } from 'react';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import Description from './description';
import ProjectName from './projectName';
import { BsPlusCircleDotted } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { isDesktop } from 'react-device-detect';
import { VrViewerStaticContext } from '../../..';
import { VrViewerContext } from '../../../..';

type ProjectInfoContextType ={
    isMouseEnter:boolean, 
    setIsMouseEnter:Dispatch<SetStateAction<boolean>>,
    progress:number, 
    setProgress:Dispatch<SetStateAction<number>>,
    overlayRef:any
}
export const ProjectInfoContext = createContext<ProjectInfoContextType>({} as ProjectInfoContextType)
const ProjectInfo = () => {
    const { setShowInfo, showInfo, isEditorMode, borderRadius, projectInfoRef} = useContext(VrViewerStaticContext)
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    const [isMouseEnter, setIsMouseEnter] = useState(false)
    const [progress, setProgress] = useState(0)

    const overlayRef = useRef<HTMLDivElement>(null)
    const padding = isDesktop? `15rem` : `2rem`
    return (
        <ProjectInfoContext.Provider
            value={{
                overlayRef,
                isMouseEnter, setIsMouseEnter,
                progress, setProgress
            }}
        >
            <div
                className='text-white'
                ref={projectInfoRef}
                style={{
                    transition:`transform 1s`,
                    zIndex:`20`,
                    position:`fixed`,
                    left:`2rem`,
                    top:`2rem`
                }}
            >
                {/* Drag and Drop logo */}
                <div
                    style={{
                        position:`relative`,
                        width:`calc(${selectedProject.globalSettings.logo.sizePercentage/100} * 20rem)`,
                        minHeight:`calc(${selectedProject.globalSettings.logo.sizePercentage/100} * 10rem)`,
                    }}
                    onDragEnter={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                        setIsMouseEnter(true)
                        if(overlayRef.current){
                            overlayRef.current.style.pointerEvents = `all`
                        }
                    }}
                    onDragOver={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    
                >
                    {/* Logo Image */}
                    {/* {selectedProject.globalSettings.logo.logoUrl !== '' && selectedProject.globalSettings.logo.showLogo?
                        <img
                            className='no-select'
                            onClick={()=>{
                                if(selectedProject.globalSettings.customUi === 'default' || isEditorMode){
                                    setShowInfo(prev=>{return !prev})
                                }
                            }}
                            src={'./images/icons/info_pinpoint.png'}
                            style={{
                                cursor:`pointer`,
                                width:`100%`,
                                zIndex:`1`
                            }}
                        />
                    :null} */}
                    
                    {/* background */}
                    {selectedProject.globalSettings.logo.logoUrl === '' && selectedProject.globalSettings.logo.showLogo && isEditorMode?
                        <>
                            <div
                                className='bg-dark-grey'
                                style={{
                                    borderRadius,
                                    pointerEvents:`none`,
                                    position:`absolute`,
                                    width:`100%`,
                                    height:`100%`,
                                    display:`flex`,
                                    justifyContent:`center`,
                                    alignItems:`center`
                                }}
                            >
                                <BsPlusCircleDotted
                                    size={60}
                                />  
                            </div>
                        </>
                    :null}
                    {/* Arrow */}
                    {selectedProject.globalSettings.logo.logoUrl === '' || !selectedProject.globalSettings.logo.showLogo?
                        <div
                                style={{
                                    cursor:`initial`,
                                }}
                        >
                            <IoIosArrowDown
                                onClick={()=>{
                                    setShowInfo(prev=>{return !prev})
                                }}
                                size={35}
                                style={{
                                    cursor:`initial`,
                                    transition:`all 0.2s`,
                                    transform:showInfo?`rotate(0deg)`:`rotate(-90deg)`
                                }}
                            />
                        </div>
                    :null}
                </div>
            </div>
            {/* Desc */}
            <div
                className='text-white'
                style={{
                    backdropFilter:showInfo?`blur(5px)`:``,
                    height:showInfo?`100%`:`0%`,
                    opacity:showInfo?`100%`:`0%`,
                    pointerEvents:`none`,
                    background:`rgba(0,0,0,0.5)`,
                    padding:padding,
                    paddingTop:`15rem`,
                    width:`calc(100%  - (2 * ${padding}))`,
                    zIndex:`10`,
                    position:`fixed`,
                    transition:`all 0.5s`
                }}
            >
                <ProjectName/>
                {/* Line */}
                <div
                    className='bg-white'
                    style={{
                        marginTop:`3rem`,
                        marginBottom:`3rem`,
                        width:`calc(100% - ${padding})`,
                        height:`0.2px`,
                    }}
                />
                <Description/>
            </div>
        </ProjectInfoContext.Provider>  
    );
}
 
export default ProjectInfo;