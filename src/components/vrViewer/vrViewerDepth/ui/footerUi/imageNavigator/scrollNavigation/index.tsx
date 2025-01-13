import {useContext} from 'react';
import { ImageNavigatorContext } from '..';
import { gsap } from 'gsap';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import useAnimation from '@/hooks/animation';
const ScrollNavigation = () => {
    const {imageNavRef, height, setState, width} = useContext(ImageNavigatorContext)
    const bgColor = `rgba(0,0,0,0.8)`

    const {animate} = useAnimation()
    return (  
        <>
            {/* Left */}
            <div
                className='text-white'
                style={{
                    background:bgColor,
                    cursor:`pointer`,
                    zIndex:`15`,
                    position:`absolute`,
                    left:`0`,
                    height:height,
                    width:width,
                    display:`flex`,
                    alignItems:`center`
                }}
                onClick={()=>{
                    
                    if(imageNavRef.current){
                        animate(imageNavRef.current,{
                            scrollLeft: imageNavRef.current.scrollLeft - 200,
                            duration:0.2,
                            delay:0,
                            onUpdate:()=>{
                                setState(prev=>{return {...prev}})
                            }
                        })
                    }
                }}
            >
                <IoMdArrowDropleft
                    size={25} 
                />
            </div>
            {/* Right */}
            <div
                className='text-white'
                style={{
                    background:bgColor,
                    cursor:`pointer`,
                    zIndex:`15`,
                    position:`absolute`,
                    right:`0`,
                    height:height,
                    width:width,
                    display:`flex`,
                    alignItems:`center`
                }}
                onClick={()=>{
                    if(imageNavRef.current){
                        animate(imageNavRef.current,{
                            scrollLeft: imageNavRef.current.scrollLeft + 200,
                            duration:0.2,
                            delay:0,
                            onUpdate:()=>{
                                setState(prev=>{return {...prev}})
                            }
                        })
                    }
                }}
            >
                <IoMdArrowDropright
                    size={25} 
                />
            </div>
        </>
    );
}
 
export default ScrollNavigation;