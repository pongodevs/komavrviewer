import {useRef,useContext, useEffect} from 'react';
import { IoMdClose } from 'react-icons/io';
import { VrViewerStaticContext } from '../../../../..';

const ShowUi = () => {
    const {showUi, setShowUi} = useContext(VrViewerStaticContext)
    const iconRef = useRef<HTMLDivElement>(null)
    
    return (  
        <div
            className='no-select'
            style={{
                cursor:`pointer`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`
            }}
        >
            <div
                className='text-white'
                ref={iconRef}
                style={{
                    fontSize:`2.4rem`,
                    fontWeight:`800`,
                    opacity:`70%`
                }}
                onClick={()=>{
                    setShowUi(false)
                }}
                onMouseEnter={()=>{
                    if(iconRef.current){
                        iconRef.current.style.transition=`all 0.15s ease-out`
                        iconRef.current.style.transform=`scale(1.2)`
                    }
                }}
                onMouseLeave={()=>{
                    if(iconRef.current){
                        iconRef.current.style.transform=`scale(1.0)`
                    }
                }}
            >
                UI
                
            </div>
        </div>
    );
}
 
export default ShowUi;