import { useContext, useEffect, useRef } from "react"
import { InfoPinpointContainerContext } from "../../../.."
import { VrViewerStaticContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerStatic"
import { PinpointsUiContext, isEditObject } from "../../../../.."
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer"

const Description = () => {
    const {findCustomPinpoint} = useContext(InfoPinpointContainerContext)
    const { selectedProject, setSelectedProject} = useContext(VrViewerContext)
    const {isEditorMode, currentView,selectedScene} = useContext(VrViewerStaticContext)
    const {isDragged,isEdit, setIsEdit,} = useContext(PinpointsUiContext)
    const {pin,  infoPadding, } = useContext(InfoPinpointContainerContext)
    const inputRef = useRef<HTMLTextAreaElement>(null as any)


    const getText = ()=>{
        if(pin.info.description === ''){
            return `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut tempore nostrum quae veniam fuga assumenda ea qui sequi excepturi voluptatum repellendus veritatis, ullam neque non, omnis voluptas deleniti magnam animi.`
        }
        else{
            return pin.info.description
        }
    }

    const handleEnter = (e:KeyboardEvent)=>{
        if(e.key === 'Enter' && isEdit.type === 'editDescription'){
            if(inputRef.current){
                // To Pin
                pin.info.description = inputRef.current.value

                // To Current View
                currentView.pinpoints = currentView.pinpoints.map(p=>{
                    if(p._id === pin._id){
                        return {...p,
                            info:{...p.info,
                                description:inputRef.current.value
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
                                        description:inputRef.current.value
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
                                                description:inputRef.current.value
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

                // Reset Edit State
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
                display:`flex`,
                flexWrap:`wrap`,
                fontSize:`${1 * (findCustomPinpoint.fontScale/100)}rem`
            }}
            onMouseUp={()=>{
                if(isEditorMode && isEdit.type !== 'editDescription' && !isDragged){
                    if(inputRef.current){
                        inputRef.current.value = pin.info.description
                        inputRef.current.focus()
                        setIsEdit({
                            pinId:pin._id,
                            type:'editDescription'
                        })
                    }
                }
            }}
        >
            <textarea
                ref={inputRef}
                onKeyDown={(e:any)=>{
                    handleEnter(e)
                }}
                style={{
                    width:`${pin.info.width - (infoPadding * 2)}px`,
                    height:`${100}px`,
                    display:isEdit.type === 'editDescription'?`initial`:`none`
                }}
                
            />
            {!(isEdit.type === 'editDescription')?
                getText()
            :null}
        
        </div>
    );
}
 
export default Description;