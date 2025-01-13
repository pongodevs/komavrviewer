
import { useContext, useEffect, useRef, useState } from 'react';
import { VrViewerContext } from '../../..';

const DraggableItem = ({image, onMouseUp, onMouseDown}:{image:any, onMouseUp:any, onMouseDown:any}) => {
    const itemRef = useRef<HTMLDivElement>(null)
    const [isClick, setIsClick] = useState(false)
    const {setEnableOrbitControl} = useContext(VrViewerContext)

    useEffect(()=>{
        const handleMouseMove = (e:any)=>{
            
            if(itemRef.current){
                if(isClick){
                    itemRef.current.style.left = `${e.clientX}px`
                    itemRef.current.style.top = `${e.clientY}px`
                    itemRef.current.style.zIndex = `3`
                }
            }
        }

        const handleMouseUpChildren = (e:any)=>{
            if(isClick){
                onMouseUp()
            }
            // Reset pin ref to original location
            if(itemRef.current){
                itemRef.current.style.left = ``
                itemRef.current.style.top = ``
                itemRef.current.style.position = `initial`
                itemRef.current.style.transform = ``
            }

            setIsClick(false)
        }
        addEventListener('mouseup',handleMouseUpChildren)
        addEventListener('mousemove',handleMouseMove)

        return()=>{
            removeEventListener('mouseup',handleMouseUpChildren)
            removeEventListener('mousemove',handleMouseMove)
        }
    },[isClick])
    return (  
        <>
            <div
                onMouseDown={(e)=>{
                    onMouseDown()
                    setEnableOrbitControl(false)
                    setIsClick(true)
                    if(itemRef.current){
                        itemRef.current.style.left = `${e.clientX}px`
                        itemRef.current.style.top = `${e.clientY}px`
                        itemRef.current.style.position = `fixed`
                        itemRef.current.style.transform = `translate(-50%,-50%)`
                    }
                    
                }}

                style={{
                    zIndex:`1`,
                    display:`flex`,
                    justifyContent:`center`,
                    position:`relative`
                }}
            >
                <div
                    ref={itemRef}
                    style={{
                        pointerEvents:`none`,
                        zIndex:`2`,
                    }}
                >
                    {image}
                </div>
            </div>
        </>
    );
}
 
export default DraggableItem;