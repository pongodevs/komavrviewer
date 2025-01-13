import { createContext, useState, Dispatch, SetStateAction, RefObject, useContext } from 'react';
import * as THREE from 'three'
import {isAndroid, isDesktop, isMobile} from 'react-device-detect'
import { VrProjectType, vrProjectObject, SceneType, sceneObject, ViewListType, viewListObject, MapType, mapObject, PinpointType, pinpointObject, customPinpointObject, CustomPinpointType, PlayerType, TouchesType, touchesObject, playerObject, pointerObject, PointerType, movementObject, MovementType, MouseType, mouseObject } from '@/types/vrProjectType/index';
import {useRef} from 'react';
import {useEffect} from 'react';
import _ from "lodash";
import { VrViewerContext } from "..";
import Ui from "./ui";
import WindowEvent from "./windowEvent";
import Gl from "./gl";
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import useFirebase from '@/hooks/firebase';
import useAnimation from '@/hooks/animation';
import { ZoomStateType } from '@/types/zoomState';

interface TeleportInterface {
    (view:ViewListType, type?:'fade' | 'zoom-in', pin?:PinpointType):void;
}

interface TeleportToPinInterface {
    (pin:PinpointType):void;
}

type VrViewerStaticContextType = {
    isFullscreen:boolean, 
    setIsFullscreen:Dispatch<SetStateAction<boolean>>,
    enableZoom:boolean, 
    setEnableZoom:Dispatch<SetStateAction<boolean>>,
    isAutoplay:boolean,
    setIsAutoplay:Dispatch<SetStateAction<boolean>>,
    borderRadius:string,
    showInfo:boolean, 
    setShowInfo:Dispatch<SetStateAction<boolean>>,
    notFoundTexture:any, 
    setNotFoundTexture:Dispatch<SetStateAction<any>>,
    enableOrbitControl:boolean, 
    setEnableOrbitControl:Dispatch<SetStateAction<boolean>>,
    masterContainerRef:RefObject<HTMLDivElement>,
    enableDoc:boolean, 
    setEnableDoc:Dispatch<SetStateAction<boolean>>,
    mouse:MouseType, 
    setMouse:Dispatch<SetStateAction<MouseType>>
    camera:any, 
    setCamera:Dispatch<SetStateAction<any>>,
    cameraRig:any, 
    setCameraRig:Dispatch<SetStateAction<any>>,
    touches:TouchesType, 
    setTouches:Dispatch<SetStateAction<TouchesType>>,
    selectedScene:SceneType, 
    setSelectedScene:Dispatch<SetStateAction<SceneType>>,
    currentView:ViewListType, 
    setCurrentView:Dispatch<SetStateAction<ViewListType>>,
    nextView:ViewListType, 
    setNextView:Dispatch<SetStateAction<ViewListType>>,
    player:PlayerType, 
    setPlayer:Dispatch<SetStateAction<PlayerType>>
    movement:MovementType, 
    setMovement:Dispatch<SetStateAction<MovementType>>
    scene:any, 
    setScene:Dispatch<SetStateAction<any>>,
    gl:any,
    setGl:Dispatch<SetStateAction<any>>,
    isXrMode:boolean, 
    setIsXrMode:Dispatch<SetStateAction<boolean>>
    mainGeometry:any, 
    setMainGeometry:Dispatch<SetStateAction<any>>,
    pointer:PointerType, 
    setPointer:Dispatch<SetStateAction<PointerType>>,
    mainMeshRef:any,
    isGameStart:boolean, 
    setIsGameStart:Dispatch<SetStateAction<boolean>>,
    teleport:TeleportInterface,
    teleportToPin:TeleportToPinInterface,
    isEditorMode:boolean, 
    setIsEditorMode:Dispatch<SetStateAction<boolean>>,
    draggedView:ViewListType, 
    setDraggedView:Dispatch<SetStateAction<ViewListType>>,
    selectedMap:MapType, 
    setSelectedMap:Dispatch<SetStateAction<MapType>>,
    mapContainerRef:any,
    selectedPinpoint:PinpointType, 
    setSelectedPinpoint:Dispatch<SetStateAction<PinpointType>>,
    selectedCustomPinpoint:CustomPinpointType, 
    setSelectedCustomPinpoint:Dispatch<SetStateAction<CustomPinpointType>>,
    showUi:boolean, 
    setShowUi:Dispatch<SetStateAction<boolean>>,
    isDev:boolean,
    isVolumeOn:boolean, 
    setIsVolumeOn:Dispatch<SetStateAction<boolean>>,
    audio:any, 
    setAudio:Dispatch<SetStateAction<any>>,
    changeScene:any,
    isUploading:boolean, 
    setIsUploading:Dispatch<SetStateAction<boolean>>,
    projectInfoRef:RefObject<HTMLDivElement>,
    mapRef:RefObject<HTMLDivElement>,
    imageNavigationRef:RefObject<HTMLDivElement>,
    fontBold:any, 
    setFontBold:Dispatch<SetStateAction<any>>,
    fontRegular:any, 
    setFontRegular:Dispatch<SetStateAction<any>>,
    fontLight:any, 
    setFontLight:Dispatch<SetStateAction<any>>,
    gazeTimer:number, 
    setGazeTimer:Dispatch<SetStateAction<number>>,
    gazedPinId:string, 
    setGazedPinId:Dispatch<SetStateAction<string>>,
    gazedGroupRef:any,
    radius:number,
    zoomState:ZoomStateType, 
    setZoomState:Dispatch<SetStateAction<ZoomStateType>>,
    isProjectInitialize:boolean, 
    setIsProjectInitialize:Dispatch<SetStateAction<boolean>>
}

export const VrViewerStaticContext = createContext<VrViewerStaticContextType>({} as VrViewerStaticContextType)

const VrViewerStatic = () => {
    const router = useRouter()
    const {db} = useFirebase()

    useEffect(()=>{
        console.log('STATIC PROJECT')
    },[])

    // Master variable

    const radius = 200
    // Not found texture
    const textureloader = new THREE.TextureLoader()
    const texture360NotFound = textureloader.load('https://firebasestorage.googleapis.com/v0/b/pongoprojects-us.appspot.com/o/pongovr%2Fimages%2Fnot-found-360.jpg?alt=media&token=cab11e5c-e912-48fe-b8c7-7d6f22f04f33&_gl=1*p5nyx3*_ga*MjEzMjg2OTg3Ni4xNjkyNjAxNjMy*_ga_CW55HF8NVT*MTY5ODA1NTYyMi4yOS4xLjE2OTgwNTYwOTMuNDAuMC4w')

    //Manager

    // Selected Project
    const {
        selectedProject, setSelectedProject, 
        enableOrbitControl, setEnableOrbitControl,
        selectedScene, setSelectedScene,
        currentView, setCurrentView,
        nextView, setNextView,
        loginUser,
    } = useContext(VrViewerContext)

    const [selectedCustomPinpoint, setSelectedCustomPinpoint] = useState<CustomPinpointType>(customPinpointObject)
    const [selectedMap, setSelectedMap] = useState<MapType>(mapObject)
    const [selectedPinpoint, setSelectedPinpoint] = useState<PinpointType>(pinpointObject)

    // View Related
    const [draggedView, setDraggedView] = useState<ViewListType>(viewListObject)

    // Map related

    // Mouse state
    const[mouse, setMouse] = useState(mouseObject)
    // Autoplay
    const [isAutoplay, setIsAutoplay] = useState(false)

    // Main geometry
    const [mainGeometry, setMainGeometry] = useState(new THREE.SphereGeometry(100,16,16))
    
    // Project Initialize
    const [isProjectInitialize, setIsProjectInitialize] = useState(false)

    //Init camera
    const [camera, setCamera] = useState({
        fov:0,
        updateProjectionMatrix: ()=>{

        },
        getWorldDirection:()=>{
            return new THREE.Vector3(0,0,0);
        },
        rotation:{
            x:0,
            y:0,
            z:0
        },
        position:{
            x:0,
            y:0,
            z:0
        }
    })
    // Camera Rig
    const [cameraRig, setCameraRig] = useState(new THREE.Group())

    //  Touches
    const[touches, setTouches] = useState(touchesObject)

    // Player
    const [player, setPlayer] = useState(playerObject)

    // WASD Movement State
    const [movement, setMovement] = useState(movementObject)

    // Init variable
    const [gl, setGl] = useState('' as any)
    const [scene, setScene] = useState('' as any)

    // XR mode
    const [isXrMode, setIsXrMode] = useState(false)

    // Device orientation controls
    const [enableDoc, setEnableDoc] = useState(false)

    // RayCaster
    const [pointer, setPointer] = useState(pointerObject)

    //Mesh
    const mainMeshRef = useRef<any>()

    // Game state
    const [isGameStart, setIsGameStart] = useState(false)

    // Zoom
    const [enableZoom, setEnableZoom] = useState(true)
    
    // Ambient sound
    const [isVolumeOn, setIsVolumeOn] = useState(false)
    const [audio, setAudio] = useState(new Audio())

    // Upload status
    const [isUploading, setIsUploading] = useState(false)


    // Mobile zoom state
    const [previousFov, setPreviousFov] = useState(0)
    const [startTouchDistance, setStartTouchDistance] = useState(0)

    // Font
    const [fontBold, setFontBold] = useState(null);
    const [fontRegular, setFontRegular] = useState(null);
    const [fontLight, setFontLight] = useState(null);

    // Gaze control
    const [gazeTimer, setGazeTimer] = useState(0)
    const [gazedPinId, setGazedPinId] = useState("")
    const gazedGroupRef = useRef(null as any)

    const masterContainerRef = useRef<HTMLDivElement>(null)

    // Editor mode
    const [isEditorMode, setIsEditorMode] = useState(false)

    // Maps related
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const [notFoundTexture, setNotFoundTexture] = useState(new THREE.TextureLoader().load('https://firebasestorage.googleapis.com/v0/b/pongoprojects-us.appspot.com/o/pongovr%2Fimages%2Fnot-found-360.jpg?alt=media&token=cab11e5c-e912-48fe-b8c7-7d6f22f04f33'))

    // Show Info
    const [showInfo, setShowInfo] = useState(false)

    // UI
    const [showUi, setShowUi] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Devs
    const isDev = (loginUser.email === selectedProject.email && loginUser.email !== '')|| _.includes(['storage.koma@gmail.com','pongo.devs@gmail.com','remitriadi@gmail.com'],loginUser.email)
    
    // Ref
    const projectInfoRef = useRef<HTMLDivElement>(null as any)
    const mapRef = useRef<HTMLDivElement>(null as any)
    const imageNavigationRef = useRef<HTMLDivElement>(null as any)

    // Pin

    // Zooming state
    const [zoomState, setZoomState] = useState({
        zoomSpeed: 0
    })

    const changeScene = (scene:SceneType)=>{
        //Check if view is transitioning, if no, do a scene change
        if(!player.isViewTransition && selectedScene._id !== scene._id){
            //Search for clicked scene and it's current view
            setSelectedScene(scene)
            const view = scene.viewList.find(view=>{return view._id === currentView._id}) || scene.viewList[0]

            //Change transition
            if(view){
                animate(mainMeshRef.current.material.uniforms.mixColor,{
                    value:1,
                    duration:isEditorMode?0.2 : 1,
                    onStart:(()=>{
                        // Play audio
                        const sfxAudio = new Audio('/sounds/sfx/ui2.mp3')
                        sfxAudio.volume = 0.2
                        sfxAudio.play()
                        // Set newView
                        player.isViewTransition = true
                        mainMeshRef.current.material.uniforms.nextTexture.value = view.texture || texture360NotFound
                        setNextView(view)
                    }),
                    onUpdate:(()=>{
    
                    }),
                    onComplete:(()=>{
                        player.isViewTransition = false
                        mainMeshRef.current.material.uniforms.currentTexture.value = view.texture || texture360NotFound
                        mainMeshRef.current.material.uniforms.mixColor.value = 0
                        setCurrentView(view)
                    }),
                })
            }
            
        }
    }

    useEffect(()=>{
        const audio = new Audio(selectedProject.globalSettings.music.url);
        audio.loop = true
        
        setAudio(audio)
    },[selectedProject.globalSettings.music.url])

    useEffect(()=>{
        audio.volume = selectedProject.globalSettings.music.volume/100
    },[selectedProject.globalSettings.music.volume])

    const borderRadius = `4px`
    const {animate} = useAnimation()

    const teleport = (view:ViewListType, type = 'fade', pin?:PinpointType)=>{
        if(view.texture === ''){
            const textureLoader = new THREE.TextureLoader()
            const texture = textureLoader.load(view.imageUrl)
            texture.magFilter = THREE.LinearFilter
            texture.minFilter = THREE.LinearFilter
            texture.generateMipmaps = false
            view.texture = texture
        }
        if(!player.isTeleport){
            const finalDuration = isEditorMode? 0.1 : selectedProject.globalSettings.transition.duration

            // Zoom in transtition
            if(type === 'zoom-in' && pin){
                //Rotated value
                const quaternion = new THREE.Quaternion()
                const radians = currentView.rotation * (Math.PI/180)
                quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), radians)


                animate(camera,{
                    fov:selectedProject.globalSettings.transition.enableZoomTransition? view.fov : camera.fov,
                    duration:finalDuration,
                    ease:`power4.out`,
                    onStart:()=>{
                        player.isViewTransition = true
                        player.isTeleport = true

                        mainMeshRef.current.material.uniforms.nextTexture.value = view.texture
                        mainMeshRef.current.material.uniforms.nextOrigin.value = view.position
                        mainMeshRef.current.material.uniforms.nextRotation.value = view.rotation
                        
                        setNextView(view)
                        setCurrentView(view)
                    },
                    onUpdate:(progress)=>{
                        if(pin){
                            player.isTeleport = true

                            const forwardVector = new THREE.Vector3(pin.position.x, pin.position.y, pin.position.z).normalize()
                            forwardVector.applyQuaternion(quaternion)
                            const multiplyForwardVector = forwardVector.multiplyScalar(radius)

                            const multiplyForward = new THREE.Vector3().copy(multiplyForwardVector).multiplyScalar(progress)

                            const finalCurrentOrigin = new THREE.Vector3(0,0,0).sub(multiplyForward)
                            mainMeshRef.current.material.uniforms.currentOrigin.value = finalCurrentOrigin

                            const finalNextOrigin = new THREE.Vector3(0,0,0).add(multiplyForwardVector).sub(multiplyForward)
               
                            mainMeshRef.current.material.uniforms.nextOrigin.value = finalNextOrigin

                            mainMeshRef.current.material.uniforms.mixColor.value = progress
                            camera.updateProjectionMatrix()
                        }
                    },
                    onComplete:()=>{
                        setPlayer(prev=>{return {...prev,
                            isTeleport:false,
                            isViewTransition:false
                        }})
    
                        mainMeshRef.current.material.uniforms.currentRotation.value = view.rotation
                        mainMeshRef.current.material.uniforms.currentTexture.value = view.texture
                        mainMeshRef.current.material.uniforms.currentOrigin.value = view.position
                        mainMeshRef.current.material.uniforms.mixColor.value = 0
                    }
                })
        
                animate(cameraRig.position,{
                    x:view.position.x,
                    y:view.position.y,
                    z:view.position.z,
                    duration:0.01,
                    delay:0
                })
            }

            // Fade transtiion
            if(type === 'fade'){
                animate(camera,{
                    fov: view.fov,
                    duration:finalDuration,
                    ease:`power3.out`,
                    onStart:()=>{
                        player.isTeleport = true
                        player.isViewTransition = true
                        mainMeshRef.current.material.uniforms.nextTexture.value = view.texture
                        mainMeshRef.current.material.uniforms.nextRotation.value = view.rotation
                        
                        setNextView(view)
                        setCurrentView(view)
                    },
                    onUpdate:(progress)=>{
                        camera.updateProjectionMatrix()
                        player.isTeleport = true
                        mainMeshRef.current.material.uniforms.mixColor.value = progress
                    },
                    onComplete:()=>{
                        setPlayer(prev=>{return {...prev,
                            isTeleport:false,
                            isViewTransition:false
                        }})
    
                        mainMeshRef.current.material.uniforms.currentRotation.value = view.rotation
                        mainMeshRef.current.material.uniforms.currentTexture.value = view.texture
                        mainMeshRef.current.material.uniforms.mixColor.value = 0
                    }
                    
                })
            }
        }
    }
    
    const teleportToPin = async(pinpoint:PinpointType)=>{
        // Teleport

        // If there's to other project
        if(pinpoint.redirectUrl !== ''){
            const redirectArray = pinpoint.redirectUrl.split('/')
            const getNextProjectId = ()=>{
                if(_.includes(pinpoint.redirectUrl,'?startIndex=')){
                    if(pinpoint.redirectUrl.endsWith('/')){
                        return redirectArray[redirectArray.length -3]
                    }
                    else{
                        return redirectArray[redirectArray.length -2]
                    }
                }
                else{
                    if(pinpoint.redirectUrl.endsWith('/')){
                        return redirectArray[redirectArray.length -2]
                    }
                    else{
                        return redirectArray[redirectArray.length -1]
                    }
                }
            }
            
            const getStartIndex = ()=>{
                if(_.includes(pinpoint.redirectUrl,'?startIndex=')){
                    if(pinpoint.redirectUrl.endsWith('/')){
                        return Number(pinpoint.redirectUrl[pinpoint.redirectUrl.length - 2])
                    }
                    else{
                        return Number(pinpoint.redirectUrl[pinpoint.redirectUrl.length - 1])
                    }
                }
                else{
                    return 0
                }
            }
            const nextProjectId = getNextProjectId()
            const startIndex = getStartIndex()
            const nextProjectDoc = doc(db,'vrProjects',nextProjectId)
            
            const nextProject = (await getDoc(nextProjectDoc)).data() as VrProjectType
            if(nextProject){
                const nextView = nextProject.scenes[0].viewList[startIndex]

                if(nextView){
                    teleport(nextView)
                }
                
                // Jump to other project
                const redirectUrl = `${location.origin}/vrViewer/${nextProjectId}/?startIndex=${startIndex}`

                setTimeout(()=>{
                    router.push(redirectUrl)
                },(selectedProject.globalSettings.transition.duration * 1000) + 500)
            }
            else{
                // Jump to external
                open(pinpoint.redirectUrl, '_blank');
            }
        }
        // If to current project
        else{
            const findView = selectedScene.viewList.find(v=>{return v._id === pinpoint.toViewId}) as ViewListType
            if(findView){
                // Change map
                const findMap = selectedProject.maps.find(map=>{return map._id === findView.mapId})
                if(findMap){
                    setSelectedMap(findMap)
                    // Change pin
                    const findPin =findMap.pinpoints.find(pin=>{return pin.toViewId === findView._id})
                    console.log(findView._id)
                    console.log(findMap.pinpoints)
                    console.log(findPin)
                    if(findPin){
                        setSelectedPinpoint(findPin)
                    }
                }

                // Teleport
                teleport(findView, selectedProject.globalSettings.transition.style, pinpoint)
            }
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
    const handleTouchMove = (e:any)=>{
        // Orbit Controls
        if(mouse.isClicked && e.touches.length == 1 && (isGameStart || selectedProject.globalSettings.loading.autoLoad)){
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
        if(isDesktop && mouse.isClicked && enableOrbitControl && (isGameStart || selectedProject.globalSettings.loading.autoLoad)){
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
    const handleTouchStart = (e:any)=>{
        // Handle double touch
        const date = Date.now()
        const deltaTouch = date - touches.lastTouch
        if(deltaTouch < 200){
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

        
    }
    const handleMouseDown = (e:any)=>{
        if(masterContainerRef.current){
            masterContainerRef.current.style.cursor = `grabbing`
        }
        if(isDesktop){
            mouse.isClicked = true
            player.canTeleport = true
            player.canTurnOnTv = true
        }
    }
    const handleTouchEnd = (e:any)=>{
        mouse.isClicked = false
        player.canTeleport = true
        player.canTurnOnTv = true

        touches.finger[0].location.x = 0
        touches.finger[0].location.y = 0

        touches.finger[1].location.x = 0
        touches.finger[1].location.y = 0

        setStartTouchDistance(0)
        setPreviousFov(0)
    }
    const handleMouseUp = (e:any)=>{
        setEnableOrbitControl(true)
        if(masterContainerRef.current){
            masterContainerRef.current.style.cursor = `grab`
        }
        if(isDesktop){
            mouse.isClicked = false
            player.canTeleport = true
            player.canTurnOnTv = true
        }
    }

    return (  
        <VrViewerStaticContext.Provider
            value={{
                isFullscreen, setIsFullscreen,
                enableZoom, setEnableZoom,
                isDev,
                showUi, setShowUi,
                borderRadius,
                isAutoplay, setIsAutoplay,
                showInfo, setShowInfo,
                selectedCustomPinpoint, setSelectedCustomPinpoint,
                selectedPinpoint, setSelectedPinpoint,
                notFoundTexture, setNotFoundTexture,
                mapContainerRef,
                selectedMap, setSelectedMap,
                enableOrbitControl, setEnableOrbitControl,
                draggedView, setDraggedView,
                isEditorMode, setIsEditorMode,
                masterContainerRef,
                teleport,
                teleportToPin,
                isGameStart, setIsGameStart,
                mainMeshRef,
                pointer, setPointer,
                mainGeometry,setMainGeometry,
                mouse, setMouse,
                camera, setCamera,
                cameraRig, setCameraRig,
                touches, setTouches,
                selectedScene, setSelectedScene,
                currentView, setCurrentView,
                nextView, setNextView,
                player, setPlayer,
                movement, setMovement,
                scene,setScene,
                gl,setGl,
                isXrMode, setIsXrMode,
                enableDoc, setEnableDoc,
                isVolumeOn, setIsVolumeOn,
                audio, setAudio,
                changeScene,
                isUploading, setIsUploading,
                projectInfoRef,
                mapRef,
                imageNavigationRef,
                fontBold,
                setFontBold,
                fontRegular, 
                setFontRegular,
                fontLight,
                setFontLight,
                gazeTimer, setGazeTimer,
                gazedPinId, setGazedPinId,
                gazedGroupRef,
                radius,
                zoomState,setZoomState,
                isProjectInitialize,
                setIsProjectInitialize
            }}
        >
            {/* <div
                id='testing'
                style={{
                    background:`red`,
                    position:`fixed`,
                    zIndex:100,
                    width:`20%`,
                    height:`20%`
                }}
            >

            </div> */}
            <WindowEvent/>
            <div
                ref={masterContainerRef}
                className='bg-darkest-grey' 

                draggable={false}
                style={{
                    cursor:`grab`,
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
                onTouchEnd={(e)=>{handleTouchEnd(e)}}
                onMouseUp={(e)=>{handleMouseUp(e)}}
            >
                <Ui/>
                <Gl/>
            </div>
        </VrViewerStaticContext.Provider>
    );
}
 
export default VrViewerStatic;