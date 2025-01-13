import {useContext} from 'react';
import { ProjectInfoContext } from '..';
import { v4 } from 'uuid';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import useFirebase from '@/hooks/firebase';
import axios from 'axios';
import { VrViewerDepthContext } from '../../..';
import { VrViewerContext } from '../../../..';

const BlueOverlay = () => {
    const {storage} = useFirebase()
    const router = useRouter()
    const {projectId} = router.query
    const {
        isMouseEnter, setIsMouseEnter,
        progress,setProgress, 
        overlayRef
    
    } = useContext(ProjectInfoContext)
    const {selectedProject, setSelectedProject} = useContext(VrViewerContext)
    return (  
        <div
            ref={overlayRef}
            className='bg-blue text-white'
            style={{
                pointerEvents:`none`,
                position:`absolute`,
                top:`0`,
                width:`100%`,
                height:`100%`,
                zIndex:`3`,
                opacity:isMouseEnter?`50%`:`0`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                fontSize:`2rem`,
                fontWeight:`600`,
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
                e.preventDefault()
                e.stopPropagation()
                setIsMouseEnter(false)
                if(overlayRef.current){
                    overlayRef.current.style.pointerEvents = `none`
                }

                const id = v4()
                const files = e.dataTransfer.files
                if(files.length > 1) return toast.error('Only 1 file is accepted')
                if(files[0].name.endsWith('.jpg') || files[0].name.endsWith('.png')){
                    const image = files[0]
                    const imageName = `${image.name.replace('.jpg','')}-${id}.jpg`

                    const imageRef = ref(storage,`/pongovr/projects/${projectId}/logo/${imageName}`)
                    const uploadTask = uploadBytesResumable(imageRef, image)

                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setProgress(progress)
                        }, 
                        (error) => {
                            // Handle unsuccessful uploads
                        }, 
                        async() => {
                            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref)  
                            //Compressed with tinyUrl
                            if(image.size > 1000000){
                                const {data}= await axios.post(`https://us-central1-pongoprojects-us.cloudfunctions.net/tinify`,{
                                    type:'compress',
                                    imageUrl:imageUrl,
                                    storagePath:`pongovr/projects/${projectId}/logo/${imageName}`,
                                })
                                const finalImageUrl = await getDownloadURL(ref(storage,`/pongovr/projects/${projectId}/logo/${imageName}`))
                                
                                selectedProject.globalSettings.logo.logoUrl = finalImageUrl
                            }       
                            else{
                                selectedProject.globalSettings.logo.logoUrl = imageUrl
                            }   
                            setSelectedProject(prev=>{return {...prev}})
                            setProgress(0)
                            toast.success('Success changing logo.')                
                        }
                    )
                }
                else{
                    toast.error('Only jpg or png file is accepted.')
                }
            }}
        >
            Drag and drop here.
        </div>
    );
}
 
export default BlueOverlay;