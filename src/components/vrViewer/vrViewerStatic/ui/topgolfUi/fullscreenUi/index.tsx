import { useContext } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { VrViewerStaticContext } from "../../..";

const FullscreenUi = () => {
    const {masterContainerRef} = useContext(VrViewerStaticContext)
    return (  
        <div
            className="text-white"
            style={{
                cursor:`pointer`,
            }}
            onClick={()=>{
                // Check if the document is currently in full screen mode
                if ((document as any).fullscreenElement) {
                    // Exit full screen mode
                    (document as any).exitFullscreen()
                        .then(() => console.log('Exited full screen'))
                        .catch(() => console.error('Error exiting full screen:'));
                } else if ((document as any).mozFullScreenElement) { /* Firefox */
                    (document as any).mozCancelFullScreen();
                } else if ((document as any).webkitFullscreenElement) { /* Chrome, Safari and Opera */
                    (document as any).webkitExitFullscreen();
                } else if ((document as any).msFullscreenElement) { /* IE/Edge */
                    (document as any).msExitFullscreen();
                } else {
                    // Document is not in full screen mode
                    console.log('Document is not in full screen mode');
                    // For windows
                    const element = masterContainerRef.current as any
                    if(element){
                        if(element.requestFullscreen){
                            element.requestFullscreen()
                        }
                        else if(element.webkitRequestFullscreen){
                            element.webkitRequestFullscreen()
                        }
                        else if(element.msRequestFullscreen){
                            element.msRequestFullscreen()
                        }
                    }
                }
            }}
        >
            <AiOutlineFullscreen
                size={40}
            />    
            {/* {!(document as any).fullscreenElement?
                <AiOutlineFullscreen
                    size={40}
                />    
            :
                <AiOutlineFullscreenExit
                    size={40}
                />
            } */}
        </div>
    );
}
 
export default FullscreenUi;