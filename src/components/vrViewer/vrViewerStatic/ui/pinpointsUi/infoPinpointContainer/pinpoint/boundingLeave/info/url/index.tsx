import { useContext, useEffect, useRef, useState } from "react";
import { InfoPinpointContainerContext } from "../../../..";
import { PinpointsUiContext, isEditObject } from "../../../../..";
import { VrViewerContext } from "@/components/vrViewer";
import { VrViewerStaticContext } from "@/components/vrViewer/vrViewerStatic";

const Url = () => {
    const {setSelectedProject,  selectedProject} = useContext(VrViewerContext)
    const {isEditorMode, currentView, selectedScene} = useContext(VrViewerStaticContext)
    const {isEdit, setIsEdit, isDragged} = useContext(PinpointsUiContext)
    const {pin, } = useContext(InfoPinpointContainerContext)
    const inputRef = useRef<HTMLInputElement>(null as any)
    const {findCustomPinpoint} = useContext(InfoPinpointContainerContext)

    const getText = ()=>{
        if(pin.info.url === ''){
            return `Dummy Url.`
        }
        else{
            return pin.info.url
        }
    }

    const [isHover, setIsHover] = useState(false)

    const handleEnter = (e:KeyboardEvent)=>{
        if(e.key === 'Enter' && isEdit.pinId === pin._id && isEdit.type === 'editUrl'){
            if(inputRef.current){
                // To Pin
                pin.info.url = inputRef.current.value

                // To Current View
                currentView.pinpoints = currentView.pinpoints.map(p=>{
                    if(p._id === pin._id){
                        return {...p,
                            info:{...p.info,
                                url:inputRef.current.value
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
                                        url:inputRef.current.value
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
                                                url:inputRef.current.value
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
            className="text-lightest-blue"
            style={{
                filter:isHover?`brightness(1.2)`:`none`,
                cursor:`pointer`,
                transition:`filter 0.1s`,
                fontSize:`${1 * (findCustomPinpoint.fontScale/100)}rem`
            }}
            onMouseEnter={()=>{
                setIsHover(true)
            }}
            onMouseLeave={()=>{
                setIsHover(false)
            }}
            onMouseUp={()=>{
                if(isEditorMode && isEdit.type !== 'editUrl' && !isDragged){
                    if(inputRef.current){
                        inputRef.current.value = pin.info.url
                        inputRef.current.focus()
                        setIsEdit({
                            pinId:pin._id,
                            type:'editUrl'
                        })
                    }
                }
                if(!isEditorMode){
                    open(pin.info.url, '_blank')
                }
                
            }}
        >
            <input
                onKeyDown={(e:any)=>{
                    handleEnter(e)
                }}
                style={{
                    display:isEdit.type === 'editUrl'?`initial`:`none`
                }}
                ref={inputRef}
            />
            {!(isEdit.type === 'editUrl')?
                getText()
            :null}
        </div>
    );
}
 
export default Url;