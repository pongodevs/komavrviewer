import ImageNavigator from "./imageNavigator";
import {Dispatch, RefObject, SetStateAction, createContext, useContext, useEffect, useRef, useState} from 'react';
import UtilsUi from "./utilsUi";
import { VrViewerDepthContext } from "../..";
import { VrViewerContext } from "../../..";

type FooterUiContextType = {
    uiRef:RefObject<HTMLDivElement>,
    uiLength:number, 
    setUiLength:Dispatch<SetStateAction<number>>
}
export const FooterUiContext = createContext<FooterUiContextType>({} as FooterUiContextType)

const FooterUi = () => {
    const {isEditorMode, setIsFullscreen} = useContext(VrViewerDepthContext)
    const uiRef = useRef<HTMLDivElement>(null)
    const [uiLength, setUiLength] = useState(0)
    useEffect(()=>{
        if(uiRef.current){
            setUiLength(uiRef.current.children.length)
        }
    })

    useEffect(()=>{
        const handleFullscreenChange = ()=>{
            setIsFullscreen(v=>{return !v})
        }

        addEventListener('fullscreenchange', handleFullscreenChange);
        addEventListener('webkitfullscreenchange', handleFullscreenChange);
        addEventListener('mozfullscreenchange', handleFullscreenChange);
        addEventListener('MSFullscreenChange', handleFullscreenChange);

        return()=>{
            removeEventListener('fullscreenchange', handleFullscreenChange)
            removeEventListener('webkitfullscreenchange', handleFullscreenChange)
            removeEventListener('mozfullscreenchange', handleFullscreenChange)
            removeEventListener('MSFullscreenChange', handleFullscreenChange)
        }
    },)

    return (  
        <FooterUiContext.Provider
            value={{
                uiRef,
                uiLength, setUiLength
            }}
        >
            <div
                style={{
                    cursor:`initial`,
                    zIndex:`4`,
                    position:`fixed`,
                    bottom:`0rem`,
                    width:isEditorMode?`80%`:`100%`,
                    transition:`all 0.2s`,
                }}
            >
                <UtilsUi/>
                {isEditorMode?
                    <ImageNavigator/>
                :null}
            </div>
        </FooterUiContext.Provider>
    );
}
 
export default FooterUi;