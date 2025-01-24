import { SceneType, ViewListType, VrProjectType, sceneObject, viewListObject, vrProjectObject } from "@/types/vrProjectType";
import { Dispatch,  SetStateAction, createContext, useEffect, useState } from "react";
import VrViewerStatic from "./vrViewerStatic";
import { useRouter } from "next/router";
import * as THREE from 'three'
import LoadingManager from "./loadingManager";
import useDecoder from "@/hooks/decoder";
import _ from "lodash";
import { userObject, UserType } from "@/types/userType";
import DialogBoxContainer from "./dialogBoxContainer";
import LoadingOverlay from "./loadingOverlay";
import useMainUrl from "@/hooks/mainUrl";


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
    setIsLocal:Dispatch<SetStateAction<boolean>>,
}
export const VrViewerContext = createContext<VrViewerContextType>({} as VrViewerContextType)

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)


const VrViewer = ({vrProject}:{vrProject:VrProjectType}) => {
    const [selectedProject, setSelectedProject] = useState(vrProject)
    // Global Variable
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
    const  {projectId} = router.query

    const {decode16BitPng} = useDecoder()

    const [loginUser, setLoginUser] = useState(userObject)

    const isDev = router.route.toLowerCase().includes('developer')
    // Is local
    const [isLocal, setIsLocal] = useState(false)
    const {mainUrl} = useMainUrl()


    // Init project
    useEffect(()=>{
        const init = async ()=>{
            // If there's no project, go back to VR browser page
            const project = {...selectedProject}
            if(project.type === 'static'){
                const newScenes = project.scenes.map((scene)=>{
                    const viewList = scene.viewList.map((view:ViewListType)=>{
                        // const urlToLoad = view.imageUrl
                        
                        // const urlToLoad = `/project/scenes/${scene.sceneName}/${view.viewName}.jpg` LOCAL
                        const urlToLoad = `${mainUrl}/scenes/${scene.sceneName}/${view.viewName}.jpg`.replaceAll(' ','%20')
                        console.log(urlToLoad)
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
            setSelectedProject(project)
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
                isLocal,setIsLocal,
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
                </>
            :null}
        </VrViewerContext.Provider>
    );
}
 
export default VrViewer;


