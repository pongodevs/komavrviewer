import { useContext } from "react"
import { ZoomUiContext } from ".."
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

const CurrentZoom = ()=>{
    const {showZoomSelection, setShowZoomSelection} = useContext(ZoomUiContext)
    const {selectedZoom} = useContext(VrViewerDynamicContext)
    return(
        <div
            className="text-white"
            style={{
                cursor:`pointer`,
                fontSize:`2.4rem`,
                fontWeight:`600`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                padding:`0.5rem`
            }}
            onClick={()=>{
                setShowZoomSelection(true)
            }}
        >
            {selectedZoom}x
        </div>
    )
}
export default CurrentZoom