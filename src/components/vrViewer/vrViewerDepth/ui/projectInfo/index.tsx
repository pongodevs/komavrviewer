import { useContext, useRef, useState, createContext, Dispatch, SetStateAction } from 'react';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import Description from './description';
import ProjectName from './projectName';
import { BsPlusCircleDotted } from 'react-icons/bs';
import useFirebase from '@/hooks/firebase';
import { useRouter } from 'next/router';
import DonutProgress from '@/components/common/donutProgress';
import BlueOverlay from './blueOverlay';
import { isDesktop } from 'react-device-detect';
import { VrViewerDepthContext } from '../..';
import { VrViewerContext } from '../../..';

type ProjectInfoContextType ={
    isMouseEnter:boolean, 
    setIsMouseEnter:Dispatch<SetStateAction<boolean>>,
    progress:number, 
    setProgress:Dispatch<SetStateAction<number>>,
    overlayRef:any
}
export const ProjectInfoContext = createContext<ProjectInfoContextType>({} as ProjectInfoContextType)
const ProjectInfo = () => {
    const router = useRouter()
    const {selectedProject} = useContext(VrViewerContext)
    const {setShowProjectInfo, showProjectInfo, isEditorMode, borderRadius} = useContext(VrViewerDepthContext)
    const {storage} = useFirebase()
    const iconRef = useRef<HTMLDivElement>(null)
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
                ref={iconRef}
                style={{
                    
                    zIndex:`5`,
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
                    {selectedProject.globalSettings.logo.logoUrl !== '' && selectedProject.globalSettings.logo.showLogo?
                        <img
                            className='no-select'
                            onClick={()=>{
                                setShowProjectInfo(prev=>{return !prev})
                            }}
                            src={selectedProject.globalSettings.logo.logoUrl}
                            style={{
                                cursor:`pointer`,
                                // pointerEvents:`none`,
                                width:`100%`,
                                // position:`absolute`,
                                zIndex:`1`
                            }}
                        />
                    :null}

                    {progress > 0?
                        <div
                            style={{
                                position:`absolute`,
                                display:`flex`,
                                width:`100%`,
                                height:`100%`,
                                justifyContent:`center`,
                                alignItems:`center`,
                                top:`0`
                            }}
                        >
                            <DonutProgress
                                borderWidth='0.7rem'
                                progress={progress}
                                width='7rem'
                            />
                        </div>
                    :null}
                    
                    <BlueOverlay/>
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
                                    setShowProjectInfo(prev=>{return !prev})
                                }}
                                size={35}
                                style={{
                                    cursor:`initial`,
                                    transition:`all 0.2s`,
                                    transform:showProjectInfo?`rotate(0deg)`:`rotate(-90deg)`
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
                    backdropFilter:showProjectInfo?`blur(5px)`:``,
                    height:showProjectInfo?`100%`:`0%`,
                    opacity:showProjectInfo?`100%`:`0%`,
                    pointerEvents:`none`,
                    background:`rgba(0,0,0,0.5)`,
                    padding:padding,
                    paddingTop:`15rem`,
                    width:`calc(100%  - (2 * ${padding}))`,
                    zIndex:`4`,
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
                        width:`calc(100% - 30rem)`,
                        height:`0.2px`,
                    }}
                />
                <Description/>
            </div>
        </ProjectInfoContext.Provider>  
    );
}
 
export default ProjectInfo;