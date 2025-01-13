import {useContext} from 'react';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/router';
import useFirebase from '@/hooks/firebase';
import axios from 'axios';
import { ViewPreviewContext } from '..';
import _ from 'lodash';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';

const BlueOverlay = () => {
    const {storage, db} = useFirebase()
    const router = useRouter()
    const {projectId} = router.query
    const {overlayRef, isMouseEnter, progress, setIsMouseEnter, setProgress} = useContext(ViewPreviewContext)
    const {selectedCustomPinpoint, isEditorMode, selectedScene,  currentView, setCurrentView, setIsUploading} = useContext(VrViewerStaticContext)
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    return (  
        <div
            ref={overlayRef}
            className='bg-blue'
            style={{
                position:`absolute`,
                width:`100%`,
                height:`100%`,
                zIndex:`4`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                opacity:isMouseEnter?`50%`:`0%  `,
                fontSize:`1.4rem`,
                fontWeight:`600`,
                pointerEvents:`none`,
                transition:`all 0.2s`
            }}
            onDragLeave={(e)=>{
                e.preventDefault()
                e.stopPropagation()
                setIsMouseEnter(false)
                if(overlayRef.current){
                    overlayRef.current.style.pointerEvents = `none`
                }
            }}
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
                                type:'resize',
                                imageUrl:imageUrl,
                                storagePath:`pongovr/projects/${projectId}/thumbnail/${imageName}`,
                                method:`cover`,
                                width:800,
                                height:400,
                                quality:50,
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
        >
            Drop thumbnail here
        </div>
    );
}
 
export default BlueOverlay;