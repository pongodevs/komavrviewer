import { useContext } from "react";
import { useRef } from "react";
import {isIOS, isSafari, isMobileSafari, isAndroid} from 'react-device-detect'
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';

const EnterVrButton = () => {
    const buttonRef = useRef<HTMLDivElement>(null)
    const {
        setEnableDoc,
        isGameStart,
        setIsGameStart,
        masterContainerRef
    } = useContext(VrViewerStaticContext)
    return ( 
        <div
            className="no-select"
            style={{
                width:`100%`,
                height:`100%`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                position:`fixed`,
                cursor:`pointer`
            }}
        >
            <div
                ref = {buttonRef}
                style={{
                    border:`0.5px solid grey`,
                    borderRadius:`7px`,
                    padding:`1.5rem`,
                    fontSize:`1.4rem`
                }}
                onMouseEnter={()=>{
                    if(buttonRef.current){
                        buttonRef.current.style.transition = `all 0.15s ease-out`
                        buttonRef.current.style.boxShadow = `0px 0px 5px white`
                        buttonRef.current.style.textShadow = `0px 0px 5px white`
                    }
                }}
                onMouseLeave={()=>{
                    if(buttonRef.current){
                        buttonRef.current.style.transition = `all 0.15s ease-out`
                        buttonRef.current.style.textShadow = ``
                        buttonRef.current.style.boxShadow = ``
                    }
                }}
                onClick={()=>{
                    //Request IOS Device orientation control
                    if(isIOS){
                        (DeviceMotionEvent as any).requestPermission().then((response:any) => {
                            if (response == 'granted') {
                                setEnableDoc(v=> true)
                                if(masterContainerRef.current){
                                   
                                    if (masterContainerRef.current.requestFullscreen) {
                                        masterContainerRef.current.requestFullscreen()
                                    } 
                                    else if ((masterContainerRef.current as any).webkitRequestFullscreen){
                                        (masterContainerRef.current as any).webkitRequestFullscreen()
                                    }
                                    else if ((masterContainerRef.current as any).webkitEnterFullscreen){
                                        (masterContainerRef.current as any).webkitEnterFullscreen()
                                    }
                                    else if ((masterContainerRef.current as any).msRequestFullscreen){
                                        (masterContainerRef.current as any).msRequestFullscreen();
                                    }
                                    setIsGameStart(true)
                                }
                            }
                        });
                    }
                    
                    //Full screen
                    if(isSafari || isMobileSafari){
                        if(masterContainerRef.current){
                            if (masterContainerRef.current.requestFullscreen) {
                                masterContainerRef.current.requestFullscreen()
                            } 
                            else if ((masterContainerRef.current as any).webkitRequestFullscreen){
                                (masterContainerRef.current as any).webkitRequestFullscreen()
                            }
                            else if ((masterContainerRef.current as any).webkitEnterFullScreen){
                                (masterContainerRef.current as any).webkitEnterFullScreen()
                            }
                            else if ((masterContainerRef.current as any).msRequestFullscreen){
                                (masterContainerRef.current as any).msRequestFullscreen();
                            }
                        }
                    }

                    // Set Game State
                    setIsGameStart(true)

                    //Enable Device Orientation Contorls
                    if(isAndroid){
                        setEnableDoc(v => true)
                    }
                }}
            >
                Enter VR
            </div>
        </div>
     );
}
 
export default EnterVrButton;