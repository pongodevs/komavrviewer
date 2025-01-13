import { useContext, useEffect } from "react";
import { ImageListContext } from "..";
import {useState, useRef} from 'react';
import { ImageNavigatorContext } from "../..";
import { VrViewerStaticContext } from "@/components/vrViewer/vrViewerStatic";
import { VrViewerContext } from "@/components/vrViewer";

const Callout = () => {
    const calloutColor = `rgba(0,0,0,0.7)`
    const {imageNavRef, state, setState} = useContext(ImageNavigatorContext)
    const {calloutRef,view,} = useContext(ImageListContext)
    const {isEditorMode, borderRadius} = useContext(VrViewerStaticContext)
    const {setSelectedProject, selectedProject} = useContext(VrViewerContext)

    const [isDoubleClick, setIsDoubleClick] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(()=>{
        if(calloutRef.current){
            calloutRef.current.style.left= `-${imageNavRef.current.scrollLeft}px`
        }
    },[state])
    return (  
        <div
            ref={calloutRef}
            className="no-select"
            style={{
                width:`100%`,
                height:`100%`,
                opacity:isEditorMode || selectedProject.globalSettings.showLabel.imageNavigation === 'on'?`100%`:`0%`,
                position:`absolute`,
                zIndex:`-1`,
                display:`flex`,
                justifyContent:`center`,
                transition:`all 0.2s`,
            }}
        >
            <div
                className="text-white"
                style={{
                    background:`${calloutColor}`,
                    display:`flex`,
                    alignItems:`center`,
                    justifyContent:`center`,
                    position:`fixed`,
                    padding:`1rem`,
                    borderRadius:borderRadius,
                    width:`9rem`,
                    transform:`translateY(-5rem)`,
                    height:`1.5rem`,
                    whiteSpace:`nowrap`
                }}
                onMouseUp={()=>{
                    if(isEditorMode){
                        setIsDoubleClick(true)
                        if(inputRef.current){
                            inputRef.current.value = view.labelName
                            inputRef.current.select()
                            inputRef.current.focus()
                        }
                    }
                }}
                onMouseLeave={()=>{
                    // if(isEditorMode){
                    //     setIsDoubleClick(false)
                    // }
                }}
            >
                <span
                    style={{
                        display:isDoubleClick?`none`:`flex`,
                        alignItems:`center`,
                        justifyContent:`center`
                    }}
                >
                    {view.labelName}
                </span>

                <input
                    ref={inputRef}
                    className="text-white"
                    style={{
                        width:isDoubleClick?`100%`:`0%`,
                        opacity:isDoubleClick?`100%`:`0%`,
                        display:`flex`,
                        background:`none`,
                        justifyContent:`center`,
                        textAlign:`center`,
                        outline:`none`,
                        fontSize:`1.1rem`,
                        fontWeight:`400`,
                        border:`none`
                    }}
                    
                    onKeyDown={(e:any)=>{
                        if(e.code === 'Enter' || e.code === 'NumpadEnter'){
                            view.labelName = e.target.value
                            selectedProject.scenes = selectedProject.scenes.map(scene=>{
                                return {...scene,
                                    viewList:scene.viewList.map(v=>{
                                        if(v._id === view._id){
                                            return {...v,
                                                labelName:e.target.value
                                            }
                                        }
                                        else{
                                            return {...v}
                                        }
                                    })
                                }
                            })
                            setSelectedProject(prev=>{return {...prev}})
                            setIsDoubleClick(false)
                        }
                    }}
                />
 
                
            </div>
            {/* Triangle */}
            <div
                style={{
                    background:`${calloutColor}`,
                    width:`1rem`,
                    height:`1rem`,
                    position:`fixed`,
                    transform:`translateY(-1.5rem)`,
                    clipPath:`polygon(0% 0%, 100% 0%, 50% 100%)`
                }}
            />
        </div>
    );
}
 
export default Callout;