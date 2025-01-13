import useFirebase from '@/hooks/firebase';
import { useRouter } from 'next/router';
import { useState, createContext, Dispatch, SetStateAction } from 'react';
import DonutProgress from '@/components/common/donutProgress';
import {useContext, useRef} from 'react';
import BlueOverlay from './blueOverlay';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import ProjectThumbnail from './projectThumbnail';
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';

type ViewPreviewContextType = {
    overlayRef:any
    isMouseEnter:boolean,
    setIsMouseEnter:Dispatch<SetStateAction<boolean>>,
    progress:number,
    setProgress:Dispatch<SetStateAction<number>>,
}
export const ViewPreviewContext = createContext<ViewPreviewContextType>({} as ViewPreviewContextType)
const ViewPreview = () => {
    const {selectedCustomPinpoint, currentView, borderRadius} = useContext(VrViewerStaticContext)
    const {selectedProject} = useContext(VrViewerContext)
    const router = useRouter()
    const {storage} = useFirebase()
    const [isMouseEnter, setIsMouseEnter] = useState(false)
    const [progress, setProgress] = useState(0)
    const overlayRef = useRef<HTMLDivElement>(null)

    return (  
        <ViewPreviewContext.Provider
            value={{
                overlayRef,
                isMouseEnter, setIsMouseEnter,
                progress, setProgress
            }}
        >
            <div
                className="bg-dark-grey"
                style={{
                    margin:`1rem 0rem`,
                    width:`100%`,
                    aspectRatio:`2/1`,
                    borderRadius:borderRadius,
                    display:`flex`,
                    justifyContent:`center`,
                    alignItems:`center`,
                    position:`relative`
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
                    if(overlayRef.current){
                        overlayRef.current.style.pointerEvents = `all`
                    }
                }}
                
            >
                <BlueOverlay/>
                
                {progress > 0?
                    <div
                        style={{
                            position:`absolute`,
                            width:`100%`,
                            height:`100%`,
                            display:`flex`,
                            justifyContent:`center`,
                            alignItems:`center`
                        }}
                    >
                        <DonutProgress
                            width='80%'
                            borderWidth='1rem'
                            progress={progress}
                        />
                    </div>
                :null}
                <ProjectThumbnail/>
                
            </div>
        </ViewPreviewContext.Provider>
    );
}
 
export default ViewPreview;