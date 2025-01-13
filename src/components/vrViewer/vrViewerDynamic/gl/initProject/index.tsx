import { useRouter } from "next/router"
import { useEffect, useContext } from "react"
import * as THREE from 'three'

import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import { VrViewerContext} from '@/components/homepage/bodyContainer/vrViewer';
import { useXR } from "@react-three/xr";
import { useThree } from "@react-three/fiber";


const InitProject = () => {
    THREE.Cache.enabled = true;
    const {player:xrPlayer} = useXR()
    const {gl, scene, camera}= useThree()
    const {
        setCurrentView, setNextView, setMainGeometry, setSelectedScene,
        setDollHouseMaterial,
        setCenterPosition,
        clippingPlane,
        setDollHouseTexture,
        gltfLoader,
        currentView,
        cameraRig,
        setXrPlayer,
        setGl,
        setScene,
        setCamera,
        centerRig,
        setIsProjectInitialize,
        isProjectInitialize
    } = useContext(VrViewerDynamicContext)
    const {selectedProject, loadingManager} = useContext(VrViewerContext)
    

    useEffect(()=>{
        const initProject = async()=>{
            if(selectedProject.scenes.length > 0){
                // Init glb file if any
                const glbUrl = selectedProject.glbUrl
                gltfLoader.load(glbUrl, async(gltf:any)=>{
                    const mesh = gltf.scene.children[0]
                    setMainGeometry(mesh.geometry)
                    // Set Center Rig
                    const center = new THREE.Vector3().copy(mesh.geometry.boundingBox.min).add(mesh.geometry.boundingBox.max)
                    const centerPos = new THREE.Vector3().copy(center).multiplyScalar(0.5)
                    setCenterPosition(centerPos)
    
                    // Doll House
                    const dollHouseTexture = mesh.material.map
                    const dollHouseMaterial = new THREE.MeshBasicMaterial({
                        map:dollHouseTexture,
                        clippingPlanes:[clippingPlane]
                    })
                    setDollHouseTexture(dollHouseTexture)
                    setDollHouseMaterial(dollHouseMaterial)
                })
    
                // Select initial scene
                const initScene = selectedProject.scenes[0]
                setSelectedScene(initScene)
                
                const initView = initScene.viewList[0]
                setCurrentView(initView)
                setNextView(initView)     

                // Init three hooks
                setXrPlayer(xrPlayer)
                // Set other
                setGl(gl)
                setScene(scene)
                setCamera(camera)

                centerRig.add(cameraRig)
                cameraRig.add(camera)
                scene.add(centerRig)

                if(true){
                    (camera as any).fov = 100
                }

                camera.near = 0.01;
                camera.updateProjectionMatrix()

                camera.position.x = 0
                camera.position.y = 0
                camera.position.z = 0
                camera.rotation.order = 'YXZ';

                

                setIsProjectInitialize(true)
            }
        }
        
        initProject()
    },[selectedProject])

    useEffect(()=>{
        if(isProjectInitialize){
            // Init Camera
            const initPosition = new THREE.Vector3(currentView.position.x, currentView.position.y, currentView.position.z)
            cameraRig.position.x = initPosition.x
            cameraRig.position.y = initPosition.y
            cameraRig.position.z = initPosition.z 
        }
    },[isProjectInitialize])
 
    return (
        <>
        </>
    );
}
 
export default InitProject;