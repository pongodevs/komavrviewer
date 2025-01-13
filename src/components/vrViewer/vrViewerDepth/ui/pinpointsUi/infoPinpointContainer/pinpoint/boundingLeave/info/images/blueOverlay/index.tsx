import {useContext, useState} from 'react';
import { toast } from 'react-toastify';
import { v4, v5 } from 'uuid';
import { getBytes, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/router';
import useFirebase from '@/hooks/firebase';
import axios from 'axios';
import _ from 'lodash';
import { ImagesContext } from '..';
import { InfoPinpointContainerContext } from '../../../../..';
import { ImageInfoType } from '@/types/vrProjectType';
import { PinpointsUiContext } from '../../../../../..';
import { VrViewerDepthContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDepth';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';


const BlueOverlay = () => {
    const router = useRouter()
    const {projectId} = router.query
    const {storage, db} = useFirebase()
    const {isMouseEnter, setIsMouseEnter, blueOverlayRef, imageContainerRef} = useContext(ImagesContext)
    const {selectedScene, setSelectedScene, isEditorMode, currentView, setCurrentView, setIsUploading} = useContext(VrViewerDepthContext)
    const {setSelectedProject, selectedProject} = useContext(VrViewerContext)
    const {pin} = useContext(InfoPinpointContainerContext)
    const {isEdit, setIsEdit} = useContext(PinpointsUiContext)

    const uploadDroppedFiles = async(files:any)=>{ 
        const jpgArray = Array.from(files).map((file:any)=>file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.jpeg') || file.name.endsWith('.webp')) 
        // Check if all files is jpg
        if(!_.includes(jpgArray,false)){
            if(isEdit.pinId === pin._id) return
            setIsUploading(true)
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
                    const imageRef = ref(storage,`/pongovr/projects/${projectId}/additionalImages/${imageName}`)
                    const uploadTask = uploadBytesResumable(imageRef, image)

                    const newImage:ImageInfoType = {
                        _id:id,
                        url:''
                    }
                    
                    // For Pin
                    // pin.info.images.imageList = [...pin.info.images.imageList,
                    //     newImage
                    // ]

                    // For Current View
                    currentView.pinpoints = currentView.pinpoints.map((p)=>{
                        if(p._id === pin._id){
                            return {...p,
                                info:{...p.info,
                                    images:{...p.info.images,
                                        imageList:[...p.info.images.imageList,
                                            newImage
                                        ]
                                    }
                                }
                            }
                        }
                        else{
                            return {...p}
                        }
                    })

                    // For Selected Scene
                    selectedScene.viewList = selectedScene.viewList.map(view=>{
                        return {...view,
                            pinpoints:view.pinpoints.map((p)=>{
                                if(p._id === pin._id){
                                    return {...p,
                                        info:{...p.info,
                                            images:{...p.info.images,
                                                imageList:[...p.info.images.imageList,
                                                    newImage
                                                ]
                                            }
                                        }
                                    }
                                }
                                else{
                                    return {...p}
                                }
                            })
                        }
                    })

                    // For Selected Project
                    selectedProject.scenes = selectedProject.scenes.map(scene=>{
                        return {...scene,
                            viewList: scene.viewList.map(view=>{
                                return {...view,
                                    pinpoints:view.pinpoints.map((p)=>{
                                        if(p._id === pin._id){
                                            return {...p,
                                                info:{...p.info,
                                                    images:{...p.info.images,
                                                        imageList:[...p.info.images.imageList,
                                                            newImage
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                        else{
                                            return {...p}
                                        }
                                    })
                                }
                            })
                        }
                    })

                    // setSelectedScene(prev=>{return {...prev}})
                    setIsEdit(prev=>{return {...prev}})
                    
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
    
                            // Then compressed
                            const resultCompressUrl=(await axios.post(url,{
                                imageUrl:imageUrl,
                                type:'compress',
                                storagePath:`pongovr/projects/${projectId}/render/${imageName}`,
                                quality:80,
                            })).data.resizedImageUrl
                            

                            // For Pin
                            // pin.info.images.imageList = pin.info.images.imageList.map(image=>{
                            //     if(image._id === id){
                            //         return {
                            //             _id:id,
                            //             url:resultCompressUrl
                            //         }
                            //     }
                            //     else{
                            //         return image
                            //     }
                            // })

                            // For Current View
                            currentView.pinpoints = currentView.pinpoints.map((p)=>{
                                if(p._id === pin._id){
                                    return {...p,
                                        info:{...p.info,
                                            images:{...p.info.images,
                                                imageList: p.info.images.imageList.map(image=>{
                                                    if(image._id === id){
                                                        return {
                                                            _id:id,
                                                            url:resultCompressUrl
                                                        }
                                                    }
                                                    else{
                                                        return image
                                                    }
                                                })
                                            }
                                        }
                                    }
                                }
                                else{
                                    return {...p}
                                }
                            })

                            // Selected scene
                            selectedScene.viewList = selectedScene.viewList.map(view=>{
                                return {...view,
                                    pinpoints:view.pinpoints.map((p)=>{
                                        if(p._id === pin._id){
                                            return {...p,
                                                info:{...p.info,
                                                    images:{...p.info.images,
                                                        imageList: p.info.images.imageList.map(image=>{
                                                            if(image._id === id){
                                                                return {
                                                                    _id:id,
                                                                    url:resultCompressUrl
                                                                }
                                                            }
                                                            else{
                                                                return image
                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                        else{
                                            return {...p}
                                        }
                                    })
                                }
                            })

                            // For Project
                            selectedProject.scenes = selectedProject.scenes.map(scene=>{
                                return {...scene,
                                    viewList: scene.viewList.map(view=>{
                                        return {...view,
                                            pinpoints:view.pinpoints.map((p)=>{
                                                if(p._id === pin._id){
                                                    return {...p,
                                                        info:{...p.info,
                                                            images:{...p.info.images,
                                                                imageList: p.info.images.imageList.map(image=>{
                                                                    if(image._id === id){
                                                                        return {
                                                                            _id:id,
                                                                            url:resultCompressUrl
                                                                        }
                                                                    }
                                                                    else{
                                                                        return image
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    }
                                                }
                                                else{
                                                    return {...p}
                                                }
                                            })
                                        }
                                    })
                                }
                            })

                            // setSelectedScene(prev=>{return {...prev}})
                            setIsEdit(prev=>{return {...prev}})
                            resolve('success')
                        }
                    )
                })
                
            })

            // Wait for all promises
            const res = await Promise.all(promises)
            setTimeout(()=>{
                console.log("TIMEOUT")
                // setSelectedProject(prev=>{return {...prev}})
                setIsUploading(false)
                setIsEdit(prev=>{return {...prev}})
            },100)
        }
        else{
            toast.error('All files must be either jpg or png')
        }
    }

    const getWidth = ()=>{
        if(imageContainerRef.current){
            const bound = imageContainerRef.current.getBoundingClientRect()
            return `${imageContainerRef.current.scrollWidth}px`
        }
        else{
            return `100%`
        }
    }
    return (  
        <div
            ref={blueOverlayRef}
            className='text-white'
            style={{
                opacity:isMouseEnter?`100%`:`0%`,
                transition:`all 0.2s`,
                width:getWidth(),
                height:`100%`,
                position:`absolute`,
                left:0,
                right:0,
                zIndex:`4`,
                background:`rgba(26,115,232,0.5)`,
                fontWeight:`600`,
                fontSize:`1.2rem`,
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