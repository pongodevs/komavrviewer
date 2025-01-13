import { VrViewerStaticContext } from "@/components/vrViewer/vrViewerStatic";
import { useContext, useEffect, useRef, useState } from "react";

const ScenePicker = ({scene}:{scene:any}) => {
    const {
        selectedScene, setSelectedScene, 
        player, changeScene} = useContext(VrViewerStaticContext)
    const isPicked = scene.sceneName == selectedScene.sceneName
    const textRef = useRef<HTMLDivElement>(null)

    const shadowStlye = `0px 0px 6px rgba(255,255,255,0.2)`

    const [audio, setAudio] = useState(new Audio('/sounds/sfx/ui2.mp3'))
    useEffect(()=>{
        const audio = new Audio('/sounds/sfx/ui2.mp3') as any 
        audio.volume = 0.1

        setAudio(audio)
    },[])
    
    return ( 
        <div
            ref={textRef}
            className="text-white no-select"
            style={{
                padding:`0.7rem 1rem`,
                width:`20rem`,
                borderRadius:`7px`,
                border:isPicked?`0.5px solid white`: '',
                fontWeight:isPicked? 600: 400,
                transition:`all 0.15s`,
                transform:isPicked? ``:`translateX(-10rem)`,
                boxShadow:shadowStlye,
                textShadow:shadowStlye,
                cursor:`pointer`,
                fontSize:`1.8rem`,
                display:`flex`,
                flexDirection:`row-reverse`,
                zIndex:`1`,
                // background:`red`
            }}
            onMouseEnter={()=>{
                if(textRef.current){
                    textRef.current.style.textShadow = shadowStlye
                }
            }}
            onMouseLeave={()=>{
                if(textRef.current){
                    textRef.current.style.textShadow = shadowStlye
                }
            }}
            
            onClick={()=>{
                changeScene(scene)
            }}
        >
            {scene.sceneName}
        </div>
     );
}
 
export default ScenePicker;