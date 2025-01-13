import Zoom from "./zoom"

const zooms = [0.5,1,2]
const ZoomSelection = ()=>{
    return (
        <div
            style={{
                display:`flex`,
                background:`rgba(0,0,0,0.3)`,
                borderRadius:`5rem`
            }}
        >
            {zooms.map((zoom,index)=>
                <Zoom
                    key={index}
                    zoom={zoom}
                />
            )}
        </div>
    )
}

export default ZoomSelection