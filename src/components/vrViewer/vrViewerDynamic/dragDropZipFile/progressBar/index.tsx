import { useContext, useEffect, useRef } from "react";
import { VrViewerDynamicContext } from '../../index';
import { DragDropZipFileContext } from "..";


const ProgressBar = () => {
    const progressBarRef = useRef<HTMLDivElement>(null)
    const {
        uploadProgress, setUploadProgress,
        uploadProgressName, setUploadProgressName,
        extractedViewProgress,
    } = useContext(DragDropZipFileContext)

    useEffect(()=>{
        if(Math.round(uploadProgress) === 100){
            setUploadProgressName('Extracting all files into VR Projects. You can close this page and come back later.')
        }
    },[uploadProgress])
    return ( 
        <div 
            style={{
                display:`flex`,
                justifyContent:`center`,
                width:`100%`,
                margin:`4rem`
            }}
            ref={progressBarRef}
        >
            <div
                style={{
                    height:`0.5rem`,
                    width:`100%`,
                    zIndex:`1`,
                    border:`0.5px solid grey`,
                    borderRadius:`25px`,
                    position:`relative`
                }}
            >
                {/* Loading */}
                {/* Green */}
                <div
                    className='bg-green'
                    style={{
                        borderRadius:`25px`,
                        width:`calc(${uploadProgress}%)`,
                        height:`0.5rem`,
                        position:`absolute`
                    }}
                />
                {/* Blue */}
                <div
                    className='bg-blue'
                    style={{
                        borderRadius:`25px`,
                        width:`calc(${extractedViewProgress}%)`,
                        height:`0.5rem`,
                        position:`absolute`
                    }}
                />
                <div
                    style={{
                        opacity:`60%`,
                        position:`absolute`,
                        top:`1rem`,
                        left:`0.5rem`
                    }}
                >
                    {uploadProgressName}
                </div>
                <div
                    style={{
                        opacity:`60%`,
                        position:`absolute`,
                        top:`1rem`,
                        right:`0.5rem`
                    }}
                >
                    {Math.round(uploadProgress) === 100? Math.round(extractedViewProgress): Math.round(uploadProgress)}%
                </div>
            </div>
        </div>
     );
}
 
export default ProgressBar;