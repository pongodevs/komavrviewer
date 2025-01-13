import { useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { InfoPinpointContainerContext } from "../../../../../..";
import { ImageInfoContext } from "..";
import { VrViewerStaticContext } from "@/components/vrViewer/vrViewerStatic";
import { VrViewerContext } from "@/components/vrViewer";

const Delete = () => {
    const {setSelectedProject,  selectedProject, selectedScene} = useContext(VrViewerContext)
    const {currentView} = useContext(VrViewerStaticContext)
    const {pin} = useContext(InfoPinpointContainerContext)
    const {image} = useContext(ImageInfoContext)
    return (  
        <div
            className="text-red"
            style={{
                position:`absolute`,
                zIndex:1,
                top:0,
                right:0
            }}
            onClick={()=>{
                // For view
                currentView.pinpoints = currentView.pinpoints.map(p=>{
                    if(p._id === pin._id){
                        return {...p,
                            info:{...p.info,
                                images:{...p.info.images,
                                    imageList:p.info.images.imageList.filter((i)=>{return i._id !== image._id})
                                }
                            }
                        }
                    }
                    else{
                        return {...p}
                    }
                })

                // For Selected Scene
                selectedScene.viewList = selectedScene.viewList.map(view=>{
                    return {...view,
                        pinpoints:view.pinpoints.map(p=>{
                            if(p._id === pin._id){
                                return {...p,
                                    info:{...p.info,
                                        images:{...p.info.images,
                                            imageList:p.info.images.imageList.filter((i)=>{return i._id !== image._id})
                                        }
                                    }
                                }
                            }
                            else{
                                return {...p}
                            }
                        })
                    }
                })

                // For Project
                selectedProject.scenes = selectedProject.scenes.map(scene=>{
                    return {...scene,
                        viewList:scene.viewList.map(v=>{
                            return {...v,
                                pinpoints:v.pinpoints.map(p=>{
                                    if(p._id === pin._id){
                                        return {...p,
                                            info:{...p.info,
                                                images:{...p.info.images,
                                                    imageList:p.info.images.imageList.filter((i)=>{return i._id !== image._id})
                                                }
                                            }
                                        }
                                    }
                                    else{
                                        return {...p}
                                    }
                                })
                            }
                        })
                    }
                })
                setSelectedProject(prev=>{return {...prev}})
            }}
        >
            <IoMdClose
                size={20}
            />
        </div>
    );
}
 
export default Delete;