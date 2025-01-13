import {useRef, useEffect, useContext} from 'react';
import { PinpointType, ViewListType, VrProjectType, viewListObject } from '@/types/vrProjectType/index';
import { useRouter } from 'next/router';
import {createContext} from 'react';
import _ from 'lodash';
import { InfoPinpointContainerContext } from '..';
import Pin from './pin';
import Delete from './delete';
import BoundingLeave from './boundingLeave';
import { VrViewerDepthContext } from '../../../..';


type PinpointContextType = {
    labelRef:any,
    pin:PinpointType
}

export const PinpointContext = createContext<PinpointContextType>({} as PinpointContextType)
const Pinpoint = () => {
    const {pin} = useContext(InfoPinpointContainerContext)
    const router = useRouter()
    const {projectId} = router.query
    const {
        isEditorMode,
        player,
        isUploading
    } = useContext(VrViewerDepthContext)
    
    const labelRef = useRef<HTMLDivElement>(null)

    const finalTransition = isEditorMode? `all 0.1s` : `all 0.5s`
    // Every change project
    useEffect(()=>{
        const animate = (ref:any)=>{
            if(ref.current){
                ref.current.style.transition = `none`
                ref.current.style.opacity = `0%`
            }
    
            setTimeout(()=>{
                if(ref.current){
                    ref.current.style.transition = finalTransition
                    ref.current.style.opacity = `100%`
                }
            },1500)
        }
        animate(pinRef)
    },[projectId])

    // Every teleport fade thumbnail
    useEffect(()=>{
        if(player.isTeleport){
            if(pinRef.current){
                pinRef.current.style.transition = `none`
                pinRef.current.style.opacity = `0%`
            }
        }
        else{
            if(pinRef.current){
                pinRef.current.style.transition = finalTransition
                pinRef.current.style.opacity = `100%`
            }
        }
    },[player.isTeleport])

    const pinRef = useRef<HTMLDivElement>(null)
    
    return (  
        <PinpointContext.Provider
            value={{
                labelRef,
                pin
            }}
        >
            <div
                className='no-select'
                draggable={false}
                ref={pinRef}
                style={{
                    opacity:`0%`,
                    position:`absolute`,
                    display:`flex`
                }}
            >
                <BoundingLeave/>
                <Pin/>               
                {isEditorMode?
                    <Delete/>
                :null}
            </div>
        </PinpointContext.Provider>
    );
}
 
export default Pinpoint;