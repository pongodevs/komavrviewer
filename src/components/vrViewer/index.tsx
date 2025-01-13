import { SceneType, ViewListType, VrProjectType, sceneObject, viewListObject, vrProjectObject } from "@/types/vrProjectType";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import VrViewerStatic from "./vrViewerStatic";
import { doc, getDoc } from "firebase/firestore";
import useFirebase from "@/hooks/firebase";
import { useRouter } from "next/router";
import VrViewerDynamic from "./vrViewerDynamic";
import * as THREE from 'three'
import { isDesktop } from "react-device-detect";
import LoadingManager from "./loadingManager";
import VrViewerDepth from "./vrViewerDepth";
import useDecoder from "@/hooks/decoder";
import _ from "lodash";
import { userObject, UserType } from "@/types/userType";
import jwtDecode from "jwt-decode";
import DialogBoxContainer from "./dialogBoxContainer";
import LoadingOverlay from "./loadingOverlay";


type VrViewerContextType = {
    selectedProject:VrProjectType, 
    setSelectedProject:Dispatch<SetStateAction<VrProjectType>>,
    loadingManager:any,
    loadingProgress:number, 
    setLoadingProgress:Dispatch<SetStateAction<number>>,
    loadingProcessName:string, 
    setLoadingProcessName:Dispatch<SetStateAction<string>>,
    enableOrbitControl:boolean, 
    setEnableOrbitControl:Dispatch<SetStateAction<boolean>>,
    selectedScene:SceneType, 
    setSelectedScene:Dispatch<SetStateAction<SceneType>>,
    currentView:ViewListType, 
    setCurrentView:Dispatch<SetStateAction<ViewListType>>,
    nextView:ViewListType, 
    setNextView:Dispatch<SetStateAction<ViewListType>>,
    textureLoader:THREE.TextureLoader,
    loadedViews:ViewListType[],
    setLoadedViews:Dispatch<SetStateAction<ViewListType[]>>,
    loginUser:UserType, 
    setLoginUser:Dispatch<SetStateAction<UserType>>,
    showDialogBox:JSX.Element, 
    setShowDialogBox:Dispatch<SetStateAction<JSX.Element>>,
    loadingText:string,
    setLoadingText:Dispatch<SetStateAction<string>>,
    isDev:boolean,
    isLocal:boolean,
    setIsLocal:Dispatch<SetStateAction<boolean>>
}
export const VrViewerContext = createContext<VrViewerContextType>({} as VrViewerContextType)

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)


const VrViewer = () => {
    // Global Variable
    const [selectedProject, setSelectedProject] = useState<VrProjectType>(vrProjectObject)
    const [enableOrbitControl, setEnableOrbitControl] = useState(true)
    const [selectedScene, setSelectedScene] = useState(sceneObject)
    const [currentView, setCurrentView] = useState(viewListObject)
    const [nextView, setNextView] = useState(viewListObject)

    // Loading State
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [loadingProcessName, setLoadingProcessName] = useState('Please wait...')

    // Depth VR
    const [loadedViews, setLoadedViews] = useState([] as ViewListType[])


    const router = useRouter()
    const {db} = useFirebase()
    const  {projectId} = router.query

    const {decode16BitPng} = useDecoder()

    const [loginUser, setLoginUser] = useState(userObject)

    const isDev = router.route.toLowerCase().includes('developer')
    // Is local
    const [isLocal, setIsLocal] = useState(false)
    useEffect(()=>{
        if(origin === 'http://localhost:3000'){
            setIsLocal(true)
        }
    },[])

    // Set Login user
    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            setLoginUser(jwtDecode(token))
        }
        else{
            // router.push('/vrProjects/allProjects')
        }
    },[])

    // Init project
    useEffect(()=>{
        const init = async ()=>{
            
            if(!projectId) return
            const projectDoc = doc(db, 'vrProjects', projectId as string)
            const project = (await getDoc(projectDoc)).data() as VrProjectType
            // If there's no project, go back to VR browser page
            if(project){
                if(project.scenes.length > 0){
                    if(project.type === 'depth'){
                        if(project.globalSettings.loading.autoLoad){
                            // Load all texture to each view
                            const newProjectScenesPromises = project.scenes.map(async(scene:any)=>{
                                const viewList = scene.viewList.map(async(view:ViewListType)=>{
                                    const urlToLoad = isDesktop? view.imageUrl6000 : view.imageUrl4000
                                    const texture = textureLoader.load(urlToLoad)
                                    texture.magFilter = THREE.LinearFilter
                                    texture.minFilter = THREE.LinearFilter
        
                                    const depth = await decode16BitPng(view.depthUrl)
                                    
                                    return {...view,
                                        texture:texture,
                                        depthMacroTexture: depth.macroTexture,
                                        depthMicroTexture: depth.microTexture
                                    }
                                })
                                return {...scene,
                                    viewList:await Promise.all(viewList)
                                }
                            })
                            const newProjectScenes = await Promise.all(newProjectScenesPromises)
                            const allLoadedScenes:SceneType[] = newProjectScenes.map(s=>{
                                return s.viewList
                            })

                            const allLoadedViews:any = _.flatten(allLoadedScenes)
                            setLoadedViews(allLoadedViews)

                            project.scenes = newProjectScenes
                        }
                        setSelectedProject(project)
                    }
                    if(project.type === 'dynamic'){
                        const newScenes = project.scenes.map((scene:any)=>{
                            const viewList = scene.viewList.map((view:ViewListType)=>{
                                const urlToLoad = isDesktop? view.imageUrl6000 : view.imageUrl4000
                                const texture = textureLoader.load(urlToLoad)
                                texture.magFilter = THREE.LinearFilter
                                texture.minFilter = THREE.LinearFilter
    
                                return {...view,
                                    texture:texture,
                                }
                                
                            })
                            return {...scene,
                                viewList:viewList
                            }
                        })
                        project.scenes = newScenes
                        setSelectedProject(project)  
                    }
                    if(project.type === 'static'){
                        const newScenes = project.scenes.map((scene:any)=>{
                            const viewList = scene.viewList.map((view:ViewListType)=>{
                                const urlToLoad = view.imageUrl
                                const texture = textureLoader.load(urlToLoad)
                                texture.magFilter = THREE.LinearFilter
                                texture.minFilter = THREE.LinearFilter
    
                                return {...view,
                                    texture:texture,
                                }
                                
                            })
                            return {...scene,
                                viewList:viewList
                            }
                        })
                        project.scenes = newScenes
                        setSelectedProject(project)  
                    }
                } 
                setSelectedProject(project)
            }
            else{
                router.push('/vrProjects/allProjects')
            }
        }
        init()
    },[projectId])

    const [showDialogBox, setShowDialogBox] = useState(<></>)
    const [loadingText, setLoadingText] = useState('')

    return (  
        <VrViewerContext.Provider
            value={{
                selectedProject, setSelectedProject,
                loadingManager,
                loadingProgress, setLoadingProgress,
                loadingProcessName, setLoadingProcessName,
                enableOrbitControl, setEnableOrbitControl,
                selectedScene, setSelectedScene,
                currentView, setCurrentView,
                nextView, setNextView,
                textureLoader,
                loadedViews, setLoadedViews,
                loginUser, setLoginUser,
                showDialogBox,setShowDialogBox,
                loadingText,setLoadingText,
                isDev,
                isLocal,setIsLocal
            }}
        >
            {selectedProject._id !== ''?
                <>
                    {Object.keys(showDialogBox.props).length !== 0?
                        <DialogBoxContainer/>
                    :null}
                    {loadingText !== ''?
                        <LoadingOverlay/>
                    :null}
                    <LoadingManager/>
                    {selectedProject.type === 'static'?
                        <VrViewerStatic/>
                    :null}
                    {selectedProject.type === 'dynamic'?
                        <VrViewerDynamic/>
                    :null}
                    {selectedProject.type === 'depth'?
                        <VrViewerDepth/>
                    :null}
                </>
            :null}
        </VrViewerContext.Provider>
    );
}
 
export default VrViewer;


