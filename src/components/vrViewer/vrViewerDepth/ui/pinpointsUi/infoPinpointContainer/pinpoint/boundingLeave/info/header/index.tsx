import { useContext, useEffect, useRef, useState } from "react";
import { InfoPinpointContainerContext } from "../../../..";
import { PinpointsUiContext, isEditObject } from "../../../../..";
import { VrViewerDepthContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerDepth";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";

const Header = () => {
    const {findCustomPinpoint} = useContext(InfoPinpointContainerContext)
    const {selectedProject, setSelectedProject} = useContext(VrViewerContext)
    const {isEditorMode, currentView, selectedScene, } = useContext(VrViewerDepthContext)
    const {pin, } = useContext(InfoPinpointContainerContext)
    const inputRef = useRef<HTMLInputElement>(null as any)
    const {isDragged,isEdit, setIsEdit} = useContext(PinpointsUiContext)
    

    const getText = ()=>{
        if(pin.info.header === ''){
            return `Dummy Header.`
        }
        else{
            return pin.info.header
        }
    }

    const handleEnter = (e:KeyboardEvent)=>{
        if(e.key === 'Enter' && isEdit.pinId === pin._id && isEdit.type === 'editHeader'){
            if(inputRef.current){
                // To Pin
                pin.info.header = inputRef.current.value

                // To Current View
                currentView.pinpoints = currentView.pinpoints.map(p=>{
                    if(p._id === pin._id){
                        return {...p,
                            info:{...p.info,
                                header:inputRef.current.value
                            }
                        }
                    }
                    else{
                        return p
                    }
                })

                // To Selected Scene
                selectedScene.viewList = selectedScene.viewList.map(view=>{
                    return {...view,
                        pinpoints:view.pinpoints.map(p=>{
                            if(p._id === pin._id){
                                return {...p,
                                    info:{...p.info,
                                        header:inputRef.current.value
                                    }
                                }
                            }
                            else{
                                return p
                            }
                        })
                    }
                })

                // To Selected Project
                selectedProject.scenes = selectedProject.scenes.map(scene=>{
                    return {...scene,
                        viewList:scene.viewList.map(view=>{
                            return {...view,
                                pinpoints:view.pinpoints.map(p=>{
                                    if(p._id === pin._id){
                                        return {...p,
                                            info:{...p.info,
                                                header:inputRef.current.value
                                            }
                                        }
                                    }
                                    else{
                                        return p
                                    }
                                })
                            }
                        })
                    }
                })
                setSelectedProject(prev=>{return {...prev}})

                // Reset state
                setIsEdit(isEditObject)
            }
        }
        if(e.key === 'Escape'){
            setIsEdit(isEditObject)
        }
    }

    return (  
        <div
            style={{
                fontSize:`${1.8 * (findCustomPinpoint.fontScale/100)}rem`,
                fontWeight:`500`
            }}
            onMouseUp={()=>{
                if(isEditorMode && isEdit.type !== 'editHeader' && !isDragged){
                    if(inputRef.current){
                        inputRef.current.value = pin.info.header
                        inputRef.current.focus()
                        setIsEdit({
                            pinId:pin._id,
                            type:'editHeader'
                        })
                    }
                }
                
            }}
        >
            <input
                style={{
                    display:isEdit.type === 'editHeader'?`initial`:`none`
                }}
                ref={inputRef}
                onKeyDown={(e:any)=>{
                    handleEnter(e)
                }}
            />
            {!(isEdit.type === 'editHeader')?
                getText()
            :null}
        </div>
    );
}
 
export default Header;