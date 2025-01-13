import DonutProgress from '@/components/common/donutProgress';
import useFirebase from '@/hooks/firebase';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, createContext, useContext, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import DragAndDropOverlay from '@/components/common/dragAndDropOverlay';
import _ from 'lodash';
import { VrViewerContext} from '@/components/homepage/bodyContainer/vrViewer';
import ProjectThumbnail from './projectThumbnail';
import BlueOverlay from './blueOverlay';
import { VrViewerDepthContext } from '../../../../..';

type ViewPreviewContextType = {
    overlayRef:any
    isMouseEnter:boolean,
    setIsMouseEnter:Dispatch<SetStateAction<boolean>>,
    progress:number,
    setProgress:Dispatch<SetStateAction<number>>,
}
export const ViewPreviewContext = createContext<ViewPreviewContextType>({} as ViewPreviewContextType)
const ViewPreview = () => {
    const {selectedCustomPinpoint, currentView, borderRadius, isEditorMode, setIsUploading} = useContext(VrViewerDepthContext)
    const {selectedProject, setSelectedProject} = useContext(VrViewerContext)
    const router = useRouter()
    const {projectId} = router.query
    const {storage} = useFirebase()
    const [isMouseEnter, setIsMouseEnter] = useState(false)
    const [progress, setProgress] = useState(0)
    const overlayRef = useRef<HTMLDivElement>(null)

    return (  
        <ViewPreviewContext.Provider
            value={{
                overlayRef,
                isMouseEnter, setIsMouseEnter,
                progress, setProgress
            }}
        >
            <div
                className="bg-dark-grey"
                style={{
                    margin:`1rem 0rem`,
                    width:`100%`,
                    aspectRatio:`2/1`,
                    borderRadius:borderRadius,
                    display:`flex`,
                    justifyContent:`center`,
                    alignItems:`center`,
                    position:`relative`
                }}
                onDragEnter={(e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                    setIsMouseEnter(true)
                    if(overlayRef.current){
                        overlayRef.current.style.pointerEvents = `all`
                    }
                }}
                onDragOver={(e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                    if(overlayRef.current){
                        overlayRef.current.style.pointerEvents = `all`
                    }
                }}
                
            >
                {/* <BlueOverlay/> */}
                <DragAndDropOverlay
                    isMouseEnter={isMouseEnter}
                    setIsMouseEnter={setIsMouseEnter}
                    overlayRef={overlayRef}
                    onDrop={(e:any)=>{
                        if(isEditorMode){
                            e.preventDefault()
                            e.stopPropagation()
                            if(overlayRef.current){
                                overlayRef.current.style.pointerEvents = `none`
                            }
                            setIsMouseEnter(false)
                            const files = e.dataTransfer.files
                            if(files.length > 1) return toast.error('Only 1 file is accepted.')
                            const image = files[0]
                            const ext = image.name.split('.')[image.name.split('.').length -1]
                            if(!_.includes(['jpg','png'],ext)) return toast.error('Only jpg and png file accepted')
                            setIsUploading(true)
                            // Create div progress bar
                            const id = v4()
                            const imageName = `${image.name.replace(ext,'')}-${id}.${ext}`
        
                            // Upload image to firebase
                            const imageRef = ref(storage,`/pongovr/projects/${projectId}/thumbnail/${imageName}`)
                            const uploadTask = uploadBytesResumable(imageRef, image)
          
                            uploadTask.on('state_changed', 
                                (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    setProgress(progress)
                                }, 
                                (error) => {
                                    // Handle unsuccessful uploads
                                    setIsUploading(false)
                                }, 
                                async() => {
                                    const imageUrl = await getDownloadURL(uploadTask.snapshot.ref)
                                    const url = `https://us-central1-pongoprojects-us.cloudfunctions.net/sharp`
                                    // First create thumbnail
                                    await axios.post(url,{
                                        type:'compress',
                                        imageUrl:imageUrl,
                                        storagePath:`pongovr/projects/${projectId}/thumbnail/${imageName}`,
                                        // method:`cover`,
                                        // width:800,
                                        // height:400,
                                        quality:80,
                                    })
        
                                    const finalThumbnailUrl = await getDownloadURL(ref(storage,`pongovr/projects/${projectId}/thumbnail/${imageName}`))
                                    // For Project
                                    selectedProject.projectThumbnail = finalThumbnailUrl
                                    
                                    setSelectedProject(prev=>{return {...prev}})
                                    setProgress(0)
                                    setIsUploading(false)
                                    toast.success('Success uploading thumbnail project.')
                                }
                            )
                        }
                    }}
                />
                {progress > 0?
                    <div
                        style={{
                            position:`absolute`,
                            width:`100%`,
                            height:`100%`,
                            display:`flex`,
                            justifyContent:`center`,
                            alignItems:`center`
                        }}
                    >
                        <DonutProgress
                            width='80%'
                            borderWidth='1rem'
                            progress={progress}
                        />
                    </div>
                :null}
                <ProjectThumbnail/>
                
            </div>
        </ViewPreviewContext.Provider>
    );
}
 
export default ViewPreview;