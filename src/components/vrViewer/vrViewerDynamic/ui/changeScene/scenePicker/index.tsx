import { useContext, useEffect, useRef, useState } from "react";
import gsap from 'gsap'
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import useAnimation from "@/hooks/animation";

const ScenePicker = ({scene}:{scene:any}) => {
    const {
        selectedScene, setSelectedScene, 
        currentView, setCurrentView, 
        setNextView, mainMeshRef,
        player, setPlayer} = useContext(VrViewerDynamicContext)
    const isPicked = scene.sceneName == selectedScene.sceneName
    const textRef = useRef<HTMLDivElement>(null)

    const shadowStlye = `0px 0px 6px rgba(255,255,255,0.2)`

    const [audio, setAudio] = useState(new Audio('/sounds/sfx/ui2.mp3'))
    useEffect(()=>{
        const audio = new Audio('/sounds/sfx/ui2.mp3') as any 
        audio.volume = 0.2

        setAudio(audio)
    },[])
    
    const {animate} = useAnimation()
    return ( 
        <div
            ref={textRef}
            style={{
                padding:`0.5rem 15rem 0.5rem 1rem`,
                borderRadius:`7px`,
                border:isPicked?`0.5px solid white`: '',
                fontWeight:isPicked? 600: 400,
                transition:`all 0.15s`,
                transform:isPicked? ``:`translate(10rem)`,
                boxShadow:shadowStlye,
                textShadow:shadowStlye,
                cursor:`pointer`,
                margin:`1rem`,
                fontSize:`1.8rem`,
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
            className="text-white no-select"
            
            onClick={()=>{
                //Check if view is transitioning, if no, do a scene change
                if(!player.isViewTransition){
                    //Search for clicked scene and it's current view
                    const viewIndex = scene.viewList.map((view:any)=>{
                        return view.viewName
                    }).indexOf(currentView.viewName)
                    setSelectedScene(scene)
                    const view = scene.viewList[viewIndex]

                    //Change transition for main object
                    animate(mainMeshRef.current.material.uniforms.mixColor,{
                        value:1,
                        duration:1,
                        onStart:(()=>{
                            // Play audio
                            audio.play()
                            // Set newView
                            setPlayer(prev=>{return {...prev,
                                isViewTransition:true
                            }})

                            // Main Mesh Ref
                            mainMeshRef.current.material.uniforms.nextTexture.value = view.texture
                            mainMeshRef.current.material.uniforms.nextOrigin.value = view.position
                        }),
                        onUpdate:((progress)=>{
                            mainMeshRef.current.material.uniforms.mixColor.value = progress
                        }),
                        onComplete:(()=>{
                            setPlayer(prev=>{return {...prev,
                                isViewTransition:false
                            }})


                            mainMeshRef.current.material.uniforms.currentTexture.value = view.texture
                            mainMeshRef.current.material.uniforms.currentOrigin.value = view.position
                            mainMeshRef.current.material.uniforms.mixColor.value = 0
                            setCurrentView(view)
                        }),
                    })

                }
            }}
        >
            {scene.sceneName}
        </div>
     );
}
 
export default ScenePicker;