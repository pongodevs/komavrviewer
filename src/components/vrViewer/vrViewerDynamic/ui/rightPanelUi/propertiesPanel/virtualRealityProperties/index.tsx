import Input from "@/components/common/input";
import BlueOverlay from "../globalSettingsProperties/viewPreview/blueOverlay";
import { useContext, useRef, useState } from "react";
import useFirebase from "@/hooks/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import LoadingProgress from "./loadingProgress";
import { v4 } from "uuid";

const VirtualRealityProperties = () => {
    const {selectedProject, setSelectedProject} = useContext(VrViewerContext)
    const {storage, db} = useFirebase()
    const [data, setData] = useState({})
    const fileRef = useRef(null as any)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingProgress, setLoadingProgress] = useState(0)
    return (  
        <div
            className="text-white"
            style={{
                width:`100%`,
                display:`flex`,
                flexDirection:`column`,
                gap:`1rem`,
                justifyContent:`center`,
                alignItems:`center`
            }}
        >
            <div
                style={{
                    fontSize:`1.4rem`
                }}
            >
                {selectedProject.detailedGlbUrl !== ""? `You already have detailed GLB file` : `There's no detailed GLB file yet.`}
            </div>
            <input
                style={{
                    display:isLoading? 'none' : 'initial'
                }}
                ref={fileRef}
                type="file"
                onChange={(e)=>{
                    if(fileRef.current){
                        setIsLoading(true)
                        const glbFile = fileRef.current.files[0]
                        const storageRef = ref(storage, `pongovr/projects/${selectedProject._id}/detailedGlb/detailedGlb-${v4()}.glb`)
                        const uploadTask = uploadBytesResumable(storageRef, glbFile)

                        uploadTask.on('state_changed',
                            (snapshot)=>{
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload is ' + progress + '% done');
                                setLoadingProgress(progress)
                                switch (snapshot.state) {
                                case 'paused':
                                    console.log('Upload is paused');
                                    break;
                                case 'running':
                                    console.log('Upload is running');
                                    break;
                                }
                            },
                            (error)=>{
                                console.log("Error")
                            },
                            ()=>{
                                getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                                    console.log('File available at', downloadURL);
                                    // 
                                    const projectDoc = doc(db, 'vrProjects', selectedProject._id)
                                    setSelectedProject(prev=>{return {...prev,
                                        detailedGlbUrl:downloadURL
                                    }})
                                    await updateDoc(projectDoc,{
                                        detailedGlbUrl:downloadURL
                                    })
                                    setIsLoading(false)
                                    toast.success("Your detailed glb file uploaded.")
                                });
                            }
                        )
                    }
                }}
            />
            {isLoading?
                <LoadingProgress
                    progress={loadingProgress}
                />
            :null}
        </div>
    );
}
 
export default VirtualRealityProperties;