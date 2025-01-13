import { createContext, useContext, Dispatch, SetStateAction, useState, useRef,Suspense, useEffect } from 'react';
import { VrViewerContext } from '..';
import { InfoPinpointType, MapType, MeasurementStateType, MeasurementType, MovementType, PinpointType, PlayerType, PointType, PointerType, PointsType, SceneType, SpatialAudioType, TouchesType, ViewListType, VrProjectType, infoPinpointObject, mapObject, measurementStateObject, movementObject, pinpointObject, playerObject, pointerObject, pointsObject, sceneObject, spatialAudioObject, touchesObject, viewListObject } from '@/types/vrProjectType';
import * as THREE from'three'
import { isAndroid, isDesktop, isMobile } from 'react-device-detect';
import { Power4, gsap } from 'gsap';
import WindowEvent from './windowEvent';
import DragDropZipFile from './dragDropZipFile';
import { CustomPinpointType } from '@/types/vrProjectType';
import { customPinpointObject } from '@/types/vrProjectType';
import _ from 'lodash';
import { AmbientSoundType, ambientSoundObject } from '@/types/ambientSoundType';
import Ui from './ui';
import Gl from './gl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import useAnimation from '@/hooks/animation';
import { ZoomStateType } from '@/types/zoomState';

type VrViewerDynamicContextType = {
    selectedProject:VrProjectType, 
    setSelectedProject:Dispatch<SetStateAction<VrProjectType>>,
    mainMeshRef:any,
    currentView:ViewListType, 
    setCurrentView:Dispatch<SetStateAction<ViewListType>>
    nextView:ViewListType, 
    setNextView:Dispatch<SetStateAction<ViewListType>>,
    mainGeometry:any, 
    setMainGeometry:Dispatch<SetStateAction<any>>,
    selectedScene:SceneType, 
    setSelectedScene:Dispatch<SetStateAction<SceneType>>,
    material360:any, 
    setMaterial360:Dispatch<SetStateAction<any>>,
    camera:any, 
    setCamera:Dispatch<SetStateAction<any>>,
    cameraRig:any,
    setCameraRig:Dispatch<SetStateAction<any>>,
    centerRig:any, 
    setCenterRig:Dispatch<SetStateAction<any>>,
    mouse:any, 
    setMouse:Dispatch<SetStateAction<any>>,
    player:PlayerType, 
    setPlayer:Dispatch<SetStateAction<PlayerType>>,
    touches:TouchesType, 
    setTouches:Dispatch<SetStateAction<TouchesType>>,
    enableZoom:boolean, 
    setEnableZoom:Dispatch<SetStateAction<boolean>>,
    showUi:boolean, 
    setShowUi:Dispatch<SetStateAction<boolean>>,
    isFullscreen:boolean, 
    setIsFullscreen:Dispatch<SetStateAction<boolean>>,
    scene:any, 
    setScene:Dispatch<SetStateAction<any>>,
    gl:any, 
    setGl:Dispatch<SetStateAction<any>>,
    isXrMode:boolean, 
    setIsXrMode:Dispatch<SetStateAction<boolean>>,
    pointer:PointerType, 
    setPointer:Dispatch<SetStateAction<PointerType>>,
    movement:MovementType, 
    setMovement:Dispatch<SetStateAction<MovementType>>,
    dollHouseMaterial:any, 
    setDollHouseMaterial:Dispatch<SetStateAction<any>>,
    isDollHouseMode:boolean,
    setIsDollHouseMode:Dispatch<SetStateAction<boolean>>,
    centerPosition:any, 
    setCenterPosition:Dispatch<SetStateAction<any>>,
    clippingPlane:any, 
    setClippingPlane:Dispatch<SetStateAction<any>>,
    isEditorMode:boolean, 
    setIsEditorMode:Dispatch<SetStateAction<boolean>>,
    isAutoplay:boolean,
    setIsAutoplay:Dispatch<SetStateAction<boolean>>,
    masterContainerRef:any,
    enableDoc:boolean, 
    setEnableDoc:Dispatch<SetStateAction<boolean>>,
    parallaxTeleport:(view:ViewListType, duration:number) => void,
    xrTeleport :(view:ViewListType) => void,
    isMeasureMode:boolean, 
    setIsMeasureMode:Dispatch<SetStateAction<boolean>>,
    measurementCursorRef:any,
    measurementState:MeasurementStateType, 
    setMeasurementState:Dispatch<SetStateAction<MeasurementStateType>>,
    measurementArray:PointsType[], 
    setMeasurementArray:Dispatch<SetStateAction<PointsType[]>>,
    selectedMeasurement:PointsType, 
    setSelectedMeasurement:Dispatch<SetStateAction<PointsType>>,
    isGameStart:boolean, 
    setIsGameStart:Dispatch<SetStateAction<boolean>>,
    bufferProgress:number,
    setBufferProgress:Dispatch<SetStateAction<number>>,
    toDollHouse:Function,
    toWalkMode:Function,
    borderRadius:string,
    setShowInfo:Dispatch<SetStateAction<boolean>>
    showInfo:boolean, 
    selectedCustomPinpoint:CustomPinpointType, 
    setSelectedCustomPinpoint:Dispatch<SetStateAction<CustomPinpointType>>,
    selectedMap:MapType, 
    setSelectedMap:Dispatch<SetStateAction<MapType>>,
    mapContainerRef:any,
    isDev:boolean,
    draggedView:ViewListType, 
    setDraggedView:Dispatch<SetStateAction<ViewListType>>,
    selectedPinpoint:PinpointType, 
    setSelectedPinpoint:Dispatch<SetStateAction<PinpointType>>,
    isTeleportCirclesEnable:boolean, 
    setIsTeleportCirclesEnable:Dispatch<SetStateAction<boolean>>,
    isDragInfoPinpoint:boolean, 
    setIsDragInfoPinpoint:Dispatch<SetStateAction<boolean>>,
    selectedDraggedInfoPinpoint:InfoPinpointType, 
    setSelectedDraggedInfoPinpoint:Dispatch<SetStateAction<InfoPinpointType>>,
    dollHouseTexture:any, 
    setDollHouseTexture:Dispatch<SetStateAction<any>>,
    selectedZoom:number, 
    setSelectedZoom:Dispatch<SetStateAction<number>>,
    isUploading:boolean,
    setIsUploading:Dispatch<SetStateAction<boolean>>,
    instructionRef:any,
    showInstruction:(text:string, duration:number, onClickCancel:boolean) => any,
    enableOrbitControl:boolean, 
    setEnableOrbitControl:Dispatch<SetStateAction<boolean>>,
    loadingProgress:number,
    setLoadingProgress:Dispatch<SetStateAction<number>>,
    selectedSpatialAudio:SpatialAudioType, 
    setSelectedSpatialAudio:Dispatch<SetStateAction<SpatialAudioType>>,
    isDragSpatialAudio:boolean, 
    setIsDragSpatialAudio:Dispatch<SetStateAction<boolean>>,
    selectedAmbientSound:AmbientSoundType, 
    setSelectedAmbientSound:Dispatch<SetStateAction<AmbientSoundType>>,
    flooredViewArray:ViewListType[], 
    setFlooredViewArray:Dispatch<SetStateAction<ViewListType[]>>,
    gazeTimer:number, 
    setGazeTimer:Dispatch<SetStateAction<number>>,
    gazedViewId:string, 
    setGazedViewId:Dispatch<SetStateAction<string>>,
    gazedGroupRef:any,
    xrPlayer:any,
    setXrPlayer:Dispatch<SetStateAction<any>>,
    gltfLoader:GLTFLoader,
    zoomState:ZoomStateType, 
    setZoomState:Dispatch<SetStateAction<ZoomStateType>>,
    isTeleportCircleTouchDown:boolean, 
    setIsTeleportCircleTouchDown:Dispatch<SetStateAction<boolean>>,
    isProjectInitialize:boolean, 
    setIsProjectInitialize:Dispatch<SetStateAction<boolean>>
}
export const VrViewerDynamicContext = createContext<VrViewerDynamicContextType>({} as VrViewerDynamicContextType)

const VrViewerDynamic = () => {
    const [xrPlayer, setXrPlayer] = useState(null as any)

    // Buffer state
    const [bufferProgress, setBufferProgress] = useState(0)

    // Selected Project
    const {
        selectedProject, setSelectedProject, 
        loadingProgress, setLoadingProgress,
        enableOrbitControl, setEnableOrbitControl,
        selectedScene, setSelectedScene,
        currentView, setCurrentView,
        nextView, setNextView,
        loadingManager,
        loginUser
    } = useContext(VrViewerContext)

    const gltfLoader = new GLTFLoader(loadingManager);
    // Mouse state
    const[mouse, setMouse] = useState({
        isClicked: false,
        location: new THREE.Vector2(),
        movement: new THREE.Vector2(),
    })

    // Is Project Initialize
    const [isProjectInitialize, setIsProjectInitialize] = useState(false)

    // Main geometry
    const [mainGeometry, setMainGeometry] = useState(new THREE.SphereGeometry(1,16,16))
    const mainMeshRef = useRef<any>(null as any)

    // Material 360
    const [material360, setMaterial360] = useState(new THREE.MeshStandardMaterial())

    //Init camera
    const [camera, setCamera] = useState({
        fov:0,
        updateProjectionMatrix: ()=>{

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
        },
        getWorldDirection:(any:any):any=>{}
    })
    // Rig
    const [cameraRig, setCameraRig] = useState(new THREE.Group())
    const [centerRig, setCenterRig] = useState(new THREE.Group())

    // Master Container
    const masterContainerRef = useRef<HTMLDivElement>(null)

    // Init variable
    const [gl, setGl] = useState('' as any)
    const [scene, setScene] = useState('' as any)

    // Player State
    const [player, setPlayer] = useState(playerObject)

    // Touch State
    const[touches, setTouches] = useState(touchesObject)

    // Zoom
    const [enableZoom, setEnableZoom] = useState(true)

    // Show Ui
    const [showUi, setShowUi] = useState(true)

    // Fullscreen State
    const [isFullscreen, setIsFullscreen] = useState(false)

    // XR Mode
    const [isXrMode, setIsXrMode] = useState(false)

    // Pointer
    const [pointer, setPointer] = useState(pointerObject)

    // WASD Movement State
    const [movement, setMovement] = useState(movementObject)

    // Center position
    const [centerPosition, setCenterPosition] = useState(new THREE.Vector3())

    // Doll house
    const [isDollHouseMode, setIsDollHouseMode] = useState(false)
    const [dollHouseMaterial, setDollHouseMaterial] = useState(new THREE.MeshBasicMaterial())
    const [clippingPlane, setClippingPlane] = useState(new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), selectedProject.globalSettings.dollHouse.sectionHeight ))
    const [dollHouseTexture, setDollHouseTexture] = useState(null)

    // Editor Mode
    const [isEditorMode, setIsEditorMode] = useState(false)

    // Autoplay
    const [isAutoplay, setIsAutoplay] = useState(false)

    // DOC
    const [enableDoc, setEnableDoc] = useState(false)

    // Measurement MODE
    const [isMeasureMode, setIsMeasureMode] = useState(false)
    const [measurementState, setMeasurementState] = useState(measurementStateObject)
    const measurementCursorRef = useRef<HTMLDivElement>(null)
    const [measurementArray, setMeasurementArray] = useState([] as PointsType[])
    const [selectedMeasurement, setSelectedMeasurement] = useState(pointsObject)

    // Is Game Start
    const [isGameStart, setIsGameStart] = useState(selectedProject.globalSettings.loading.autoLoad? true : false)

    // Wheel State
    const [wheelState, setWheelState] = useState({
        scrollAmount:0
    })

    useEffect(()=>{
        const myInterval = setInterval(()=>{
            wheelState.scrollAmount = 0
        },300)

        return()=>{
            clearInterval(myInterval)
        }
    },[])

    // Border Radius
    const borderRadius = `4px`

    // Show Info
    const [showInfo, setShowInfo] = useState(false)

    // Custom Pinpoint
    const [selectedCustomPinpoint, setSelectedCustomPinpoint] = useState(customPinpointObject)

    // Selected Map
    const [selectedMap, setSelectedMap] = useState(mapObject)

    //
    const mapContainerRef = useRef<HTMLDivElement>()

    // Is Dev
    const isDev = (loginUser.email === selectedProject.email && loginUser.email !== '')|| _.includes(['storage.koma@gmail.com','pongo.devs@gmail.com','remitriadi@gmail.com'],loginUser.email)

    // Dragged View
    const [draggedView, setDraggedView] = useState<ViewListType>(viewListObject)

    // Selected Pinpoint
    const [selectedPinpoint, setSelectedPinpoint] = useState<PinpointType>(pinpointObject)

    // Teleport Circles
    const [isTeleportCirclesEnable, setIsTeleportCirclesEnable] = useState(true)

    // Info Pinpoint
    const [isDragInfoPinpoint, setIsDragInfoPinpoint] = useState(false)
    const [selectedDraggedInfoPinpoint, setSelectedDraggedInfoPinpoint] = useState(infoPinpointObject)

    // Zoom State
    const [selectedZoom, setSelectedZoom] = useState(1)

    // Uploading State
    const [isUploading, setIsUploading] = useState(false)

    // Spatial Audio
    const [selectedSpatialAudio, setSelectedSpatialAudio] = useState(spatialAudioObject)
    const [isDragSpatialAudio, setIsDragSpatialAudio] = useState(false)

    const [selectedAmbientSound, setSelectedAmbientSound] = useState(ambientSoundObject)

    //Create normalize position for every circle object
    const [flooredViewArray, setFlooredViewArray] = useState<ViewListType[]>([])

    // Mobile zoom state
    const [previousFov, setPreviousFov] = useState(0)
    const [startTouchDistance, setStartTouchDistance] = useState(0)
    const [touchCount, setTouchCount] = useState(0)

    // Gaze control
    const [gazeTimer, setGazeTimer] = useState(0)
    const [gazedViewId, setGazedViewId] = useState("")
    const gazedGroupRef = useRef(null as any)

    // Zoom state
    const [zoomState, setZoomState] = useState({
        zoomSpeed:0
    })

    // Teleport Touch Down
    const [isTeleportCircleTouchDown, setIsTeleportCircleTouchDown] = useState(false)

    // UI Hidden Instruction
    const instructionRef = useRef<HTMLDivElement>(null)
    let timeout:any = null
    const showInstruction = (text:string, duration:number, onClickCancel:boolean)=>{
        if(instructionRef.current){
            // Clear timeout
            if(timeout){
                clearTimeout(timeout as any)
            }
            // Change text
            instructionRef.current.innerHTML = text
            // Hover to top
            instructionRef.current.style.opacity = `100%`
            instructionRef.current.style.transform = `translateY(0rem)`
            timeout = setTimeout(()=>{
                if(instructionRef.current){
                    instructionRef.current.style.opacity = `0%`
                    instructionRef.current.style.transform = `translateY(5rem)`
                }
            }, duration * 1000)
        }
    }
    // When game start, show instruction
    useEffect(()=>{
        if(isGameStart === true && selectedProject.globalSettings.instruction.showInstruction){
            showInstruction('CLICK AND DRAG TO LOOK AROUND', 3, false)
        }
    },[isGameStart])

    const xrTeleport = (view:ViewListType)=>{
        const flooredView = flooredViewArray.find(v=>{return v._id == view._id})
        const originalView = selectedScene.viewList.find(v=>{return v._id == view._id})
        if(flooredView && originalView){
            cameraRig.position.x = flooredView.position.x
            cameraRig.position.y = flooredView.position.y
            cameraRig.position.z = flooredView.position.z
            
            xrPlayer.position.x = flooredView.position.x
            xrPlayer.position.y = flooredView.position.y
            xrPlayer.position.z = flooredView.position.z

    
            mainMeshRef.current.material.uniforms.currentTexture.value = originalView.texture
            mainMeshRef.current.material.uniforms.currentOrigin.value = originalView.position
        }
    }

    const {animate} = useAnimation()

    
    const parallaxTeleport = (view:ViewListType, duration:number)=>{
        console.log('PARALAX TELEPORT')
        if(touchCount > 1) return
        if(isMeasureMode) return
        if(selectedDraggedInfoPinpoint._id !== '') return 
        player.isTeleport = true
        const finalDuration = isDollHouseMode? 2: duration

        // Since the teleport calculate raycasted location view instead of the original, to find the view according to it's scene needs some index calculation
        const findIndexes = selectedProject.scenes.map((scene:SceneType)=>{
            return scene.viewList.findIndex((v)=>{return v._id == view._id})
        })
        const findIndex = findIndexes.filter(number=>{return number !== -1})
        if(findIndex.length > 0){
            const teleportIndex = findIndex[0]
            const teleportView = selectedScene.viewList[teleportIndex]
            if(isDollHouseMode){
                const mod = centerRig.rotation.y % (Math.PI * 2)
                centerRig.rotation.y = mod
    
                animate(centerRig.position,{
                    x:0,
                    y:0,
                    z:0,
                    duration:finalDuration,
                    onStart:()=>{
                        player.isViewTransition = true
                        if(mainMeshRef.current.material.uniforms){
                            mainMeshRef.current.material.uniforms.nextTexture.value = teleportView.texture
                            mainMeshRef.current.material.uniforms.nextOrigin.value = teleportView.position
                        }
                        setNextView(teleportView)
                    },
                    onUpdate:()=>{
                        player.isTeleport = true
                    },
                    onComplete:()=>{
                        mainMeshRef.current.material = material360
                        player.isTeleport = false
                        player.isViewTransition = false
                        mainMeshRef.current.material.uniforms.currentTexture.value = teleportView.texture
                        mainMeshRef.current.material.uniforms.currentOrigin.value = teleportView.position
                        mainMeshRef.current.material.uniforms.mixColor.value = 0
                        setCurrentView(teleportView)
                        setIsDollHouseMode(false)
                    }
                })
                animate(centerRig.rotation,{
                    x:0,
                    y:0,
                    z:0,
                    duration:finalDuration
                })
                animate(cameraRig.position,{
                    x:teleportView.position.x, 
                    y:teleportView.position.y,
                    z:teleportView.position.z,
                    duration:finalDuration, 
                })
            }
            else{
                animate(cameraRig.position,{
                    x:teleportView.position.x, 
                    y:teleportView.position.y,
                    z:teleportView.position.z,
                    ease:`power3.out`,
                    duration:finalDuration, 
                    onStart:()=>{
                        player.isViewTransition = true
                        if(mainMeshRef.current.material.uniforms){
                            mainMeshRef.current.material.uniforms.nextTexture.value = teleportView.texture
                            mainMeshRef.current.material.uniforms.nextOrigin.value = selectedProject.globalSettings.transition.style === 'parallax'? teleportView.position : cameraRig.position
                        }
                        setNextView(teleportView)
                    },
                    onUpdate:(progress)=>{
                        mainMeshRef.current.material.uniforms.mixColor.value = Math.pow(progress,0.8)
                        player.isTeleport = true
                    },
                    onComplete:()=>{
                        player.isTeleport = false
                        player.isViewTransition = false
                        mainMeshRef.current.material.uniforms.currentTexture.value = teleportView.texture
                        mainMeshRef.current.material.uniforms.currentOrigin.value = selectedProject.globalSettings.transition.style === 'parallax'? teleportView.position : cameraRig.position
                        mainMeshRef.current.material.uniforms.mixColor.value = 0
                        setCurrentView(teleportView)
                    }
                })
            }
        }
    }

    // To Walk Mode
    const toWalkMode = ()=>{
        if(!player.isTeleport){
            // Animate
            const duration = 2

            // Normalize the rotation before animation
            animate(centerRig.rotation,{
                y:centerRig.rotation.y % (Math.PI * 2),
                duration:duration
            })
            centerRig.rotation.y = centerRig.rotation.y % (Math.PI * 2)

            animate(cameraRig.position,{
                x:0,
                y:0,
                z:0,
                duration:2
            })

            animate(centerRig.position,{
                x:0,
                y:0,
                z:0,
                duration:2
            })
            
            animate(centerRig.rotation,{
                x:0,
                y:0,
                z:0,
                duration:duration,
            })
            animate(cameraRig.position,{
                x:currentView.position.x,
                y:currentView.position.y,
                z:currentView.position.z,
                duration:duration,
                onUpdate:()=>{
                    player.isTeleport = true
                },
                onComplete:()=>{
                    player.isTeleport = false
                    setIsDollHouseMode(false)
                    mainMeshRef.current.material = material360
                }
            })
        }
    }

    // To Doll House
    const toDollHouse = ()=>{
        // Set state
        setIsAutoplay(false)
        // 
        const cameraForwardVector = camera.getWorldDirection(new THREE.Vector3())
        const bb = new THREE.Vector3().copy(mainGeometry.boundingBox?.max as any).sub(mainGeometry.boundingBox?.min as any)
        const bbHeight = Math.abs(bb.y)
        setIsDollHouseMode(true)
        const duration = 2
        animate(centerRig.position,{
            x:centerPosition.x,
            y:centerPosition.y,
            z:centerPosition.z,
            duration:duration,
            onUpdate:()=>{
                player.isTeleport = true
            },
            onComplete:()=>{
                player.isTeleport = false
            }
        })
        animate(cameraRig.position,{
            x: -cameraForwardVector.x * 3,
            y: bbHeight * 1,
            z: -cameraForwardVector.z * 3,
            duration:duration
        })
        
        mainMeshRef.current.material = dollHouseMaterial
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
            measurementState.phase !== 2 && 
            !showInfo &&
            selectedDraggedInfoPinpoint._id === ''
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
        if(isDesktop && 
            mouse.isClicked && 
            enableOrbitControl && 
            (isGameStart || selectedProject.globalSettings.loading.autoLoad) && 
            measurementState.phase !== 2 && 
            !showInfo &&
            selectedDraggedInfoPinpoint._id === ''
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
        if(masterContainerRef.current){
            if(!isMeasureMode){
                masterContainerRef.current.style.cursor = `grabbing`
            }
        }
        if(isDesktop){
            mouse.isClicked = true
            player.canTeleport = true
            player.canTurnOnTv = true
        }
    }
    
    const handleMouseUp = (e:any)=>{
        setEnableOrbitControl(true)
        if(masterContainerRef.current){
            if(!isMeasureMode){
                masterContainerRef.current.style.cursor = `grab`
            }
        }
        if(isDesktop){
            mouse.isClicked = false
            player.canTeleport = true
            player.canTurnOnTv = true
        }
    }
    return (  
        <VrViewerDynamicContext.Provider
            value={{
                selectedProject, setSelectedProject,
                mainMeshRef,
                currentView, setCurrentView,
                nextView, setNextView,
                mainGeometry, setMainGeometry,
                selectedScene, setSelectedScene,
                material360, setMaterial360,
                camera, setCamera,
                cameraRig,setCameraRig,
                centerRig,
                setCenterRig,
                mouse,setMouse,
                player,setPlayer,
                touches,setTouches,
                enableZoom,setEnableZoom,
                showUi,setShowUi,
                isFullscreen, setIsFullscreen,
                scene, setScene,
                gl, setGl,
                isXrMode, setIsXrMode,
                pointer, setPointer,
                movement,setMovement,
                dollHouseMaterial, setDollHouseMaterial,
                isDollHouseMode,
                setIsDollHouseMode,
                centerPosition, setCenterPosition,
                clippingPlane, setClippingPlane,
                isEditorMode, setIsEditorMode,
                isAutoplay, setIsAutoplay,
                masterContainerRef,
                enableDoc, setEnableDoc,
                parallaxTeleport,
                xrTeleport,
                isMeasureMode,
                setIsMeasureMode,
                measurementCursorRef,
                measurementState, setMeasurementState,
                measurementArray, setMeasurementArray,
                selectedMeasurement, setSelectedMeasurement,
                isGameStart, setIsGameStart,
                bufferProgress, setBufferProgress,
                toDollHouse,
                toWalkMode,
                borderRadius,
                showInfo, setShowInfo,
                selectedCustomPinpoint, setSelectedCustomPinpoint,
                selectedMap, setSelectedMap,
                mapContainerRef,
                isDev,
                draggedView, setDraggedView,
                selectedPinpoint, setSelectedPinpoint,
                isTeleportCirclesEnable, setIsTeleportCirclesEnable,
                isDragInfoPinpoint, setIsDragInfoPinpoint,
                selectedDraggedInfoPinpoint, setSelectedDraggedInfoPinpoint,
                dollHouseTexture, setDollHouseTexture,
                selectedZoom, setSelectedZoom,
                isUploading, setIsUploading,
                instructionRef,
                showInstruction,
                enableOrbitControl, setEnableOrbitControl,
                loadingProgress, setLoadingProgress,
                selectedSpatialAudio, setSelectedSpatialAudio,
                isDragSpatialAudio, setIsDragSpatialAudio,
                selectedAmbientSound, setSelectedAmbientSound,
                flooredViewArray, setFlooredViewArray,
                gazeTimer, setGazeTimer,
                gazedViewId, setGazedViewId,
                gazedGroupRef,
                xrPlayer, setXrPlayer,
                gltfLoader,
                zoomState,setZoomState,
                isTeleportCircleTouchDown,setIsTeleportCircleTouchDown,
                isProjectInitialize, setIsProjectInitialize
            }}
        >
            <WindowEvent/>
            {selectedProject.scenes.length === 0?
                <DragDropZipFile/>
            :null}
            <div
                ref={masterContainerRef}
                draggable={false}
                style={{
                    background: `radial-gradient(circle, rgba(55,55,55,1) 0%, rgba(40,40,40,1) 100%)`,
                    cursor:isMeasureMode?`initial`:`grab`,
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
                
                <Ui/>
                <Gl/>
            </div>
            
        </VrViewerDynamicContext.Provider>
    );
}
 
export default VrViewerDynamic;