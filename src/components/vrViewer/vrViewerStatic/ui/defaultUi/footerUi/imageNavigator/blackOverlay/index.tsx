import {useContext} from 'react'
import { VrViewerStaticContext } from '../../../../..';

const BlackOverlay = () => {
    const {isUploading} = useContext(VrViewerStaticContext)
    return (  
        <div
            className='text-white'
            style={{
                opacity:isUploading?`100%`:`0%`,
                pointerEvents:isUploading?`all`: `none`,
                transition:`all 0.2s`,
                width:`100%`,
                height:`100%`,
                position:`absolute`,
                zIndex:`4`,
                background:`rgba(0,0,0,0.6)`,
                fontWeight:`600`,
                fontSize:`3rem`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
            }}
        >
            
        </div>
    );
}
 
export default BlackOverlay;