import {useRef} from 'react';
const MiniButton = ({icon,type,onClick,disable}:{icon:any,type?:string,onClick:Function,disable?:boolean}) => {

    const getBorderRadius = ()=>{
        if(type === 'top'){
            return `4px 4px 0px 0px`
        }
        if(type === 'bottom'){
            return `0px 0px 4px 4px`
        }
        return `0px`
    }

    const buttonRef = useRef<HTMLDivElement>(null)
    return (  
        <div
            ref={buttonRef}
            className="bg-light-grey text-lightest-grey"
            style={{
                borderRadius:getBorderRadius(),
                margin:`0.5px`,
                width:`2rem`,
                height:`2rem`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                opacity:disable?`20%`:`100%`
                
            }}
            onMouseEnter={()=>{ 
                if(buttonRef.current){
                    buttonRef.current.className = "bg-lighter-grey text-lightest-grey"
                }
            }}
            onMouseLeave={()=>{
                if(buttonRef.current){
                    buttonRef.current.className = "bg-light-grey text-lightest-grey"
                }
            }}
            onClick={()=>{
                if(!disable){
                    if(buttonRef.current){
                        buttonRef.current.className = "bg-blue text-lightest-grey"
    
                        setTimeout(()=>{
                            if(buttonRef.current){
                                buttonRef.current.className = "bg-light-grey text-lightest-grey"
                            }
                        },75)
                    }
                    onClick()
                }
            }}
        >
            {icon}
        </div>
    );
}
 
export default MiniButton;