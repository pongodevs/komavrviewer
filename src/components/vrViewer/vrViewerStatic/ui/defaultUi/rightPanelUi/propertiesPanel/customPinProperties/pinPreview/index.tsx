import useFirebase from '@/hooks/firebase';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useState, createContext, Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import * as THREE from 'three'
import DonutProgress from '@/components/common/donutProgress';
import {useContext, useRef} from 'react';
import DraggablePin from './draggablePin';
import BlueOverlay from './blueOverlay';
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';

type PinPreviewContextType = {
    overlayRef:any
    isMouseEnter:boolean,
    setIsMouseEnter:Dispatch<SetStateAction<boolean>>,
    progress:number,
    setProgress:Dispatch<SetStateAction<number>>,
}
export const PinPreviewContext = createContext<PinPreviewContextType>({} as PinPreviewContextType)
const PinPreview = () => {
    const {selectedCustomPinpoint} = useContext(VrViewerStaticContext)
    const router = useRouter()
    const {storage} = useFirebase()
    const [isMouseEnter, setIsMouseEnter] = useState(false)
    const [progress, setProgress] = useState(0)
    const overlayRef = useRef<HTMLDivElement>(null)

    return (  
        <PinPreviewContext.Provider
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
                    aspectRatio:`1/1`,
                    // height:`15rem`,
                    borderRadius:`4px`,
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
                    <DonutProgress
                        width='80%'
                        borderWidth='1rem'
                        progress={progress}
                    />
                :null}
                {progress === 0?
                    <DraggablePin/>
                :null}
            
                
            </div>
        </PinPreviewContext.Provider>
    );
}
 
export default PinPreview;