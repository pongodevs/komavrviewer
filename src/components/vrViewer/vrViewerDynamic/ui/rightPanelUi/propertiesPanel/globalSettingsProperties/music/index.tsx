import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {useContext} from 'react';
import {useState,useRef} from 'react';
import useFirebase from "@/hooks/firebase";
import { useRouter } from "next/router";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import _ from "lodash";
import { IoIosClose } from "react-icons/io";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

const Music = () => {
    const router =  useRouter()
    const {projectId} = router.query
    const {storage,db} = useFirebase()
    const {selectedProject, setSelectedProject} = useContext(VrViewerDynamicContext)
    const inputRef = useRef<HTMLDivElement>(null)
    const [progress, setProgress] = useState(0)
    return (  
        <div
            style={{
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                fontSize:`1.4rem`,
                height:`4rem`,
            }}
        >
            {progress == 0 && selectedProject.globalSettings.music.label === ''?
                <div
                    ref={inputRef}
                    style={{
                        fontWeight:`700`,
                        display:`flex`,
                        justifyContent:`center`,
                        alignItems:`center`
                    }}
                >
                    <input
                        type="file"
                        style={{
                            color:`transparent`,
                            width:`100%`
                        }}
                        onChange={(e:any)=>{
                            const id = v4()
                            const file = e.target.files[0]
                            const ext = file.name.split('.')[file.name.split('.').length - 1]
                            if(!_.includes(['mp3','wav'],ext)) return toast.error('File must be a mp3 or wav.')
                            const fileName = file.name.split('.').slice(0,file.name.split('.').length - 1).join('.')
                            const musicRef = ref(storage, `/pongovr/projects/${projectId}/music/${fileName}-${id}.${ext}`)
                            const uploadTask = uploadBytesResumable(musicRef,file)
                            uploadTask.on('state_changed', 
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                setProgress(progress)
                                const progressBarDiv = document.getElementById(`progress-bar-${id}`)
                                
                                if(progressBarDiv){
                                    progressBarDiv.style.width = `${progress}%`
                                    if(progress === 100){
                                        progressBarDiv.className= `bg-green`
                                    }
                                }

                            }, 
                            (error) => {
                                // Handle unsuccessful uploads
                            }, 
                            async() => {
                                const musicUrl = await getDownloadURL(uploadTask.snapshot.ref)
                                selectedProject.globalSettings.music.url = musicUrl
                                selectedProject.globalSettings.music.label = fileName
  
                                setSelectedProject(prev=>{return {...prev}})
                                setProgress(0)
                                toast.success('Success select music.')
                            }
                        )
                        }}
                    />
                </div>
            :null}
            {progress > 0?
                <>
                    {/* Progress bar */}
                    <div
                        style={{
                            width:`90%`,
                            margin:`0rem 1rem`,
                            height:`0.5rem`,
                            border:`0.3px solid grey`,
                            borderRadius:`25px`,
                            bottom:`0.5rem`,
                            overflow:`hidden`
                        }}
                    >
                        {/* Bar */}
                        <div
                            className={progress === 100? "bg-green" : "bg-blue"}
                            style={{
                                width:`${progress}%`,
                                height:`100%`,
                                borderRadius:`25px`
                            }}
                        >
                        </div>
                    </div>
                </>
            :null}
            {selectedProject.globalSettings.music.url !== '' && selectedProject.globalSettings.music.label !== ''?
                <div
                    style={{
                        fontSize:`1.2rem`,
                        fontWeight:`700`,
                        display:`flex`,
                        alignItems:`center`
                    }}
                >
                    <span>
                        {selectedProject.globalSettings.music.label}
                    </span>
                    <span
                        className="text-red"
                        onClick={()=>{
                            selectedProject.globalSettings.music.label = ''
                            selectedProject.globalSettings.music.url = ''
                            setSelectedProject(prev=>{return {...prev}})
                        }}
                    >
                        <IoIosClose
                            size={25}
                        />
                    </span>
                </div>
            :null}

        </div>
    );
}
 
export default Music;