import Button from "@/components/common/button";
import DialogBox from "@/components/common/dialogBox";
import { vrProjectObject } from "@/types/vrProjectType";
import axios from "axios";
import { useContext } from "react";
import { VrViewerContext} from '@/components/homepage/bodyContainer/vrViewer';

const DangerZoneProperties = () => {
    const {selectedProject,setShowDialogBox, setLoadingText} = useContext(VrViewerContext)
    return (  
        <div
            style={{
                display:`flex`,
                flexDirection:`column`,
                alignItems:`center`
            }}
        >
            <div
                style={{
                    fontSize:`1.6rem`,
                    fontWeight:`700`,
                    marginBottom:`2rem`,
                    marginTop:`2rem`
                }}
            >
                DANGER ZONE!!!
            </div>
            <Button
                label="Reset Project"
                onClick={()=>{
                    setShowDialogBox(
                        <DialogBox
                            description={`Are you sure want to reset this project? Once you proceed, this can't be undone.`}
                            onClick={async()=>{
                                setLoadingText('Resetting VR project...')
                                setTimeout(async ()=>{
                                    const res = await axios.post(`${location.origin}/api/dynamicVr/resetProject`,{
                                        projectId:selectedProject._id,
                                        defaultProject:vrProjectObject,
                                        currentProject:selectedProject
                                    })
                                    console.log(res)
                                    setShowDialogBox(<></>)
                                    location.reload()
                                },100)
                            }}
                        />
                    )
                }}
            />
        </div>
    );
}
 
export default DangerZoneProperties;