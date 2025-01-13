import useFirebase from '@/hooks/firebase';
import { uploadBytesResumable , ref, getDownloadURL, listAll, getBytes} from 'firebase/storage';
import { useRouter } from 'next/router';
import { useState, useRef, Dispatch, SetStateAction, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import {createContext} from 'react';
import ProgressBar from './progressBar';
import { doc, getDoc } from 'firebase/firestore';
import { VrProjectType } from '@/types/vrProjectType';
import _ from 'lodash';
import DragAndDropOverlay from '@/components/common/dragAndDropOverlay';
import { VrViewerContext } from '../..';


const dateNow = Date.now()
type DragDropZipFileContextType = {
    overlayRef:any,
    isMouseEnter:boolean, 
    setIsMouseEnter:Dispatch<SetStateAction<boolean>>
    uploadProgress:number, 
    setUploadProgress:Dispatch<SetStateAction<number>>,
    uploadProgressName:string, 
    setUploadProgressName:Dispatch<SetStateAction<string>>,
    extractedViewProgress:number,
    setExtractedViewProgress:Dispatch<SetStateAction<number>>,
    dateNow:number,
}
export const DragDropZipFileContext = createContext<DragDropZipFileContextType>({} as DragDropZipFileContextType)

type ListViewType = {
    sceneName:string,
    resolution:string,
    sceneTotal:number
}
const listViewInStorage = [] as ListViewType[]

const DragDropZipFile = () => {
    const {storage, db} = useFirebase()
    const router = useRouter()
    const {projectId} = router.query
    const [isMouseEnter, setIsMouseEnter] = useState(false)
    const overlayRef = useRef<HTMLDivElement>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadProgressName, setUploadProgressName] = useState('Initializing')
    const [isProcessingVr, setIsProccessingVr] = useState(false)
    const [enableDragAndDrop, setEnableDragAndDrop] = useState(false)
    const [extractedViewProgress, setExtractedViewProgress] = useState(0)
    const {setLoadingText}= useContext(VrViewerContext)

    const handleProcessVrProject = ()=>{
        setIsProccessingVr(true)
        setLoadingText('Proccessing VR project, this could take a several minutes...')
        setInterval(async()=>{
            const projectDoc = doc(db, 'vrProjects', projectId as string)
            const project = (await getDoc(projectDoc)).data() as VrProjectType
            if(project.scenes.length > 0){
                setTimeout(()=>{
                    setLoadingText('Your VR project ready, refreshing the page...')
                    router.reload()
                },3000)
            }
        },5 * 1000)
    }

    useEffect(()=>{
        if(extractedViewProgress === 100){
            handleProcessVrProject()
        }
    },[extractedViewProgress])

    // Interval every 1 secs, check the view that needs to be upload vs the extracted in storage
    useEffect(()=>{
        const myInterval = async()=>{
            try{
                console.log(dateNow)
                const metadataRef = ref(storage, `pongovr/projects/${projectId}/${dateNow}/metadata/main.json`)
                const arrayBuffer = await getBytes(metadataRef)
                const textDecoder = new TextDecoder('utf-8');
                const json = textDecoder.decode(arrayBuffer) as any
                const vrProject = JSON.parse(json) as VrProjectType
                if(vrProject.scenes.length > 0){
                    const sceneLength = vrProject.scenes.length 
                    const viewLength = vrProject.scenes[0].viewList.length
                    const viewTotal = sceneLength * viewLength
                    

                    // Get storage path
                    const sceneCompressedRef = ref(storage, `pongovr/projects/${projectId}/${dateNow}/scenes_compressed`)
                    const sceneCompressedList = await listAll(sceneCompressedRef)

                    sceneCompressedList.prefixes.forEach(async(resolutionPrefix)=>{
                        const resolutionRef = ref(storage, resolutionPrefix.fullPath)
                        const resolutionList = await listAll(resolutionRef)
                        resolutionList.prefixes.forEach(async(scenePrefix)=>{
                            const sceneRef = ref(storage, scenePrefix.fullPath)
                            const sceneList = await listAll(sceneRef)
                            // If already in there, change the scene total
                            const listSceneName = listViewInStorage.map(scene=>{return `${scene.resolution}-${scene.sceneName}`})
                            const checker = `${resolutionPrefix.name}-${scenePrefix.name}`
                            if(_.includes(listSceneName, checker)){
                                const index = listSceneName.indexOf(checker)
                                if(index !== -1){
                                    listViewInStorage[index].sceneTotal = sceneList.items.length
                                }
                            }
                            // If not, push a new object
                            else{
                                console.log('PUSH')
                                const ob = {
                                    sceneName: scenePrefix.name,
                                    resolution: resolutionPrefix.name,
                                    sceneTotal: sceneList.items.length
                                }
                                console.log(ob)
                                listViewInStorage.push(ob)
                            }
                        })
                    })  

                    const totalExtractedView = viewTotal * 2
                    const currentExtractedView = listViewInStorage.map(listView=>{return Number(listView.sceneTotal)}).reduce((a,b)=>{return a + b})
                    const extractedProgress = currentExtractedView/totalExtractedView * 100
                    setExtractedViewProgress(extractedProgress)
                    if(Math.round(extractedProgress) > 1){
                        setUploadProgressName('Extracting all files into VR Projects. You can close this page and come back later.')
                        setUploadProgress(100)
                    }
                }
            }
            catch(err){
                setEnableDragAndDrop(true)
                console.log('Error')
            }
        }

        myInterval()
        const interval = setInterval(myInterval,1000)

        return()=>{
            clearInterval(interval)
        }
    },[])
  
    return (  
        <DragDropZipFileContext.Provider
            value={{
                overlayRef,
                isMouseEnter, setIsMouseEnter,
                uploadProgress, setUploadProgress,
                uploadProgressName, setUploadProgressName,
                extractedViewProgress, setExtractedViewProgress,
                dateNow
            }}
        >
            <div
                className="bg-darker-grey text-white"
                style={{
                    width:`100%`,
                    height:`100%`,
                    display:`flex`,
                    justifyContent:`center`,
                    alignItems:`center`,
                    position:`fixed`,
                    zIndex:`4`,
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
                }}
            >
                <div
                    style={{
                        fontSize:`1.4rem`,
                        fontWeight:`500`,
                        width:`100%`,
                        display:`flex`,
                        justifyContent:`center`,
                        alignItems:`center`
                    }}
                >
                    {isProcessingVr?
                        <>
                            {`Your project is being initialized. You can close this page and come back later.`}
                        </>
                    :
                        uploadProgress > 0 || extractedViewProgress > 0?
                            <ProgressBar/>
                        :
                            <>
                                {enableDragAndDrop?
                                    `Drag and Drop .zip file here`
                                :
                                    ``
                                }
                            </>
                    }
                </div>
            </div>
            {enableDragAndDrop?
                <DragAndDropOverlay
                    isMouseEnter={isMouseEnter}
                    setIsMouseEnter={setIsMouseEnter}
                    onDrop={(e:any)=>{
                        e.preventDefault()
                        e.stopPropagation()
                        setUploadProgress(1)
                        setIsMouseEnter(false)
                        if(overlayRef.current){
                            overlayRef.current.style.pointerEvents = `none`
                        }
                        const file = e.dataTransfer.files[0]
                        console.log(file)
                        console.log(file.size)
                        if(file.size > 500000000){
                            return toast.error('File size too large, maximum size only 500 mb.')
                        }
                        if(file.type !== 'application/x-zip-compressed'){
                            return toast.error('File must be zip.')
                        }
                        const storageRef = ref(storage, `pongovr/projects/${projectId}/${dateNow}/${projectId}-dynamic.zip`)
                        const uploadTask = uploadBytesResumable(storageRef, file);
                        uploadTask.on('state_changed', 
                            (snapshot) => {
                                // Observe state change events such as progress, pause, and resume
                                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload is ' + progress + '% done');
                                setUploadProgress(progress)
                                setUploadProgressName('Uploading in proccess, do not close this page.')
                                switch (snapshot.state) {
                                case 'paused':
                                    console.log('Upload is paused');
                                    break;
                                case 'running':
                                    console.log('Upload is running');
                                    break;
                                }
                            }, 
                            (error) => {
                                // Handle unsuccessful uploads
                                console.error(error)
                            }, 
                            () => {
                                // Handle successful uploads on complete
                                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                console.log('File available at', downloadURL);
                                });
                            }
                        );
                        
                    }}
                    overlayRef={overlayRef}
                />
            :null}
        </DragDropZipFileContext.Provider>
    );
}
 
export default DragDropZipFile;