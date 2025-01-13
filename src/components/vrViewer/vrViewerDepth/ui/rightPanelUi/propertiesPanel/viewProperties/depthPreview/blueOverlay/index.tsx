import {useContext} from 'react';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/router';
import useFirebase from '@/hooks/firebase';
import axios from 'axios';
import * as THREE from 'three'
import _ from 'lodash';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import { VrViewerDepthContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDepth';
import { isDesktop } from 'react-device-detect';
import { DepthPreviewContext } from '..';
import useDecoder from '@/hooks/decoder';

const BlueOverlay = () => {
    const {storage, db} = useFirebase()
    const router = useRouter()
    const {projectId} = router.query
    const {overlayRef, isMouseEnter, progress, setIsMouseEnter, setProgress} = useContext(DepthPreviewContext)
    const {selectedCustomPinpoint, isEditorMode, selectedScene,  currentView, setCurrentView, setIsUploading, mainMeshRef} = useContext(VrViewerDepthContext)
    const {setSelectedProject, selectedProject, textureLoader, setLoadedViews} = useContext(VrViewerContext)
    const {decode16BitPng} = useDecoder()
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
                    if(!_.includes(['png'],ext)) return toast.error('Only png file accepted')
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
                            const depthUrl = await getDownloadURL(uploadTask.snapshot.ref)
                            
                            const {macroTexture, microTexture} = await decode16BitPng(depthUrl)
                            macroTexture.magFilter = THREE.LinearFilter
                            macroTexture.minFilter = THREE.LinearFilter

                            microTexture.magFilter = THREE.LinearFilter
                            microTexture.minFilter = THREE.LinearFilter

                            // For Scene
                            selectedScene.viewList = selectedScene.viewList.map((view)=>{
                                if(view._id === currentView._id){
                                    return {...view,
                                        depthUrl:depthUrl,
                                        depthMacroTexture:macroTexture,
                                        depthMicroTexture:microTexture
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
                                                    depthUrl:depthUrl,
                                                    depthMacroTexture:macroTexture,
                                                    depthMicroTexture:microTexture
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
                                depthUrl:depthUrl,
                                depthMacroTexture:macroTexture,
                                depthMicroTexture:microTexture
                            }})

                            setLoadedViews(prev=>{
                                return prev.map(view=>{
                                    if(view._id === currentView._id){
                                        return {...view,
                                            depthUrl:depthUrl,
                                            depthMacroTexture:macroTexture,
                                            depthMicroTexture:microTexture
                                        }
                                    }
                                    else{
                                        return view
                                    }
                                })
                            })

                            // Change current texture
                            mainMeshRef.current.material.uniforms.depthMacro.value = macroTexture
                            mainMeshRef.current.material.uniforms.depthMicro.value = microTexture 
                            setSelectedProject(prev=>{return {...prev}})

                            setProgress(0)
                            setIsUploading(false)
                            toast.success('Success changing view.')
                        }
                    )
                }
                
            }}
        >
            Drop depth image here
        </div>
    );
}
 
export default BlueOverlay;