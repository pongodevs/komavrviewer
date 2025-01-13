import { useContext, useRef } from "react";
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';


const ProgressBar = () => {
    const progressBarRef = useRef<HTMLDivElement>(null)
    const {
        loadingProgress, setLoadingProgress,
        loadingProcessName, setLoadingProcessName
    } = useContext(VrViewerContext)
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
                    height:`100%`,
                    width:`100%`,
                    zIndex:`1`,
                    border:`0.5px solid grey`,
                    borderRadius:`25px`,
                    position:`relative`
                }}
            >
                <div
                    className='bg-green'
                    style={{
                        borderRadius:`25px`,
                        width:`calc(${loadingProgress} * 100%)`,
                        height:`0.5rem`
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
                    {loadingProcessName}
                </div>
                <div
                    style={{
                        opacity:`60%`,
                        position:`absolute`,
                        top:`1rem`,
                        right:`0.5rem`
                    }}
                >
                    {Math.round(loadingProgress*100)}%
                </div>
            </div>
        </div>
     );
}
 
export default ProgressBar;