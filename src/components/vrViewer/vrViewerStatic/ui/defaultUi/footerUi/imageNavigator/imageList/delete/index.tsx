import DialogBox from '@/components/common/dialogBox';
import {useContext} from 'react'
import { ImageListContext } from '..';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import { IoIosClose } from 'react-icons/io';
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';

const Delete = () => {
    const {setSelectedProject, selectedProject, setShowDialogBox} = useContext(VrViewerContext)
    const {selectedScene} = useContext(VrViewerStaticContext)
    const {view} = useContext(ImageListContext)
    return (  
        <div
            className="text-red"
            style={{
                position:`absolute`,
                right:`0.5rem`,
                top:`0.5rem`,
                zIndex:`4`
                
            }}
            onClick={(e)=>{
                e.stopPropagation()
                console.log('yes')
                setShowDialogBox(
                    <DialogBox
                        description={`Are you sure want to delete view:${view.labelName}`}
                        onClick={()=>{

                            selectedScene.viewList = selectedScene.viewList.filter(v=>v._id !== view._id)
                            selectedProject.scenes = selectedProject.scenes.map(scene=>{
                                return {...scene,
                                    viewList:scene.viewList.filter(v=>v._id !== view._id)
                                }
                            })
                            setSelectedProject(prev=>{return {...prev}})
                            setShowDialogBox(<></>)
                        }}
                    />
                )
            }}
        >
            <IoIosClose
                size={35}
            />
        </div>
    );
}
 
export default Delete;