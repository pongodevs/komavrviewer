import {useContext} from 'react';
import { VrViewerDepthContext } from '../../../..';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';

const UseMap = () => {
    const {selectedMap, currentView} = useContext(VrViewerDepthContext)
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    return (  
        <div
            className='text-white bg-blue no-select'
            style={{
                fontSize:`1.4rem`,
                fontWeight:`600`,
                padding:`0.5rem 1rem`,
                position:`absolute`,
                bottom:`1rem`,
                right:`1rem`,
                minWidth:`10rem`,
                zIndex:`15`,
                cursor:currentView.mapId === selectedMap._id? `initial`:`pointer`,
                borderRadius:`10px`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                transition:`all 0.2s`,
                opacity:currentView.mapId === selectedMap._id? `50%`:`100%`
            }}
            onClick={()=>{
                if(currentView.mapId !== selectedMap._id){
                    currentView.mapId = selectedMap._id
                    console.log(selectedMap.mapName)
                    selectedProject.scenes = selectedProject.scenes.map(scene=>{
                        return {...scene,
                            viewList:scene.viewList.map(view=>{
                                if(view._id === currentView._id){
                                    return {...view,
                                        mapId:selectedMap._id
                                    }
                                }
                                else{
                                    return view
                                }
                            })
                        }
                    })
                    setSelectedProject(prev=>{return {...prev}})
                }
            }}
        >
            Use Map
        </div>
    );
}
 
export default UseMap;