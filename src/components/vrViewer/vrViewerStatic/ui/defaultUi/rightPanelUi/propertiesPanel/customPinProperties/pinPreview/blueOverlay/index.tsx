import {useContext} from 'react';
import { PinPreviewContext } from '..';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/router';
import useFirebase from '@/hooks/firebase';
import axios from 'axios';
import _ from 'lodash';
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';
const BlueOverlay = () => {
    const {storage, db} = useFirebase()
    const router = useRouter()
    const {projectId} = router.query
    const {overlayRef, isMouseEnter, progress, setIsMouseEnter, setProgress} = useContext(PinPreviewContext)
    const {selectedCustomPinpoint} = useContext(VrViewerStaticContext)
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
                e.preventDefault()
                e.stopPropagation()
                setProgress(1)
                setIsMouseEnter(false)
                if(overlayRef.current){
                    overlayRef.current.style.pointerEvents = `none`
                }
                
                const files = e.dataTransfer.files
                if(files.length > 1) return toast.error('Only 1 file is accepted.')
                const image = files[0]
                const ext = image.name.split('.')[image.name.split('.').length -1]
                console.log(ext)
                if(!_.includes(['jpg','png'],ext)) return toast.error('Only jpg and png file accepted')
                const jpgName = image.name.split('.').slice(0,image.name.split('.').length -1).join('.')

                // Create div progress bar
                const id = v4()

                // Upload image to firebase
                const imageRef = ref(storage,`/pongovr/projects/${projectId}/thumbnail/${jpgName}-${id}.${ext}`)
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
                        const imageName = `${jpgName}-${id}.${ext}`
                        const url = `https://us-central1-pongoprojects-us.cloudfunctions.net/sharp`
                        const {data}= await axios.post(url,{
                            type:'resize',
                            imageUrl:imageUrl,
                            storagePath:`pongovr/projects/${projectId}/customPin/${imageName}`,
                            width:100,
                            method:`contain`,
                            quality:80,
                            format:ext
                        })
                        
                        selectedCustomPinpoint.imageUrl = data.resizedImageUrl
                        setProgress(0)
                        toast.success('Success change pinpoint.')
                    }
                )
                
            }}
        >
            Drop thumbnail here
        </div>
    );
}
 
export default BlueOverlay;