import { useRouter } from "next/router"
import { useEffect, useContext, useState } from "react"
import {doc, getDoc} from 'firebase/firestore'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import useFirebase from '@/hooks/firebase/index';
import { SceneType, ViewListType, VrProjectType, viewListObject } from "@/types/vrProjectType"
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { VrViewerStaticContext } from "../.."
import { VrViewerContext } from "../../.."
import { useThree } from "@react-three/fiber"
import { isDesktop } from "react-device-detect"


const fontLoader = new FontLoader()

const InitProject = () => {
    THREE.Cache.enabled = true;
    const {gl, scene, camera} = useThree()
    const router = useRouter()
    const {db} = useFirebase()
    const {mainMeshRef,setCurrentView, setNextView, setMainGeometry, setSelectedScene,
        setSelectedMap, setSelectedPinpoint, isGameStart,
        setFontBold, setFontRegular, setFontLight,
        setIsXrMode, setGl, setScene, setCamera,
        cameraRig,
        setIsProjectInitialize,
        isEditorMode
    } = useContext(VrViewerStaticContext)

    const {setSelectedProject,selectedProject, loadingManager,currentView} = useContext(VrViewerContext)
    const textureLoader = new THREE.TextureLoader(loadingManager)

    const {startIndex, projectId} = router.query

    useEffect(()=>{
        const initProject = async()=>{
            if(!isEditorMode){

                // Init Use three hooks
                if(gl && setGl){
                    setGl(gl)
                }
                if(setScene){
                    setScene(scene)
                }
                if(setCamera){
                    setCamera(camera)
                }
                cameraRig.add(camera)
                scene.add(cameraRig)
        
                const isPotrait = innerWidth < innerHeight
                const isLandscape = innerWidth > innerHeight
                if(isPotrait && isDesktop){
                    (camera as any).fov = 100
                }
                if(isLandscape && isDesktop){
                    (camera as any).fov = 100
                }
        
                if(isPotrait && !isDesktop){
                    (camera as any).fov = 100
                }
                if(isLandscape && !isDesktop){
                    (camera as any).fov = 100
                }
                
                camera.near = 0.01;
                camera.updateProjectionMatrix()
        
                camera.position.x = 0
                camera.position.y = 0
                camera.position.z = 0
                camera.rotation.order = 'YXZ';
                
                gl.outputEncoding = THREE.sRGBEncoding
        
                gl.xr.addEventListener( 'sessionend', function ( event ) {
                    cameraRig.position.x = 0
                    cameraRig.position.y = 0
                    cameraRig.position.z = 0
            
                    setIsXrMode(false)
                });
    
                // Init first scene
                if(selectedProject.scenes.length > 0){
                    setSelectedScene(selectedProject.scenes[0])
                }
                
                // If there's no scene
                if(selectedProject.scenes.length  === 0 || selectedProject.scenes[0].viewList.length === 0){
                    // Set init texture
                    const texture = textureLoader.load('https://firebasestorage.googleapis.com/v0/b/pongoprojects-us.appspot.com/o/pongovr%2Fimages%2Fnot-found-360.jpg?alt=media&token=cab11e5c-e912-48fe-b8c7-7d6f22f04f33')
                    texture.magFilter = THREE.LinearFilter
                    texture.minFilter = THREE.LinearFilter
    
                    mainMeshRef.current.material.uniforms.currentTexture.value = texture
                    setCurrentView(
                        {...viewListObject,
                            texture:texture
                        }
                    )
                    setNextView(
                        {...viewListObject,
                            texture:texture
                        }
                    )
                }
                else{
                    const firstViewIndexPriority =  startIndex ? startIndex : 0 as any
            
                    // Load the rest of view
                    const initScene = selectedProject?.scenes[0]
                    const initView = initScene.viewList[firstViewIndexPriority]
                    
                    // Set maps if any
                    if(selectedProject.maps.length > 0){
                        const initMap = selectedProject.maps[0]
                        setSelectedMap(initMap)
                        const findPin = initMap.pinpoints.find(pin=>pin.toViewId === initView._id)
                        if(findPin){
                            setSelectedPinpoint(findPin)
                        }
                    }
        
    
                    // Set scene
                    setSelectedScene(initScene)
                    //Set current view
                    setCurrentView(initView)
                    //Set next view
                    setNextView(initView)
                }
                // Init camera
                if(selectedProject){
                    if(currentView.fov > 0){
                        (camera as any).fov = currentView.fov
                    }
                    const initPosition = new THREE.Vector3(currentView.position.x, currentView.position.y, currentView.position.z)
                    cameraRig.position.x = initPosition.x
                    cameraRig.position.y = initPosition.y
                    cameraRig.position.z = initPosition.z 
                }
    
                // Load font
                fontLoader.load("/fonts/helvetiker_bold_typeface.json", (font)=>{
                    setFontBold(font)
                })
                fontLoader.load("/fonts/helvetiker_regular_typeface.json", (font)=>{
                    setFontRegular(font)
                })
    
                setIsProjectInitialize(true)
            }
        }
        
        initProject()
    },[selectedProject])
 
    return (null);
}
 
export default InitProject;