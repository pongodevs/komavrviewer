import {useState,useContext, useRef, useEffect} from 'react';
import { toast } from 'react-toastify';
import { PinpointContext } from '..';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import { isMobile } from 'react-device-detect';
import { ViewPinpointContainerContext } from '../..';
import { VrViewerDepthContext } from '../../../../..';

const LabelName = () => {
    const {labelRef} = useContext(PinpointContext)
    const {isEditorMode,  player} = useContext(VrViewerDepthContext)
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    const {pin,opacity} = useContext(ViewPinpointContainerContext)
    const [isDoubleClick, setIsDoubleClick] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    
    useEffect(()=>{
        const handleEscape = (e:KeyboardEvent)=>{
            if(e.key === 'Escape'){
                setIsDoubleClick(false)
            }
        }
        addEventListener('keydown',handleEscape)

        return()=>{
            removeEventListener('keydown',handleEscape)
        }
    },)
    return (  
        <div
            ref={labelRef}
            onMouseUp={()=>{
                if(isEditorMode){
                    setIsDoubleClick(true)
                    if(inputRef.current){
                        inputRef.current.value = pin.labelName
                        inputRef.current.select()
                        inputRef.current.focus()
                    }
                }
            }}
            // onMouseLeave={()=>{
            //     if(isEditorMode){
            //         setIsDoubleClick(false)
            //     }
            // }}
            draggable={false}
            className='text-white'
            style={{
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                fontSize:`1.1rem`,
                fontWeight:`600`,
                opacity:(isEditorMode || 
                    selectedProject.globalSettings.showLabel.viewportPinpoint === 'on' || 
                    (selectedProject.globalSettings.customUi == 'topgolf' && isMobile)
                ) && !player.isTeleport?`100%`:opacity,
                transition:`all 0.2s`,
                background:`rgba(0,0,0,0.3)`,
                padding:`1.5rem 3rem`,
                whiteSpace:`nowrap`,                
                borderRadius:`4px`,
            }}
        >
            <span
                style={{
                    display:isDoubleClick?`none`:`flex`,
                    alignItems:`center`,
                    justifyContent:`center`
                }}
            >
                {pin.labelName}
            </span>
            <input
                className="text-white"
                style={{
                    width:isDoubleClick?`fit-content`:`0%`,
                    opacity:isDoubleClick?`100%`:`0%`,
                    display:`flex`,
                    background:`none`,
                    justifyContent:`center`,
                    textAlign:`center`,
                    outline:`none`,
                    fontSize:`1.1rem`,
                    fontWeight:`400`,
                    border:`none`
                }}
                ref={inputRef}
                onKeyDown={(e)=>{
                    if(e.code === "Enter" || e.code === 'NumpadEnter'){
                        if(inputRef.current){
                            // Set redirect url
                            if(inputRef.current.value.startsWith('r=')){
                                pin.redirectUrl = inputRef.current.value.replace('r=','')
                                setSelectedProject(prev=>{return {...prev}})
                                toast.success(`Set redirect url to :${inputRef.current.value.replace('r=','')}`)
                            }
                            else{
                                pin.labelName = inputRef.current.value
                                selectedProject.scenes = selectedProject.scenes.map(scene=>{
                                    return {...scene,
                                        viewList:scene.viewList.map(v=>{
                                            return {...v,
                                                pinpoints:v.pinpoints.map(p=>{
                                                    if(p._id === pin._id){
                                                        return {...p,
                                                            labelName: (inputRef.current?.value as string)
                                                        }
                                                    }
                                                    else{
                                                        return {...p}
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                                setSelectedProject(prev=>{return {...prev}})
                            }
                            setIsDoubleClick(false)
                        }
                    }
                }}
            />
            
        </div>
    );
}
 
export default LabelName;