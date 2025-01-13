import { useContext, Dispatch, SetStateAction } from 'react';

import ImageList from './imageList';
import {useState, createContext} from 'react';
import DropDownIcon from './dropDownIcon';
import { isDesktop } from 'react-device-detect';
import {useRef} from 'react';
import _ from 'lodash';
import ScrollNavigation from './scrollNavigation';
import { useRouter } from 'next/router';
import Instruction from './instruction';
import { VrViewerStaticContext } from '../../../..';
import useAnimation from '@/hooks/animation';
import { VrViewerContext } from '@/components/vrViewer';


type StateType = {
    data:string,
    scrollLeft:number
}
type ImageNavigatorContextType = {
    state:StateType,
    setState:Dispatch<SetStateAction<StateType>>,
    height:string,
    width:string,
    isShowNavigation:boolean, 
    setIsShowNavigation:Dispatch<SetStateAction<boolean>>,
    imageNavRef:any,
    isMouseEnter:boolean, 
    setIsMouseEnter:Dispatch<SetStateAction<boolean>>,
    blueOverlayRef:any,
    blackOverlayRef:any,
}

export const ImageNavigatorContext = createContext<ImageNavigatorContextType>({} as ImageNavigatorContextType)
const ImageNavigator = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {selectedScene, isEditorMode, isUploading, selectedMap} = useContext(VrViewerStaticContext)
    const [isShowNavigation, setIsShowNavigation] = useState(true)
    const height = isDesktop? `15rem`: `10rem`
    const width = `3rem`

    const imageNavRef = useRef<HTMLDivElement>(null)
    const [isMouseEnter, setIsMouseEnter] = useState(false)
    const [state,setState] = useState({
        data:'',
        scrollLeft:0
    })

    const blueOverlayRef = useRef<HTMLDivElement>(null)
    const blackOverlayRef = useRef<HTMLDivElement>(null)

    const getScrollCondition = ()=>{
        if(imageNavRef.current){
            if(imageNavRef.current?.scrollWidth > imageNavRef.current?.clientWidth){
                return true
            }
            else{
                return false
            }
        }
    }

    
    const getFilteredViewList = ()=>{
        if(selectedScene){
            if(selectedProject.globalSettings.navigation.onlyShownAsPerMap){
                return selectedScene.viewList.filter(view=>{
                    return view.mapId == selectedMap._id
                })
            }
            else{
                return selectedScene.viewList
            }
        }
        else{
            return []
        }

    }

    const {animate} = useAnimation()
    return (  
        <ImageNavigatorContext.Provider
            value={{
                blueOverlayRef,
                blackOverlayRef,
                state,setState,
                isMouseEnter, 
                setIsMouseEnter,
                height,
                isShowNavigation, 
                setIsShowNavigation,
                imageNavRef,
                width
            }}
        >
            <div
                ref={imageNavRef}
                className='no-select'
                style={{
                    display:`flex`,
                    justifyContent:getScrollCondition()? `left` : `center`,
                    width: getScrollCondition() ? `calc(100% - (2 * ${width}))`: `100%`,
                    margin: getScrollCondition() ? `0rem ${width}`: `0rem`,
                    height:isShowNavigation?height:`0rem`,
                    transition:`all 0.2s`,
                    background:`rgba(0,0,0,0.5)`,
                    overflowX:`hidden`,
                    overflowY:`hidden`,
                }}
                onWheel={(e)=>{
                    if (e.deltaY < 0) {
                        const data = {
                            x:0
                        }
                        animate(data,{
                            x:1,
                            duration:0.2,
                            delay:0,
                            onUpdate:()=>{
                                setState(prev=>{return {...prev}})
                                if(imageNavRef.current){
                                    imageNavRef.current.scrollLeft = imageNavRef.current.scrollLeft - (0.2 * 20)
                                }
                            }
                        })
                    }
                    if (e.deltaY > 0){
                        const data = {
                            x:0
                        }
                        animate(data,{
                            x:1,
                            duration:0.2,
                            delay:0,
                            onUpdate:()=>{
                                setState(prev=>{return {...prev}})
                                if(imageNavRef.current){
                                    imageNavRef.current.scrollLeft = imageNavRef.current.scrollLeft + (0.2 * 20)
                                }
                            }
                        })
                    }
                }}
                onDragEnter={(e)=>{
                    if(isEditorMode){
                        e.preventDefault()
                        e.stopPropagation()
                        setIsMouseEnter(true)
                        if(blueOverlayRef.current){
                            blueOverlayRef.current.style.pointerEvents = `all`
                        }
                    }
                }}
                onDragOver={(e)=>{
                    if(isEditorMode){
                        e.preventDefault()
                        e.stopPropagation()
                    }
                }}
            >
                <Instruction/>
                {/* Blue Overlay when drag and drop */}
                {/* Scroll bar */}
                {imageNavRef.current?
                    imageNavRef.current?.scrollWidth > imageNavRef.current?.clientWidth?
                        <ScrollNavigation/>
                    :null
                :null}
                {/* Middle */}
                {getFilteredViewList().map((view,index)=>
                    <ImageList
                        key={index}
                        view={view}
                        index={index}
                    />
                )}
            </div>
            
            <DropDownIcon/>
        </ImageNavigatorContext.Provider>
    );
}
 
export default ImageNavigator;