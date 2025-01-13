import { useEffect, useState, useRef, useContext } from "react";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { VrViewerContext} from '@/components/homepage/bodyContainer/vrViewer';
import { isAndroid, isDesktop, isMobile, isTablet } from "react-device-detect";

const DollHouseSectionSlider = () => {
    const {selectedProject,  setSelectedProject} = useContext(VrViewerContext)
    const {mainMeshRef,mainGeometry} = useContext(VrViewerDynamicContext)
    const [sectionPercent, setSectionPercent] = useState(0)
    const [isSliding, setIsSliding] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)

    // Init button height for the first time
    useEffect(()=>{
        if(mainGeometry.boundingBox && buttonRef.current){
            const height = Math.abs(mainGeometry.boundingBox.max.y - mainGeometry.boundingBox.min.y)
            const heightPercentage = (selectedProject.globalSettings.dollHouse.sectionHeight/ height) * 100
            buttonRef.current.style.bottom = `${heightPercentage}%`
        }
    },[mainGeometry, buttonRef])

    useEffect(()=>{
        const mouseUpHandler = ()=>{
            setIsSliding(false)
        }
        const mouseMoveHandler = (e:MouseEvent)=>{
            if(isSliding){
                if(containerRef.current && buttonRef.current && mainMeshRef.current){
                    const containerBound = containerRef.current.getBoundingClientRect()
                    const bottomPercentage = -(e.clientY - containerBound.bottom) / containerBound.height * 100
                    const finalBottomPercentage = Math.min(99,Math.max(0,bottomPercentage))
                    if(mainGeometry.boundingBox){
                        const height = Math.abs(mainGeometry.boundingBox.max.y - mainGeometry.boundingBox.min.y)
                        buttonRef.current.style.bottom = `${finalBottomPercentage}%`
    
                        selectedProject.globalSettings.dollHouse.sectionHeight = finalBottomPercentage / 100 * height
                        setSelectedProject(prev=>{return {...prev}})
                    }

                }
            }
        }
        const handleTouchMove = (e:TouchEvent)=>{
            if(isSliding){
                if(containerRef.current && buttonRef.current && mainMeshRef.current){
                    const containerBound = containerRef.current.getBoundingClientRect()
                    const bottomPercentage = -(e.touches[0].clientY - containerBound.bottom) / containerBound.height * 100
                    const finalBottomPercentage = Math.min(99,Math.max(0,bottomPercentage))
                    if(mainGeometry.boundingBox){
                        const height = Math.abs(mainGeometry.boundingBox.max.y - mainGeometry.boundingBox.min.y)
                        buttonRef.current.style.bottom = `${finalBottomPercentage}%`
    
                        selectedProject.globalSettings.dollHouse.sectionHeight = finalBottomPercentage / 100 * height
                        setSelectedProject(prev=>{return {...prev}})
                    }

                }
            }
        }
        if(isMobile || isTablet){
            addEventListener('touchend',mouseUpHandler)
            addEventListener('touchmove',handleTouchMove)
        }
        else if(isDesktop){
            addEventListener('mouseup',mouseUpHandler)
            addEventListener('mousemove',mouseMoveHandler)
        }


        return()=>{
            if(isMobile || isTablet){
                removeEventListener('touchend', mouseUpHandler)
                removeEventListener('touchmove',handleTouchMove)
            }
            else if(isDesktop){
                removeEventListener('mouseup', mouseUpHandler)
                removeEventListener('mousemove',mouseMoveHandler)
            }
        }

    },)

    
    return (  
        <div
            className="no-select"
            style={{
                position:`fixed`,
                width:`5%`,
                height:`100%`,
                // background:`red`,
                display:`flex`,
                alignItems:`center`,
                zIndex:`1`,
                justifyContent:`center`
            }}
        >
            <div
                ref={containerRef}
                className="bg-darkest-grey no-select"
                style={{
                    position:`absolute`,
                    width:`5px`,
                    borderRadius:`50px`,
                    height:`60%`,
                    display:`flex`,
                    justifyContent:`center`
                }}
            >
                {/*  Button */}
                <div
                    ref={buttonRef}
                    onMouseDown={()=>{
                        if(isDesktop){
                            setIsSliding(true)
                        }
                    }}
                    onTouchStart={()=>{
                        if(isMobile || isTablet){
                            setIsSliding(true)
                        }
                    }}
                    className="bg-white"
                    style={{
                        cursor:`pointer`,
                        position:`absolute`,
                        width:`15px`,
                        height:`15px`,
                        borderRadius:`7px`,
                        bottom:`50%`,
                    }}
                >

                </div>
            </div>

        </div>
    );
}
 
export default DollHouseSectionSlider;