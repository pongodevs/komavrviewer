

import { useState, createContext, Dispatch, SetStateAction, DragEventHandler } from 'react';
import DonutProgress from '@/components/common/donutProgress';
import {useContext, useRef} from 'react';
import DragAndDropOverlay from '@/components/common/dragAndDropOverlay';
import DraggableItem from './draggableItem';

type DropItemContextType = {
    overlayRef:any
    isMouseEnter:boolean,
    setIsMouseEnter:Dispatch<SetStateAction<boolean>>,
    progress:number,
    setProgress:Dispatch<SetStateAction<number>>,
}
export const DropItemContext = createContext<DropItemContextType>({} as DropItemContextType)
const DropItem = ({onDrop, image, onMouseUp, onMouseDown}:{onDrop?:DragEventHandler, image:any, onMouseUp:any, onMouseDown:any}) => {
    const [isMouseEnter, setIsMouseEnter] = useState(false)
    const [progress, setProgress] = useState(0)
    const overlayRef = useRef<HTMLDivElement>(null)

    return (  
        <DropItemContext.Provider
            value={{
                overlayRef,
                isMouseEnter, setIsMouseEnter,
                progress, setProgress
            }}
        >
            <div
                className="bg-dark-grey"
                style={{
                    margin:`1rem 0rem`,
                    width:`100%`,
                    aspectRatio:`1/1`,
                    borderRadius:`4px`,
                    display:`flex`,
                    justifyContent:`center`,
                    alignItems:`center`,
                    position:`relative`
                }}
                onDragEnter={(e)=>{
                    if(onDrop){
                        e.preventDefault()
                        e.stopPropagation()
                        setIsMouseEnter(true)
                        if(overlayRef.current){
                            overlayRef.current.style.pointerEvents = `all`
                        }
                    }
                }}
                onDragOver={(e)=>{
                    if(onDrop){
                        e.preventDefault()
                        e.stopPropagation()
                        if(overlayRef.current){
                            overlayRef.current.style.pointerEvents = `all`
                        }
                    }
                }}
                
            >
                <DragAndDropOverlay
                    overlayRef={overlayRef}
                    isMouseEnter={isMouseEnter}
                    setIsMouseEnter={setIsMouseEnter}
                    onDrop={onDrop}
                />
                {progress > 0?
                    <DonutProgress
                        width='80%'
                        borderWidth='1rem'
                        progress={progress}
                    />
                :null}
                {progress === 0?
                    <DraggableItem
                        image={image}
                        onMouseUp={onMouseUp}
                        onMouseDown={onMouseDown}
                    />
                :null}
            </div>
        </DropItemContext.Provider>
    );
}
 
export default DropItem;