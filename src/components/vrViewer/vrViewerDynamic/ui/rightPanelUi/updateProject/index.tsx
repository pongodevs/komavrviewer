import Button from "@/components/common/button";
import {useContext} from 'react';
import { doc, setDoc } from "firebase/firestore";
import useFirebase from "@/hooks/firebase";
import { toast } from "react-toastify";
import DialogBox from "@/components/common/dialogBox";
import { VrViewerContext } from "../../../..";

const UpdateProject = () => {
    const {selectedProject,setShowDialogBox, setLoadingText} = useContext(VrViewerContext)
    const {db} = useFirebase()
    return (  
        <div
            style={{
                width:`calc(100% - 4rem)`,
                position:`absolute`,
                bottom:`0`,
                display:`flex`,
                flexDirection:`column`,
                justifyContent:`center`,
                alignItems:`center`,
                padding:`2rem`
            }}
        >
            <Button
                label="Update Project"
                onClick={async()=>{
                    const newProject = {...selectedProject,
                        scenes:selectedProject.scenes.map((scene,index)=>{
                            return {...scene,
                                viewList:scene.viewList.map(view=>{
                                    return {...view,
                                        texture:''
                                    }
                                })
                            }
                        })
                    }
                    console.log(newProject)
                    setShowDialogBox(
                        <DialogBox
                            description={'Are you sure want to update project?'}
                            onClick={async()=>{
                                setLoadingText('Updating VR project...')
                                const projectDoc = doc(db, 'vrProjects', selectedProject._id)
                                await setDoc(projectDoc, newProject)
                                toast.success('Successfully update project')
                                setShowDialogBox(<></>)
                                setLoadingText('')
                            }}
                        />
                    )
                    
                }}
            />
        </div>
    );
}
 
export default UpdateProject;