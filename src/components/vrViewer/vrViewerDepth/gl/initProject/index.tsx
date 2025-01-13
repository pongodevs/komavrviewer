import { useRouter } from "next/router"
import { useEffect, useContext } from "react"
import * as THREE from 'three'

import { VrViewerContext} from '@/components/homepage/bodyContainer/vrViewer';
import { VrViewerDepthContext } from "../..";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { useXR } from "@react-three/xr";
import { useThree } from "@react-three/fiber";
import useDecoder from "@/hooks/decoder";
import { isDesktop } from "react-device-detect";

const fontLoader = new FontLoader()

const InitProject = () => {
    THREE.Cache.enabled = true;
    const {player:xrPlayer} = useXR()
    const {gl, scene, camera} = useThree()
    const {
        setCurrentView, setNextView, setSelectedScene,
        setFontBold, setFontRegular,
        cameraRig, currentView,
        setXrPlayer,
        setGl,
        setScene,
        setCamera,
        mainMeshRef,
        dummyMeshRef,
        setIsProjectInitialize
    } = useContext(VrViewerDepthContext)
    const {selectedProject, loadingManager, textureLoader, setLoadedViews} = useContext(VrViewerContext)
    
    const {decode16BitPng} = useDecoder()

    useEffect(()=>{
        const initProject = async()=>{
            // Set XR
            setXrPlayer(xrPlayer)
            // Set other
            setGl(gl)
            setScene(scene)
            setCamera(camera)

            cameraRig.add(camera)
            scene.add(cameraRig)

            if(true){
                (camera as any).fov = 100
            }

            camera.near = 0.01;
            camera.updateProjectionMatrix()

            camera.position.x = 0
            camera.position.y = 0
            camera.position.z = 0
            camera.rotation.order = 'YXZ';
            

            if(selectedProject.scenes.length > 0){    
                // Select initial scene
                const initScene = {...selectedProject?.scenes[0]}
                setSelectedScene({...initScene})
                
                const firstView = {...initScene.viewList[0]}
                // Init first view
                const diffuseUrl = isDesktop? firstView.imageUrl6000: firstView.imageUrl4000
                const depth = await decode16BitPng(firstView.depthUrl)
                textureLoader.load(diffuseUrl, (diffuseTexture)=>{

                    mainMeshRef.current.material.uniforms.currentDiffuse.value = diffuseTexture
                    mainMeshRef.current.material.uniforms.nextDiffuse.value = diffuseTexture
                    mainMeshRef.current.material.uniforms.depthMacro.value = depth.macroTexture
                    mainMeshRef.current.material.uniforms.depthMicro.value = depth.microTexture
    
                    firstView.texture = diffuseTexture
                    firstView.depthMacroTexture = depth.macroTexture
                    firstView.depthMicroTexture = depth.microTexture
    
                    // Set Camera
                    if(selectedProject.scenes.length > 0){
                        const initPosition = new THREE.Vector3(firstView.position.x, firstView.position.y, firstView.position.z)
                        cameraRig.position.x = initPosition.x
                        cameraRig.position.y = initPosition.y
                        cameraRig.position.z = initPosition.z 
                    }
    
                    setLoadedViews(prev=>{return [...prev,firstView]})
    
                    setCurrentView(firstView)
                    setNextView(firstView)      
                    
                    setIsProjectInitialize(true)
                    
                })
            }


            // Load font
            fontLoader.load("/fonts/helvetiker_bold_typeface.json", (font)=>{
                setFontBold(font)
            })
            fontLoader.load("/fonts/helvetiker_regular_typeface.json", (font)=>{
                setFontRegular(font)
            })

        }
        
        initProject()
    },[])
 
    return (
        <>
        </>
    );
}
 
export default InitProject;