import {useRef, useState, useEffect, useContext} from 'react'
import { PropertyContext } from '..'
import PlusMinusButton from './plusMinusButton'
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer'

const Integer = () => {
    const {type,selected,labelKey,max,min,precision, isGlobal, disable} = useContext(PropertyContext)
    const {setSelectedProject, selectedProject} = useContext(VrViewerContext)
    const {currentView} = useContext(VrViewerContext)
    const [isMouseEnter, setIsMouseEnter] = useState(false)
    const [isMouseDown, setIsMouseDown] = useState(false)
    const [isDrag, setIsDrag] = useState(false)
    const intContainerRef = useRef<HTMLDivElement>(null)
    const intValueRef = useRef<HTMLDivElement>(null)
    const [isRenderArrow, setIsRenderArrow] = useState(false)
    const [isClick, setIsClick] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const valueRef = useRef<HTMLInputElement>(null)

    const changeValue = (value:any)=>{
        selected[labelKey] = Number(value)
        if(isGlobal){
            // To Project
            selectedProject.scenes = selectedProject.scenes.map(scene=>{
                return {...scene,
                    viewList:scene.viewList.map(view=>{
                        if(view._id === currentView._id){
                            return {...view,
                                [labelKey]:value
                            }
                        }
                        else{
                            return view
                        }
                    })
                }
            })
        }
        setSelectedProject(prev=>{return {...prev}})
    }

    
    useEffect(()=>{
        const handleMouseUp = (e:MouseEvent)=>{
            setIsMouseDown(false)
            setIsDrag(false)
            if(intContainerRef.current){
                intContainerRef.current.style.filter = `brightness(1.0)`
                if(e.target == intValueRef.current){
                    setIsRenderArrow(true)
                }
            }
            if(isClick){
                if(e.target != valueRef.current){
                    setIsClick(false)
                }
            }
            
        }
        const handleMouseMove = (e:MouseEvent)=>{
            if(isMouseDown && !disable){
                setIsDrag(true)
                const finalResult = Number(Math.min( Math.max( ( (Number(selected[labelKey]) +  Number(e.movementX * precision)) ),min),max ).toFixed(Math.max( (String(precision).length -2), 0)))
                changeValue(finalResult)
            }
        }
        addEventListener('mouseup',handleMouseUp)
        addEventListener('mousemove',handleMouseMove)

        return()=>{
            removeEventListener('mouseup',handleMouseUp)
            removeEventListener('mousemove',handleMouseMove)
        }
    },)
    return (  
        <>
            <div
                ref={intContainerRef}
                className='bg-lighter-grey'
                style={{
                    borderRadius:`4px`,
                    marginLeft:`4px`,
                    fontSize:`1.1rem`,
                    fontWeight:`400`,
                    width:`100%`,
                    display:`flex`,
                    justifyContent:`space-between`,
                    overflow:`hidden`,
                }}      
                onMouseEnter={()=>{
                    if(!isMouseDown){
                        setIsMouseEnter(true)
                        setIsRenderArrow(true)
                        if(intContainerRef.current){
                            intContainerRef.current.style.filter = `brightness(1.2)`
                        }
                    }
                }}          
                onMouseLeave={()=>{
                    setIsRenderArrow(false)
                    if(intContainerRef.current && isRenderArrow){
                        intContainerRef.current.style.filter = `brightness(1.0)`
                    }
                }}      
                onMouseUp={(e:any)=>{
                    if(!isDrag){
                        setIsClick(true)
                        if(inputRef.current){
                            inputRef.current.value = selected[labelKey]
                            inputRef.current.select()
                            inputRef.current.focus()
                        }
                    }
                }}
                    
            >
                {isRenderArrow?
                    <PlusMinusButton
                        type='minus'
                    />
                :null}
                <div
                    ref={intValueRef}
                    style={{
                        width:`100%`,
                        padding:`4px`,
                        display:`flex`,
                        justifyContent:`center`,
                        alignItems:`center`,
                        cursor:`e-resize`
                    }}
                    onMouseDown={()=>{
                        setIsMouseDown(true)
                        setIsRenderArrow(false)
                        if(intContainerRef.current){
                            intContainerRef.current.style.filter = `brightness(0.5)`
                        }
                    }} 
                >
                    <span
                        ref={valueRef}
                        style={{
                            display:isClick?`none`:`flex`,
                            alignItems:`center`,
                            justifyContent:`center`
                        }}
                    >
                        {selected[labelKey]}
                    </span>
                    <input
                        ref={inputRef}
                        className="bg-lighter-grey text-white"
                        style={{
                            cursor:isClick?`text`:`default`,
                            width:isClick?`100%`:`0%`,
                            opacity:isClick?`100%`:`0%`,
                            outline:`none`,
                            fontSize:`1.1rem`,
                            fontWeight:`400`,
                            border:`none`,
                            textAlign:`center`
                        }}
                        onKeyDown={(e:any)=>{
                            if(e.code === 'Escape'){
                                setIsClick(false)
                            }
                            if(e.code === 'Enter' || e.code === 'NumpadEnter'){
                                console.log(Number(e.target.value))
                                const finalResult = Number(Math.min( Math.max( Number(e.target.value),min),max ).toFixed(Math.max( (String(precision).length -2), 0)))
                                changeValue(finalResult)
                                setIsClick(false)
                                
                            }
                        }}
                    />
                </div>
                {isRenderArrow?
                    <PlusMinusButton
                        type='plus'
                    />
                :null}
            </div>
        </>
    );
}
 
export default Integer;