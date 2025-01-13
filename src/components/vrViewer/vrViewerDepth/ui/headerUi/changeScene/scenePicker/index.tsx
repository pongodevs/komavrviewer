import { useContext, useEffect, useRef, useState } from "react";
import gsap from 'gsap'
import useAnimation from "@/hooks/animation";
import { VrViewerDepthContext } from "../../../..";
import { SceneType } from "@/types/vrProjectType";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import { isDesktop } from "react-device-detect";
import useDecoder from "@/hooks/decoder";
import * as THREE from 'three'

const ScenePicker = ({scene}:{scene:SceneType}) => {
    const {
        selectedScene, setSelectedScene, 
        currentView, setCurrentView, 
        setNextView, mainMeshRef,
        player, setPlayer,
        
        dummyMeshRef
    } = useContext(VrViewerDepthContext)
    const {textureLoader,loadedViews,
        setLoadedViews,} = useContext(VrViewerContext)
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
    const {decode16BitPng} = useDecoder()
    return ( 
        <div
            ref={textRef}
            className="text-white no-select"
            style={{
                padding:`0.7rem 1rem`,
                width:`15rem`,
                backdropFilter:`blur(4px)`,
                background:`rgba(0,0,0,0.25)`,
                borderRadius:`7px`,
                border:isPicked?`0.5px solid white`: '',
                fontWeight:isPicked? 600: 400,
                transition:`all 0.15s`,
                transform:isPicked? `translateX(2rem)`:``,
                boxShadow:shadowStlye,
                textShadow:shadowStlye,
                cursor:`pointer`,
                fontSize:`1.4rem`,
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
            
            onClick={async()=>{
                //Check if view is transitioning, if no, do a scene change
                if(!player.isViewTransition){
                    //Search for clicked scene and it's current view
                    const findView = scene.viewList.find(v=>v.viewName === currentView.viewName)
                    if(findView){
                        const findLoadedViews = loadedViews.find(v=>{return v._id === findView._id})
                        if(findLoadedViews){
                            animate(mainMeshRef.current.material.uniforms.mixColor,{
                                value:1.0,
                                duration:1,
                                onStart:()=>{
                                    setSelectedScene(scene)
                                    dummyMeshRef.current.position.x = 9999
                                    dummyMeshRef.current.position.y = 9999
                                    dummyMeshRef.current.position.z = 9999
                                    mainMeshRef.current.material.uniforms.nextDiffuse.value = findLoadedViews.texture
                                },
                                onUpdate:()=>{
                                    player.isViewTransition = true
                                },
                                onComplete:()=>{
                                    player.isViewTransition = false
                                    mainMeshRef.current.material.uniforms.currentDiffuse.value = findLoadedViews.texture
                                    mainMeshRef.current.material.uniforms.mixColor.value = 0.0
                                    setCurrentView(findLoadedViews)
                                }
                            })
                        }
                        else{
                            const depth = await decode16BitPng(findView.depthUrl)
                            textureLoader.load(isDesktop?findView.imageUrl6000: findView.imageUrl4000, (diffuseTexture)=>{
                                animate(mainMeshRef.current.material.uniforms.mixColor,{
                                    value:1.0,
                                    duration:1,
                                    onStart:()=>{
                                        console.log('start')
                                        console.log(dummyMeshRef.current.position)
                                        dummyMeshRef.current.position.x = 9999
                                        dummyMeshRef.current.position.y = 9999
                                        dummyMeshRef.current.position.z = 9999

                                        console.log(dummyMeshRef.current.position)
                                        setSelectedScene(scene)
                                        mainMeshRef.current.material.uniforms.nextDiffuse.value = diffuseTexture
                                    },
                                    onComplete:()=>{

                                        mainMeshRef.current.material.uniforms.currentDiffuse.value = diffuseTexture
                                        mainMeshRef.current.material.uniforms.mixColor.value = 0.0

                                        const newView = {...findView}
                                        newView.texture = diffuseTexture
                                        newView.depthMacroTexture = depth.macroTexture
                                        newView.depthMicroTexture = depth.microTexture
                                        setLoadedViews(prev=>{return [...prev, newView]})
                                        setCurrentView(newView)
                                    }
                                })
                            })
                        }
                    }
                }
            }}
        >
            {scene.sceneName}
        </div>
     );
}
 
export default ScenePicker;