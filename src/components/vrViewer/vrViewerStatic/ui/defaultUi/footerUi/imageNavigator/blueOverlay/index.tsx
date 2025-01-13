import {useContext} from 'react';
import { ImageNavigatorContext } from '..';
import { toast } from 'react-toastify';
import { v4, v5 } from 'uuid';
import { getBytes, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/router';
import useFirebase from '@/hooks/firebase';
import axios from 'axios';
import * as THREE from 'three'
import _ from 'lodash';
import { SceneType, sceneObject, viewListObject } from '@/types/vrProjectType';
import { VrViewerStaticContext } from '../../../../..';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';

const date = new Date()

const BlueOverlay = () => {
    const router = useRouter()
    const {projectId} = router.query
    const {storage, db} = useFirebase()
    const {isMouseEnter, setIsMouseEnter, height, blueOverlayRef} = useContext(ImageNavigatorContext)
    const {selectedScene, setSelectedScene, isEditorMode} = useContext(VrViewerStaticContext)
    const {setSelectedProject, selectedProject} = useContext(VrViewerContext)

    const uploadDroppedFiles = async(files:any)=>{ 
        const jpgArray = Array.from(files).map((file:any)=>file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.jpeg') || file.name.endsWith('.webp'))
        // Check if all files is jpg
        if(!_.includes(jpgArray,false)){
            const promises = Array.from(files).map((image:any)=>{
                return new Promise((resolve, reject)=>{
                    // Create div progress bar
                    const id = v4()
                    const getImageName = ()=>{
                        if(image.name.endsWith('.jpg')){
                            return `${image.name.replace('.jpg','')}-${id}.jpg`
                        }
                        else if(image.name.endsWith('.png')){
                            return `${image.name.replace('.png','')}-${id}.png`
                        }
                        else if(image.name.endsWith('.jpeg')){
                            return `${image.name.replace('.jpeg','')}-${id}.jpg`
                        }
                        else if(image.name.endsWith('.webp')){
                            return `${image.name.replace('.webp','')}-${id}.png`
                        }
                        else{
                            return ''
                        }
                    }
                    const imageName = getImageName()
    
                    // Upload image to firebase
                    const imageRef = ref(storage,`/pongovr/projects/${projectId}/render/${imageName}`)
                    const uploadTask = uploadBytesResumable(imageRef, image)
    
                    const newView = {...viewListObject,
                        _id:id,
                        labelName:image.name.split('.')[0],
                        viewName:image.name.split('.')[0],
                    }
                    // For Scene
                    selectedScene.viewList = [...selectedScene.viewList, 
                        newView
                    ]
    
                    // For project
                    selectedProject.scenes = selectedProject.scenes.map(scene=>{
                        if(scene._id === selectedScene._id){
                            return {...selectedScene}
                        }
                        else{
                            return {...scene,
                                viewList:[...scene.viewList, newView]
                            }
                        }
                    })
    
    
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            // Handle on progress
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            // console.log(progress);
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
                            // Handle success
                            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref)
                            const url = `https://us-central1-pongoprojects-us.cloudfunctions.net/sharp`
    
                            // First create thumbnail
                            const result = await axios.post(url,{
                                type:'resize',
                                imageUrl:imageUrl,
                                storagePath:`pongovr/projects/${projectId}/thumbnail/${imageName}`,
                                width:400,
                                height:400,
                                method:'cover',
                                quality:50,
                            })
    
                            // Then compressed
                            const resultCompressUrl=(await axios.post(url,{
                                imageUrl:imageUrl,
                                type:'compress',
                                storagePath:`pongovr/projects/${projectId}/render/${imageName}`,
                                quality:80,
                            })).data.resizedImageUrl
             
                            const textureLoader = new THREE.TextureLoader()
                            const texture = textureLoader.load(resultCompressUrl)
                            texture.magFilter = THREE.LinearFilter
                            texture.minFilter = THREE.LinearFilter
                            
                            const findView = selectedScene.viewList.find(view=>view._id === id)
    
                            const finalImageUrl = await getDownloadURL(ref(storage,`pongovr/projects/${projectId}/render/${imageName}`))
                            const finalThumbnailUrl = await getDownloadURL(ref(storage,`pongovr/projects/${projectId}/thumbnail/${imageName}`))
                            
                            if(findView){
                                const newView = {...viewListObject,
                                    _id:id,
                                    imageUrl:finalImageUrl,
                                    labelName:image.name.split('.')[0],
                                    texture:texture,
                                    thumbnailUrl:finalThumbnailUrl,
                                    viewName:image.name.split('.')[0],
                                }
                                // For Scene
                                selectedScene.viewList = selectedScene.viewList.map((view)=>{
                                    if(view._id === id){
                                        return newView
                                    }
                                    else{
                                        return view
                                    }
                                })
    
                                // For Project
                                const notFound360ImageUrl ="https://firebasestorage.googleapis.com/v0/b/pongoprojects-us.appspot.com/o/pongovr%2Fimages%2Fnot-found-360.jpg?alt=media&token=cab11e5c-e912-48fe-b8c7-7d6f22f04f33&_gl=1*mv8qmj*_ga*MjEzMjg2OTg3Ni4xNjkyNjAxNjMy*_ga_CW55HF8NVT*MTY5NzcwMjM4NS4yMy4xLjE2OTc3MDM3MTAuNjAuMC4w"
                                const notFoundThumbnailUrl = "https://firebasestorage.googleapis.com/v0/b/pongoprojects-us.appspot.com/o/pongovr%2Fimages%2Fnot-found.jpg?alt=media&token=0d631c51-a948-4374-bee6-6580639bb14b&_gl=1*ic450p*_ga*MjEzMjg2OTg3Ni4xNjkyNjAxNjMy*_ga_CW55HF8NVT*MTY5NzcwMjM4NS4yMy4xLjE2OTc3MDM0NDUuNDIuMC4w"
                                selectedProject.scenes = selectedProject.scenes.map(scene=>{
                                    if(scene._id === selectedScene._id){
                                        return{...scene,
                                            viewList: scene.viewList.map((view)=>{
                                                if(view._id === id){
                                                    return newView
                                                }
                                                else{
                                                    return view
                                                }
                                            })
                                        }
                                    }
                                    else{
                                        // If not selected scene, add only placeholder as an image
                                        return{...scene,
                                            viewList: scene.viewList.map((view)=>{
                                                if(view._id === id){
                                                    return {...newView,
                                                        imageUrl:notFound360ImageUrl,
                                                        texture:textureLoader.load(notFound360ImageUrl),
                                                        thumbnailUrl:notFoundThumbnailUrl
                                                    }
                                                }
                                                else{
                                                    return view
                                                }
                                            })
                                        }
                                    }
                                })
    
                                //
                                toast.success(`Success adding view: ${getImageName()}.`)
                                resolve('Success')
                            }
                            else{
                                toast.error('This view already deleted, failed create view.')
                                reject('Error')
                            }
                        }
                    )
                })
                
            })

            // Wait for all promises
            const res = await Promise.all(promises)
            // setSelectedScene(prev=>{return {...prev}})
            setSelectedProject(prev=>{return {...prev}})
        }
        else{
            toast.error('All files must be either jpg or png')
        }
    }
    return (  
        <div
            ref={blueOverlayRef}
            className='text-white'
            style={{
                opacity:isMouseEnter?`100%`:`0%`,
                // opacity:`100%`,
                transition:`all 0.2s`,
                width:`100%`,
                height:`100%`,
                position:`absolute`,
                zIndex:`4`,
                background:`rgba(26,115,232,0.5)`,
                fontWeight:`600`,
                fontSize:`3rem`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                pointerEvents:`none`
            }}
            onDragLeave={(e)=>{
                console.log('DRAG LEAVE')
                if(isEditorMode){
                    e.preventDefault()
                    e.stopPropagation()
                    setIsMouseEnter(false)
                    if(blueOverlayRef.current){
                        blueOverlayRef.current.style.pointerEvents = `none`
                    }
                }
            }}
            onDragOver={(e)=>{
                if(isEditorMode){
                    e.preventDefault()
                    e.stopPropagation()
                }
            }}
            onDrop={(e:any)=>{
                if(isEditorMode){
                    e.preventDefault()
                    e.stopPropagation()
                    if(blueOverlayRef.current){
                        blueOverlayRef.current.style.pointerEvents = `none`
                    }
                    setIsMouseEnter(false)
                    const files = e.dataTransfer.files

                    if(selectedScene._id === ''){
                        toast.error('Please select a scene.')
                    }
                    else{
                        uploadDroppedFiles(files)
                    }
                }
            }}
        >
            {selectedScene?._id !== ''? `Drag & drop images here.`:`Please add scene first.`}
        </div>
    );
}
 
export default BlueOverlay;