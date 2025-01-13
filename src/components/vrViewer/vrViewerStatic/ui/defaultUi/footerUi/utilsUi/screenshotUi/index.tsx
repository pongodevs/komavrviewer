import React from 'react'
import { useRef,  useContext} from 'react';
import { FaCamera } from 'react-icons/fa';
import { VrViewerStaticContext } from '../../../../..';

const ScreenshootUi = () => {
    const {gl, scene, camera} = useContext(VrViewerStaticContext)
    const iconRef = useRef<HTMLDivElement>(null)
    return ( 
        <div 
            ref={iconRef}
            className='text-white'
            style={{
                padding:`0.5rem`,
                cursor:`pointer`,
                zIndex:`50`,
                fontSize:`3rem`,
                
                opacity:`70%`
            }}
            onClick={()=>{
                gl.domElement.getContext('webgl', { preserveDrawingBuffer: true });
                gl.render(scene, camera);
                gl.domElement.toBlob(
                    (blob:any)=> {
                        const a = document.createElement('a');
                        const url = URL.createObjectURL(blob);
                        a.href = url;
                        a.download = 'screenshoot.jpg';
                        a.click();
                    },
                    'image/jpg',
                    1.0
                )

                gl.domElement.getContext('webgl', { preserveDrawingBuffer: false });
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
            <FaCamera/>
        </div>
     );
}
 
export default ScreenshootUi;