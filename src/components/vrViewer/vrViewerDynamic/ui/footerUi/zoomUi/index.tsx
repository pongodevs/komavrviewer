import { Dispatch, SetStateAction, createContext, useState } from "react"
import CurrentZoom from "./currentZoom"
import ZoomSelection from "./zoomSelection"

type ZoomUiContextType = {
    showZoomSelection:boolean, 
    setShowZoomSelection:Dispatch<SetStateAction<boolean>>
}
export const ZoomUiContext = createContext<ZoomUiContextType>({} as ZoomUiContextType)
const ZoomUi = ()=>{
    const [showZoomSelection, setShowZoomSelection] = useState(false)
    return (
        <ZoomUiContext.Provider
            value={{
                showZoomSelection, setShowZoomSelection
            }}
        >
            <div
                style={{
                    height:`5rem`
                }}
            >
                {showZoomSelection?
                    <ZoomSelection/>
                :
                    <CurrentZoom/>
                }
            </div>

        </ZoomUiContext.Provider>

    )
}

export default ZoomUi