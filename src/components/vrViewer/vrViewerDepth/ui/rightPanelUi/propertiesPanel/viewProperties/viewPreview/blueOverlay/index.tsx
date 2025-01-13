import {useContext} from 'react';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/router';
import useFirebase from '@/hooks/firebase';
import axios from 'axios';
import { ViewPreviewContext } from '..';
import * as THREE from 'three'
import _ from 'lodash';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import { VrViewerDepthContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDepth';
import { isDesktop } from 'react-device-detect';

const BlueOverlay = () => {
    const {storage, db} = useFirebase()
    const router = useRouter()
    const {projectId} = router.query
    const {overlayRef, isMouseEnter, progress, setIsMouseEnter, setProgress} = useContext(ViewPreviewContext)
    const {selectedCustomPinpoint, isEditorMode, selectedScene,  currentView, setCurrentView, setIsUploading, mainMeshRef} = useContext(VrViewerDepthContext)
    const {setSelectedProject, selectedProject, textureLoader, loadedViews, setLoadedViews} = useContext(VrViewerContext)
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
                    if(!_.includes(['jpg'],ext)) return toast.error('Only jpg file accepted')
                    setIsUploading(true)
                    // Create div progress bar
                    const id = v4()
                    const imageName = `${image.name.replace(ext,'')}-${id}.${ext}`

                    // Upload image to firebase
                    const imageRef = ref(storage,`/pongovr/projects/${projectId}/render/${imageName}`)
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
                            const date = currentView.imageUrl4000.split('%2F')[3]
                            // First create 4000 px version
                            const path4000px = `pongovr/projects/${projectId}/${date}/scenes_compressed/4000px/${selectedScene.sceneName}/${imageName}`
                            const url4000px = (await axios.post(url,{
                                type:'resize',
                                imageUrl:imageUrl,
                                storagePath:path4000px,
                                method:`cover`,
                                width:4000,
                                height:2000,
                                quality:80,
                            })).data.resizedImageUrl

                            // Then create 6000 px version
                            const path6000px = `pongovr/projects/${projectId}/${date}/scenes_compressed/6000px/${selectedScene.sceneName}/${imageName}`

                            const url6000px= (await axios.post(url,{
                                type:'resize',
                                imageUrl:imageUrl,
                                storagePath:path6000px,
                                method:`cover`,
                                width:6000,
                                height:3000,
                                quality:80,
                            })).data.resizedImageUrl
                
                            
                            const texture = textureLoader.load(isDesktop? url6000px : url4000px)
                            texture.magFilter = THREE.LinearFilter
                            texture.minFilter = THREE.LinearFilter

                            const final4000pxUrl = await getDownloadURL(ref(storage,path4000px))
                            const final6000pxUrl = await getDownloadURL(ref(storage,path6000px))
                            const realImageName = image.name.replace(`.${ext}`,'')
                            
                            // For Scene
                            selectedScene.viewList = selectedScene.viewList.map((view)=>{
                                if(view._id === currentView._id){
                                    return {...view,
                                        labelName:realImageName,
                                        viewName:realImageName,
                                        imageUrl4000:final4000pxUrl,
                                        imageUrl6000:final6000pxUrl,
                                        texture:texture
                                    }
                                }
                                else{
                                    return view
                                }
                            })

                            // For Project
                            selectedProject.scenes = selectedProject.scenes.map(scene=>{
                                if(scene._id === selectedScene._id){
                                    return {...scene,
                                        viewList:scene.viewList.map(view=>{
                                            if(view._id === currentView._id){
                                                return {...view,
                                                    labelName:realImageName,
                                                    viewName:realImageName,
                                                    imageUrl4000:final4000pxUrl,
                                                    imageUrl6000:final6000pxUrl,
                                                    texture:texture
                                                }
                                            }
                                            else{
                                                return view
                                            }
                                        })
                                    }
                                }
                                else{
                                    return {...scene}
                                }
                            })

                            
                            // For current view
                            setCurrentView(prev=>{return {...prev,
                                labelName:realImageName,
                                viewName:realImageName,
                                imageUrl4000:final4000pxUrl,
                                imageUrl6000:final6000pxUrl,
                                texture:texture
                            }})

                            // Change current texture
                            mainMeshRef.current.material.uniforms.currentDiffuse.value = texture
                            setSelectedProject(prev=>{return {...prev}})

                            setLoadedViews(prev=>{
                                return prev.map(view=>{
                                    if(view._id === currentView._id){
                                        return {...view,
                                            labelName:realImageName,
                                            viewName:realImageName,
                                            imageUrl4000:final4000pxUrl,
                                            imageUrl6000:final6000pxUrl,
                                            texture:texture
                                        }
                                    }
                                    else{
                                        return view
                                    }
                                })
                            })

                            setProgress(0)
                            setIsUploading(false)
                            toast.success('Success changing view.')
                        }
                    )
                }
                
            }}
        >
            Drop image here
        </div>
    );
}
 
export default BlueOverlay;