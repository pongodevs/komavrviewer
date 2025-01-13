import {useContext} from 'react'
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import { PinpointContext } from '..';
import { IoIosClose } from 'react-icons/io';
import { VrViewerDepthContext } from '../../../../..';

const Delete = () => {
    const {setSelectedProject, selectedProject} = useContext(VrViewerContext)
    const {isEditorMode, currentView, selectedScene} = useContext(VrViewerDepthContext)
    const {pin} = useContext(PinpointContext)
    return (  
        <>
            {isEditorMode?
                <div
                    className='text-red'
                    style={{
                        zIndex:`2`,
                        position:`absolute`,
                        right:`0`,
                        top:`0`
                    }}
                    onClick={()=>{
                        // Current View
                        currentView.pinpoints = currentView.pinpoints.filter(p=>p._id !== pin._id)

                        // Selected Project
                        selectedProject.scenes = selectedProject.scenes.map(scene=>{
                            return {...scene,
                                viewList:scene.viewList.map(view=>{
                                    return {...view,
                                        pinpoints:view.pinpoints.filter(p=>p._id !== pin._id)
                                    }
                                })
                            }
                        })
                        setSelectedProject(prev=>{return {...prev}})
                    }}
                >
                    <IoIosClose
                        size={35}
                    />
                </div>
            :null}
        </>
    );
}
 
export default Delete;