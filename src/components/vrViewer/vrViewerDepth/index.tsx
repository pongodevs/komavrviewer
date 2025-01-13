import { createContext, Dispatch, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import DragDropZipFile from "./dragDropZipFile";
import { VrViewerContext } from "..";
import { customPinpointObject, CustomPinpointType, mapObject, MapType, pinpointObject, PinpointType, playerObject, PlayerType, pointerObject, PointerType, SceneType, touchesObject, TouchesType, viewListObject, ViewListType } from "@/types/vrProjectType";
import Ui from "./ui";
import { Camera, Canvas, MeshProps, ThreeElements } from "@react-three/fiber";
import Gl from "./gl";
import * as THREE from 'three'
import { isDesktop } from "react-device-detect";
import useAnimation from "@/hooks/animation";
import _ from "lodash";
import WindowEvent from "./windowEvent";
import useDecoder from "@/hooks/decoder";

type ZoomType = {
    zoomSpeed:number
}

interface ParallaxTeleportFunction {
    (view: ViewListType, duration: number): void;
}
interface XrTeleportFunction {
    (view: ViewListType): void;
}
interface ShowInstructionFunction {
    (text:string, duration:number):void;
}

type MouseType = {
    isMouseDown:boolean,
    isMouseMove:boolean,
    isClicked: boolean,
    location: THREE.Vector2,
    movement: THREE.Vector2,
}


type VrViewerDepthContextType = {
    currentView:ViewListType, 
    setCurrentView:Dispatch<SetStateAction<ViewListType>>,
    nextView:ViewListType, 
    setNextView:Dispatch<SetStateAction<ViewListType>>,
    camera:Camera,
    setCamera:Dispatch<SetStateAction<Camera>>,
    cameraRig:THREE.Group,
    setCameraRig:Dispatch<SetStateAction<THREE.Group>>,
    mouse:MouseType,
    setMouse:Dispatch<SetStateAction<MouseType>>,
    selectedScene:SceneType, 
    setSelectedScene:Dispatch<SetStateAction<SceneType>>,
    scene:any,
    setScene:Dispatch<SetStateAction<any>>,
    gl:any,
    setGl:Dispatch<SetStateAction<any>>,
    xrPlayer:any,
    setXrPlayer:Dispatch<SetStateAction<any>>,
    isXrMode:boolean, 
    setIsXrMode:Dispatch<SetStateAction<boolean>>,
    masterContainerRef:any,
    player:PlayerType, 
    setPlayer:Dispatch<SetStateAction<PlayerType>>,
    enableZoom:boolean, 
    setEnableZoom:Dispatch<SetStateAction<boolean>>,
    zoomState:ZoomType, 
    setZoomState:Dispatch<SetStateAction<ZoomType>>,
    touches:TouchesType,
    setTouches:Dispatch<SetStateAction<TouchesType>>,
    showUi:boolean, 
    setShowUi:Dispatch<SetStateAction<boolean>>,
    isFullscreen:boolean, 
    setIsFullscreen:Dispatch<SetStateAction<boolean>>,
    touchCount:number, 
    setTouchCount:Dispatch<SetStateAction<number>>,
    startTouchDistance:number, 
    setStartTouchDistance:Dispatch<SetStateAction<number>>,
    previousFov:number,  
    setPreviousFov:Dispatch<SetStateAction<number>>,
    enableOrbitControl:boolean, 
    setEnableOrbitControl:Dispatch<SetStateAction<boolean>>,
    mainMeshRef:any | MeshProps,
    dummyMeshRef:any,
    teleportCirclesRef:any,
    pointer:PointerType, 
    setPointer:Dispatch<SetStateAction<PointerType>>,
    gazedViewId:string, 
    setGazedViewId:Dispatch<SetStateAction<string>>,
    parallaxTeleport:ParallaxTeleportFunction,
    xrTeleport:XrTeleportFunction,
    isEditorMode:boolean, 
    setIsEditorMode:Dispatch<SetStateAction<boolean>>,
    isAutoplay:boolean, 
    setIsAutoplay:Dispatch<SetStateAction<boolean>>,
    enableDoc:boolean, 
    setEnableDoc:Dispatch<SetStateAction<boolean>>,
    isTeleportCirclesEnable:boolean, 
    setIsTeleportCirclesEnable:Dispatch<SetStateAction<boolean>>,
    instructionRef:any,
    showInstruction:ShowInstructionFunction,
    borderRadius:string,
    isGameStart:boolean,
    setIsGameStart:Dispatch<SetStateAction<boolean>>,
    bufferProgress:number,
    setBufferProgress:Dispatch<SetStateAction<number>>,
    showProjectInfo:boolean, 
    setShowProjectInfo:Dispatch<SetStateAction<boolean>>,
    isDev:boolean,
    isUploading:boolean, 
    setIsUploading:Dispatch<SetStateAction<boolean>>,
    isVolumeOn:boolean, 
    setIsVolumeOn:Dispatch<SetStateAction<boolean>>,
    audio:any,
    setAudio:Dispatch<SetStateAction<any>>,
    selectedCustomPinpoint:CustomPinpointType, 
    setSelectedCustomPinpoint:Dispatch<SetStateAction<CustomPinpointType>>,
    selectedMap:MapType, 
    setSelectedMap:Dispatch<SetStateAction<MapType>>,
    mapContainerRef:RefObject<HTMLDivElement>,
    mapRef:RefObject<HTMLDivElement>,
    selectedPinpoint:PinpointType, 
    setSelectedPinpoint:Dispatch<SetStateAction<PinpointType>>,
    draggedView:ViewListType, 
    setDraggedView:Dispatch<SetStateAction<ViewListType>>,
    imageNavigationRef:RefObject<HTMLDivElement>,
    projectInfoRef:RefObject<HTMLDivElement>,
    gazeTimer:number, 
    setGazeTimer:Dispatch<SetStateAction<number>>,
    gazedPinId:string,
    setGazedPinId:Dispatch<SetStateAction<string>>,
    radius:number,
    fontBold:any, 
    setFontBold:Dispatch<SetStateAction<any>>,
    fontRegular:any, 
    setFontRegular:Dispatch<SetStateAction<any>>,
    fontLight:any, 
    setFontLight:Dispatch<SetStateAction<any>>,
    
    isTeleportLoading:boolean, 
    setIsTeleportLoading:Dispatch<SetStateAction<boolean>>,
    gazedGroupRef:any,
    isProjectInitialize:boolean, 
    setIsProjectInitialize:Dispatch<SetStateAction<boolean>>
}
export const VrViewerDepthContext = createContext({} as VrViewerDepthContextType)

const borderRadius = `4px`
const VrViewerDepth = () => {
    const radius = 100
    const {selectedProject, enableOrbitControl, setEnableOrbitControl,textureLoader, loadedViews, setLoadedViews, loginUser} = useContext(VrViewerContext)
    // Is Dev
    const isDev = (loginUser.email === selectedProject.email && loginUser.email !== '')|| _.includes(['storage.koma@gmail.com','pongo.devs@gmail.com','remitriadi@gmail.com'],loginUser.email)

    // Initialize Project
    const [isProjectInitialize, setIsProjectInitialize] = useState(false)
    // Gaze control
    const [gazeTimer, setGazeTimer] = useState(0)
    const [gazedPinId, setGazedPinId] = useState("")
    const gazedGroupRef = useRef(null as any)
    const teleportCirclesRef = useRef(null as any)
    
    // THREE hooks related
    const [scene, setScene] = useState(null as any)
    const [gl, setGl] = useState(null as any)
    // Scene related
    const [selectedScene, setSelectedScene] = useState(selectedProject.scenes[0])

    // View related
    const [currentView, setCurrentView] = useState(viewListObject)
    const [nextView, setNextView] = useState(viewListObject)

    // Font
    const [fontBold, setFontBold] = useState(null);
    const [fontRegular, setFontRegular] = useState(null);
    const [fontLight, setFontLight] = useState(null);
    
    // Camera related
    const [camera, setCamera] = useState({
        fov:0,
        updateProjectionMatrix:()=>{},
        updateWorldMatrix:()=>{}
    } as any)
    const [cameraRig, setCameraRig] = useState(new THREE.Group())

    // Mouse
    const[mouse, setMouse] = useState({
        isMouseDown:false,
        isMouseMove:false,
        isClicked: false,
        location: new THREE.Vector2(),
        movement: new THREE.Vector2(),
    })

    // XR State
    const [xrPlayer, setXrPlayer] = useState(null as any)
    const [isXrMode, setIsXrMode] = useState(false)

    // Master Container
    const masterContainerRef = useRef(null as any)

    // Player State
    const [player, setPlayer] = useState(playerObject)

    // Zoom state
    const [enableZoom, setEnableZoom] = useState(true)
    const [zoomState, setZoomState] = useState({
        zoomSpeed:0
    })
    const [previousFov, setPreviousFov] = useState(0)

    // Touch State
    const[touches, setTouches] = useState(touchesObject)
    const[touchCount, setTouchCount] = useState(0)
    const[startTouchDistance, setStartTouchDistance] = useState(0)

    // UI
    const [showUi, setShowUi] = useState(true)

    // Fullscreen State
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Game Start
    const [isGameStart, setIsGameStart] = useState(true)

    // Orbit controls

    // Main mesh ref
    const mainMeshRef = useRef(null as any)
    const dummyMeshRef = useRef(null as any)
    // Pointer
    const [pointer, setPointer] = useState(pointerObject)

    // Gazed Id
    const [gazedViewId, setGazedViewId]= useState('')

    // Editor mode
    const [isEditorMode, setIsEditorMode] = useState(false)

    // Autoplay
    const [isAutoplay, setIsAutoplay] = useState(false)

    // Doc
    const [enableDoc,setEnableDoc] = useState(false)

    // Teleport Circles
    const [isTeleportCirclesEnable, setIsTeleportCirclesEnable] = useState(true)

    // Buffer Progress
    const [bufferProgress, setBufferProgress] = useState(0)

    // Show Project Info
    const [showProjectInfo, setShowProjectInfo] = useState(false)

    // Uploading State
    const [isUploading, setIsUploading] = useState(false)

    // Ambient sound
    const [isVolumeOn, setIsVolumeOn] = useState(false)
    const [audio, setAudio] = useState(new Audio())
    useEffect(()=>{
        const audio = new Audio(selectedProject.globalSettings.music.url);
        audio.loop = true
        
        console.log(audio)
        setAudio(audio)
    },[selectedProject.globalSettings.music.url])

    useEffect(()=>{
        audio.volume = selectedProject.globalSettings.music.volume/100
    },[selectedProject.globalSettings.music.volume])

    // Custom Pinpoint
    const [selectedCustomPinpoint, setSelectedCustomPinpoint] = useState(customPinpointObject)
    const [selectedPinpoint, setSelectedPinpoint] = useState(pinpointObject)

    // Map
    const [selectedMap, setSelectedMap] = useState(mapObject)
    const mapContainerRef = useRef<HTMLDivElement>(null as any)
    const mapRef = useRef<HTMLDivElement>(null as any)

    // Dragged View
    const [draggedView, setDraggedView] = useState(viewListObject)

    // Image Navigator
    const imageNavigationRef = useRef<HTMLDivElement>(null as any)

    // Project info Ref
    const projectInfoRef = useRef<HTMLDivElement>(null as any)
    
    // Animation Hook
    const {animate} = useAnimation()
    

    // Teleport Loading
    const [isTeleportLoading, setIsTeleportLoading] = useState(false)
    
    // Instruction
    const instructionRef = useRef<HTMLDivElement>(null)
    const showInstruction = (text:string, duration:number)=>{
        let timeout:any = null
        if(instructionRef.current){
            // Clear timeout
            if(timeout){
                clearTimeout(timeout as any)
            }
            //  Reset Position
            instructionRef.current.style.transform = `translateY(-10rem)`
            // Change text
            instructionRef.current.innerHTML = text
            // Hover to top
            instructionRef.current.style.opacity = `100%`
            instructionRef.current.style.transform = `translateY(0rem)`
            timeout = setTimeout(()=>{
                if(instructionRef.current){
                    instructionRef.current.style.opacity = `0%`
                    instructionRef.current.style.transform = `translateY(10rem)`
                }
            }, duration * 1000)
        }
    }

    // When game start, show instruction
    useEffect(()=>{
        if(isGameStart === true && selectedProject.globalSettings.instruction.showInstruction){
            showInstruction('CLICK AND DRAG TO LOOK AROUND', 5)
        }
    },[isGameStart])

    const {decode16BitPng} = useDecoder()

    const disposeAll = ()=>{
        console.log("DISPOSE ALL")
        scene.traverse((object:any) => {
            if(object.geometry){
                object.geometry.dispose()
            }
            if(object.material){
                object.material.dispose()

                if(object.material.map){
                    object.material.map.dispose()
                }
                if(object.material.uniforms){
                    object.material.uniforms.currentDiffuse.value.dispose()
                    object.material.uniforms.nextDiffuse.value.dispose()
                    object.material.uniforms.depthMacro.value.dispose()
                    object.material.uniforms.depthMicro.value.dispose()
                }
            }
        })
    }

    const parallaxTeleport = async(view:ViewListType, duration:number)=>{
        const findView = loadedViews.find(v=>{return v._id === view._id})
        // If view never loaded before
        if(!findView){
            setIsTeleportLoading(true)
            const depth = await decode16BitPng(view.depthUrl)
            textureLoader.load(isDesktop? view.imageUrl6000 : view.imageUrl4000,(diffuseTexture)=>{
                diffuseTexture.magFilter = THREE.LinearFilter
                diffuseTexture.minFilter = THREE.LinearFilter
                if(selectedProject.globalSettings.transition.style === 'parallax'){

                    animate(cameraRig.position,{
                        duration,
                        x:view.position.x,
                        y:view.position.y,
                        z:view.position.z,
                        onStart:async()=>{
                            dummyMeshRef.current.scale.x = 0
                            dummyMeshRef.current.scale.y = 0
                            dummyMeshRef.current.scale.z = 0

                            setIsTeleportLoading(true)
                            player.isTeleport = true
    
                            mainMeshRef.current.position.x = view.position.x
                            mainMeshRef.current.position.y = view.position.y
                            mainMeshRef.current.position.z = view.position.z
    
                            mainMeshRef.current.material.uniforms.depthMacro.value = depth.macroTexture
                            mainMeshRef.current.material.uniforms.depthMicro.value = depth.microTexture    
    
                            mainMeshRef.current.material.uniforms.currentDiffuse.value = currentView.texture
                            mainMeshRef.current.material.uniforms.currentDiffuseOrigin.value = new THREE.Vector3(currentView.position.x, currentView.position.y, currentView.position.z)
    
                            mainMeshRef.current.material.uniforms.nextDiffuse.value = diffuseTexture
                            mainMeshRef.current.material.uniforms.nextDiffuseOrigin.value = new THREE.Vector3(view.position.x, view.position.y, view.position.z)
                        },
                        onUpdate:(progress)=>{
                            mainMeshRef.current.material.uniforms.mixColor.value = progress
                            player.isTeleport = true
                        },
                        onComplete:()=>{
                            dummyMeshRef.current.scale.x = 1
                            dummyMeshRef.current.scale.y = 1
                            dummyMeshRef.current.scale.z = -1

                            player.isTeleport = false
                            mainMeshRef.current.material.uniforms.currentDiffuse.value = diffuseTexture
                            mainMeshRef.current.material.uniforms.currentDiffuseOrigin.value = new THREE.Vector3(view.position.x, view.position.y, view.position.z)
                            mainMeshRef.current.material.uniforms.mixColor.value = 0
                            
                            const newView = {...view}
                            newView.texture = diffuseTexture
                            newView.depthMacroTexture = depth.macroTexture
                            newView.depthMicroTexture = depth.microTexture
                            setCurrentView(newView)
                            setLoadedViews(prev=>{return [...prev, newView]})
                            
                            setIsTeleportLoading(false)

                            disposeAll()
                        },
                        ease:`power3.out`
                    })
                }
                if(selectedProject.globalSettings.transition.style === 'fade'){
                    animate(mainMeshRef.current.material.uniforms.mixColor,{
                        duration,
                        value:1,
                        onStart:()=>{
                            cameraRig.position.x = view.position.x
                            cameraRig.position.y = view.position.y
                            cameraRig.position.z = view.position.z
    
                            // Set dummy teleport mesh
                            mainMeshRef.current.position.x = view.position.x
                            mainMeshRef.current.position.y = view.position.y
                            mainMeshRef.current.position.z = view.position.z
            
                            mainMeshRef.current.material.uniforms.depthMacro.value = depth.macroTexture
                            mainMeshRef.current.material.uniforms.depthMicro.value = depth.microTexture
            
                            mainMeshRef.current.material.uniforms.currentDiffuse.value = currentView.texture
                            mainMeshRef.current.material.uniforms.currentDiffuseOrigin.value = new THREE.Vector3(view.position.x, view.position.y, view.position.z)
            
                            mainMeshRef.current.material.uniforms.nextDiffuse.value = diffuseTexture
                            mainMeshRef.current.material.uniforms.nextDiffuseOrigin.value = new THREE.Vector3(view.position.x, view.position.y, view.position.z)
                        },
                        onUpdate:(progress)=>{
                            player.isTeleport = true
                        },
                        onComplete:()=>{
                            player.isTeleport = false
                            mainMeshRef.current.material.uniforms.currentDiffuse.value = diffuseTexture
                            mainMeshRef.current.material.uniforms.mixColor.value = 0
                            const newView = {...view}
                            newView.texture = diffuseTexture
                            newView.depthMacroTexture = depth.macroTexture
                            newView.depthMicroTexture = depth.microTexture
                            setCurrentView(newView)
                            setLoadedViews(prev=>{return [...prev, newView]})
                            
                            setIsTeleportLoading(false)

                            disposeAll()
                        },
                        ease:`power3.out`
                    })
                }
            })
        }
        //If view already loaded
        else{
            if(selectedProject.globalSettings.transition.style === 'parallax'){
                animate(cameraRig.position,{
                    duration,
                    x:view.position.x,
                    y:view.position.y,
                    z:view.position.z,
                    onStart:async()=>{
                        dummyMeshRef.current.scale.x = 0
                        dummyMeshRef.current.scale.y = 0
                        dummyMeshRef.current.scale.z = 0

                        // Set dummy teleport mesh
                        mainMeshRef.current.position.x = view.position.x
                        mainMeshRef.current.position.y = view.position.y
                        mainMeshRef.current.position.z = view.position.z
        
                        mainMeshRef.current.material.uniforms.depthMacro.value = findView.depthMacroTexture
                        mainMeshRef.current.material.uniforms.depthMicro.value = findView.depthMicroTexture
        
                        mainMeshRef.current.material.uniforms.currentDiffuse.value = currentView.texture
                        mainMeshRef.current.material.uniforms.currentDiffuseOrigin.value = new THREE.Vector3(currentView.position.x, currentView.position.y, currentView.position.z)
        
                        mainMeshRef.current.material.uniforms.nextDiffuse.value = findView.texture
                        mainMeshRef.current.material.uniforms.nextDiffuseOrigin.value = new THREE.Vector3(view.position.x, view.position.y, view.position.z)
                    },
                    onUpdate:(progress)=>{
                        mainMeshRef.current.material.uniforms.mixColor.value = progress
                        player.isTeleport = true
                    },
                    onComplete:()=>{
                        dummyMeshRef.current.scale.x = 1
                        dummyMeshRef.current.scale.y = 1
                        dummyMeshRef.current.scale.z = -1

                        player.isTeleport = false
                        mainMeshRef.current.material.uniforms.currentDiffuse.value = findView.texture
                        mainMeshRef.current.material.uniforms.currentDiffuseOrigin.value = new THREE.Vector3(view.position.x, view.position.y, view.position.z)
                        mainMeshRef.current.material.uniforms.mixColor.value = 0
                        setCurrentView(findView)

                        disposeAll()
                    },
                    ease:`power3.out`
                })
            }
            if(selectedProject.globalSettings.transition.style === 'fade'){
                animate(mainMeshRef.current.material.uniforms.mixColor,{
                    duration,
                    value:1,
                    onStart:async()=>{
                        cameraRig.position.x = view.position.x
                        cameraRig.position.y = view.position.y
                        cameraRig.position.z = view.position.z

                        // Set dummy teleport mesh
                        mainMeshRef.current.position.x = view.position.x
                        mainMeshRef.current.position.y = view.position.y
                        mainMeshRef.current.position.z = view.position.z
        
                        mainMeshRef.current.material.uniforms.depthMacro.value = findView.depthMacroTexture
                        mainMeshRef.current.material.uniforms.depthMicro.value = findView.depthMicroTexture
        
                        mainMeshRef.current.material.uniforms.currentDiffuse.value = currentView.texture
                        mainMeshRef.current.material.uniforms.currentDiffuseOrigin.value = new THREE.Vector3(view.position.x, view.position.y, view.position.z)
        
                        mainMeshRef.current.material.uniforms.nextDiffuse.value = findView.texture
                        mainMeshRef.current.material.uniforms.nextDiffuseOrigin.value = new THREE.Vector3(view.position.x, view.position.y, view.position.z)
                    },
                    onUpdate:(progress)=>{
                        player.isTeleport = true
                    },
                    onComplete:()=>{
                        mainMeshRef.current.material.uniforms.currentDiffuse.value = findView.texture
                        mainMeshRef.current.material.uniforms.mixColor.value = 0
                        player.isTeleport = false
                        setCurrentView(findView)

                        disposeAll()
                    },
                    ease:`power3.out`
                })
            }
        }
    }

    const xrTeleport = async(view:ViewListType)=>{
        const findView = loadedViews.find(v=>{return v._id === view._id})
        if(!findView){
            setIsTeleportLoading(true)
            const depth = await decode16BitPng(view.depthUrl)
            textureLoader.load(isDesktop? view.imageUrl6000 : view.imageUrl4000,(diffuseTexture)=>{
                cameraRig.position.x = view.floorPosition.x
                cameraRig.position.y = view.floorPosition.y
                cameraRig.position.z = view.floorPosition.z
                
                xrPlayer.position.x = view.floorPosition.x
                xrPlayer.position.y = view.floorPosition.y
                xrPlayer.position.z = view.floorPosition.z
        
                mainMeshRef.current.position.x = view.position.x
                mainMeshRef.current.position.y = view.position.y
                mainMeshRef.current.position.z = view.position.z
        
                mainMeshRef.current.material.uniforms.currentDiffuse.value = diffuseTexture
                mainMeshRef.current.material.uniforms.depthMacro.value = depth.macroTexture
                mainMeshRef.current.material.uniforms.depthMicro.value = depth.microTexture
                const newView = {...view}
                newView.texture = diffuseTexture
                newView.depthMacroTexture = depth.macroTexture
                newView.depthMicroTexture = depth.microTexture
                setCurrentView(newView)
                setLoadedViews(prev=>{return [...prev, newView]})

                setIsTeleportLoading(false)
            })
        }
        else{
            cameraRig.position.x = view.floorPosition.x
            cameraRig.position.y = view.floorPosition.y
            cameraRig.position.z = view.floorPosition.z
            
            xrPlayer.position.x = view.floorPosition.x
            xrPlayer.position.y = view.floorPosition.y
            xrPlayer.position.z = view.floorPosition.z
    
            mainMeshRef.current.position.x = view.position.x
            mainMeshRef.current.position.y = view.position.y
            mainMeshRef.current.position.z = view.position.z
    
            mainMeshRef.current.material.uniforms.currentDiffuse.value = findView.texture
            mainMeshRef.current.material.uniforms.depthMacro.value = findView.depthMacroTexture
            mainMeshRef.current.material.uniforms.depthMicro.value = findView.depthMicroTexture
            setCurrentView(findView)
        }

    }


    // Event Handler
    const handlePointerLeave = (e:any)=>{
        if(isDesktop){
            mouse.isClicked = false
        }
    }

    const handleWheelCapture = (e:any)=>{
        if(isDesktop){
            if(selectedProject.globalSettings.camera.enableZoom && enableZoom && !player.isZooming){
                const zoomStrength = 1
                // Zoom In camera
                if(e.deltaY > 0){
                    if(zoomState.zoomSpeed < 0){
                        zoomState.zoomSpeed = 0
                        zoomState.zoomSpeed += zoomStrength
                    }
                    else{
                        zoomState.zoomSpeed += zoomStrength
                    }
                }
                // Zoom out camera
                if(e.deltaY < 0){
                    if(zoomState.zoomSpeed > 0){
                        zoomState.zoomSpeed = 0
                        zoomState.zoomSpeed -= zoomStrength
                    }
                    else{
                        zoomState.zoomSpeed -= zoomStrength
                    }
                }
            }
        }
    }

    const handleTouchStart = (e:any)=>{
        if(e.touches.length === 2){
            touches.startDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            )
        }

        touches.finger[0].startLocation = new THREE.Vector2(e.touches[0].clientX, e.touches[0].clientY)

        // Handle double touch
        const date = Date.now()
        const deltaTouch = date - touches.lastTouch
        if(deltaTouch < 300){
            if(!showUi){
                setShowUi(true)
            }
            if(isFullscreen){
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if ((document as any).webkitExitFullscreen) { /* Safari */
                    (document as any).webkitExitFullscreen();
                } else if ((document as any).msExitFullscreen) { /* IE11 */
                    (document as any).msExitFullscreen();
                }
            }
        }
        touches.lastTouch = date
        // 
        
        mouse.location.x = e.touches[0].clientX
        mouse.location.y = e.touches[0].clientY
        mouse.isClicked = true
        player.canTeleport = true
        player.canTurnOnTv = true

        // 
        setTouchCount(prev=>{return prev + 1})
    }

    const handleTouchMove = (e:any)=>{
        // Orbit Controls
        if(mouse.isClicked && 
            e.touches.length == 1 && 
            (isGameStart || selectedProject.globalSettings.loading.autoLoad) && 
            !showProjectInfo
        ){
            const divider = 15

            mouse.movement.x += (e.touches[0].clientX - mouse.location.x)/divider
            mouse.movement.y += (e.touches[0].clientY - mouse.location.y)/divider

            mouse.location.x = e.touches[0].clientX
            mouse.location.y = e.touches[0].clientY
        }

        // Pinch to zoom
        if(e.touches.length > 1){
            const touch0x = e.touches[0].clientX
            const touch0y = e.touches[0].clientY

            const touch1x = e.touches[1].clientX
            const touch1y = e.touches[1].clientY

            const currentTouchDistance = Math.sqrt(Math.pow(touch1x - touch0x, 2) + Math.pow(touch1y - touch0y, 2))            
            if(startTouchDistance == 0){
                setStartTouchDistance(currentTouchDistance)
                setPreviousFov(camera.fov)
            }

            if(startTouchDistance != 0){
                const finalTouchDistance = (currentTouchDistance - startTouchDistance) / 6
                camera.fov =  Math.max(60, Math.min(125, previousFov - finalTouchDistance))
                camera.updateProjectionMatrix()
            }
        }

        // Teleportation
        player.canTeleport = false

        //TV
        player.canTurnOnTv = false
    }
    const handleMouseMove = (e:any)=>{
        if(mouse.isMouseDown){
            mouse.isMouseMove = true
        }
        if(isDesktop && 
            mouse.isClicked && 
            enableOrbitControl && 
            (isGameStart || selectedProject.globalSettings.loading.autoLoad) &&
            !showProjectInfo
        ){
            // Orbit Controls
            if(mouse.location.x !== e.clientX || mouse.location.y !== e.clientY){
                
                mouse.movement.x += e.movementX /30
                mouse.movement.y += e.movementY /30

                mouse.location.x = e.clientX
                mouse.location.y = e.clientY

                // Teleportation
                if(Math.abs(mouse.movement.y) > 0.1 || Math.abs(mouse.movement.x) > 0.1){
                    player.canTeleport = false
                }

                //TV
                player.canTurnOnTv = false
            }
        }
    }
    const handleTouchCancel = (e:any)=>{
        
    }

    const handleTouchEnd = (e:any)=>{
        mouse.isClicked = false
        player.canTeleport = true
        player.canTurnOnTv = true

        touches.finger[0].location.y = 0
        touches.finger[0].location.x = 0

        touches.finger[1].location.x = 0
        touches.finger[1].location.y = 0

        touches.direction === 'initial'

        setStartTouchDistance(0)
        setPreviousFov(0)
        setTouchCount(prev=>{return prev - 1})
    }
    
    const handleMouseDown = (e:any)=>{
        if(isDesktop){
            mouse.isMouseDown = true
            mouse.isClicked = true
            player.canTeleport = true
            player.canTurnOnTv = true
        }
    }
    
    const handleMouseUp = (e:any)=>{
        setEnableOrbitControl(true)
        if(isDesktop){
            mouse.isMouseDown = false
            mouse.isMouseMove = false
            mouse.isClicked = false
            player.canTeleport = true
            player.canTurnOnTv = true
        }
    }

    return (  
        <VrViewerDepthContext.Provider
            value={{
                currentView, setCurrentView,
                nextView, setNextView,
                camera, setCamera,
                cameraRig, setCameraRig,
                mouse, setMouse,
                selectedScene, setSelectedScene,
                scene, setScene,
                gl, setGl,
                xrPlayer, setXrPlayer,
                isXrMode, setIsXrMode,
                masterContainerRef,
                player,setPlayer,
                enableZoom,setEnableZoom,
                zoomState,setZoomState,
                touches,setTouches,
                touchCount,setTouchCount,
                showUi,setShowUi,
                isFullscreen, setIsFullscreen,
                startTouchDistance, setStartTouchDistance,
                previousFov, setPreviousFov,
                enableOrbitControl,setEnableOrbitControl,
                mainMeshRef,
                dummyMeshRef,
                teleportCirclesRef,
                pointer, setPointer,
                gazedViewId,setGazedViewId,
                parallaxTeleport,
                xrTeleport,
                isEditorMode, setIsEditorMode,
                isAutoplay, setIsAutoplay,
                enableDoc, setEnableDoc,
                isTeleportCirclesEnable, setIsTeleportCirclesEnable,
                instructionRef,
                showInstruction,
                borderRadius,
                bufferProgress, setBufferProgress,
                isGameStart, setIsGameStart,
                showProjectInfo, setShowProjectInfo,
                isDev,
                isUploading, setIsUploading,
                isVolumeOn, setIsVolumeOn,
                audio, setAudio,
                selectedCustomPinpoint, setSelectedCustomPinpoint,
                selectedMap, setSelectedMap,
                mapContainerRef,
                mapRef,
                selectedPinpoint, setSelectedPinpoint,
                draggedView, setDraggedView,
                imageNavigationRef,
                projectInfoRef,
                gazedPinId,setGazedPinId,
                gazeTimer,setGazeTimer,
                radius,
                fontRegular, setFontRegular,
                fontLight, setFontLight,
                fontBold, setFontBold,
                isTeleportLoading,setIsTeleportLoading,
                gazedGroupRef,
                isProjectInitialize, setIsProjectInitialize
            }}
        >
            {selectedProject.scenes.length === 0?
                <DragDropZipFile/>
            :
                <div
                    ref={masterContainerRef}
                    draggable={false}
                    style={{
                        background: `radial-gradient(circle, rgba(55,55,55,1) 0%, rgba(40,40,40,1) 100%)`,
                        position:`fixed`,
                        width:`100%`,
                        height:`100%`,
                        touchAction:`none`,
                    }}
                    onPointerLeave={e=>{handlePointerLeave(e)}}
                    onWheelCapture={e=>{handleWheelCapture(e)}}
                    onTouchMove={e=>{handleTouchMove(e)}}
                    onMouseMove={e=>{handleMouseMove(e)}}
                    onTouchStart={(e)=>{handleTouchStart(e)}}
                    onMouseDown={(e)=>{handleMouseDown(e)}}
                    onTouchCancel={(e)=>{handleTouchCancel(e)}}
                    onTouchEnd={(e)=>{handleTouchEnd(e)}}
                    onMouseUp={(e)=>{handleMouseUp(e)}}
                >
                    {/* <div
                        style={{
                            zIndex:100,
                            position:`absolute`,
                            width:`20rem`,
                            height:`20rem`,
                            background:`red`
                        }}
                        onClick={()=>{
                            
                            
                            
                            // setShowUi(prev=>{return !prev})
                        }}
                    >

                    </div> */}
                    <WindowEvent/>
                    <Ui/>
                    <Gl/>
                </div>
            }
        </VrViewerDepthContext.Provider>
    );
}
 
export default VrViewerDepth;