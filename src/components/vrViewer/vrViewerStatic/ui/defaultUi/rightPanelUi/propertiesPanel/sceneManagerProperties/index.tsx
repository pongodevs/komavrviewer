import { BsSun } from "react-icons/bs";
import {useContext} from 'react';
import { SceneType, sceneObject } from "@/types/vrProjectType";
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import { v4 } from "uuid";
import _ from "lodash";
import EnumList from "@/components/homepage/bodyContainer/vrViewer/common/enumList";

const SceneManagerProperties = () => {
    const {selectedScene, setSelectedScene, changeScene, mainMeshRef} = useContext(VrViewerStaticContext)
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    const imageUrlArray = selectedScene.viewList.map(view=>{return view.imageUrl})
    const imageUrlIsEmpty = _.includes(imageUrlArray, '')
    return (  
        <>
            <EnumList
                disableClick={imageUrlIsEmpty}
                disableAll={imageUrlIsEmpty}
                enumList={selectedProject.scenes}
                labelKey='sceneName'
                defaultObject={sceneObject}
                icon={<BsSun size={15}/>}
                setSelected={setSelectedScene}
                selected={selectedScene}
                defaultName='Scene'
                disableMinus={selectedProject.scenes.length <= 1}
                onPlus={()=>{
                    const primaryScenes = selectedProject.scenes[0]
                    const newEnum:SceneType = {...primaryScenes,
                        _id:v4(),
                        sceneName:`${primaryScenes.sceneName} Copy`,
                        type:`secondary`
                    }
                    selectedProject.scenes.push(newEnum)
                    setSelectedScene(newEnum)
                }}
                onClick={(scene:SceneType)=>{
                    changeScene(scene)
                }}
            />
        </>
    );
}
 
export default SceneManagerProperties;