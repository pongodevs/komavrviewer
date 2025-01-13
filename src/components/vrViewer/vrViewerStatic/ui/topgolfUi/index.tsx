import { Dispatch, RefObject, SetStateAction, createContext, useContext, useEffect, useRef, useState } from "react";
import ProjectLogo from "./projectLogo";
import MapImage from "./mapImage";
import NavBar from "./navBar";
import ImageNavigator from "./imageNavigator";
import FullscreenUi from "./fullscreenUi";
import MenuUi from "./menuUi";
import { isDesktop, isMobile, isTablet } from "react-device-detect";
import DeviceOrientation from "./deviceOrientation";
import { VrViewerStaticContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerStatic";


type TopgolfUiContextType = {
    lightBlueColor:string,
    selectedBlueColor:string,
    unselectedDarkBlueColor:string,
    imageNavigationRef:RefObject<HTMLDivElement>,
    logoRef:RefObject<HTMLDivElement>,
    mapRef:RefObject<HTMLDivElement>,
    headerUiRef:RefObject<HTMLDivElement>,
    mapContainerRef:RefObject<HTMLDivElement>,
    isShowMap:boolean, 
    setIsShowMap:Dispatch<SetStateAction<boolean>>,
}
export const TopgolfUiContext = createContext<TopgolfUiContextType>({} as TopgolfUiContextType)
const TopgolfUi = () => {
    const lightBlueColor = `rgba(22,36,49,0.9)`
    const selectedBlueColor = `rgba(63,146,209,0.9)`
    const unselectedDarkBlueColor = `rgba(12,19,25,0.9)`

    const imageNavigationRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<HTMLDivElement>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const headerUiRef = useRef<HTMLDivElement>(null)
    const [isShowMap, setIsShowMap] = useState(true)
    const {selectedMap} = useContext(VrViewerStaticContext)


    useEffect(()=>{
        // Set Map Height according to width size
        const image = new Image()
        image.onload = ()=>{
            if(mapContainerRef.current){
                const mapContainerWidth = mapContainerRef.current.getBoundingClientRect().width
                const height = Math.round(image.height/image.width * mapContainerWidth)
                mapContainerRef.current.style.height = `${height}px`
            }
        }
        image.src = selectedMap.imageUrl  
    },[selectedMap])

    return (  
        <TopgolfUiContext.Provider
            value={{
                lightBlueColor,
                selectedBlueColor,
                unselectedDarkBlueColor,
                imageNavigationRef,
                mapContainerRef,
                logoRef,
                mapRef,
                headerUiRef,
                isShowMap, setIsShowMap,
            }}
        >
            {isDesktop || isTablet?
                <>
                    {/* Project Logo */}
                    <div
                        className='text-white'
                        ref={logoRef}
                        style={{
                            transition:`transform 1s`,
                            zIndex:`20`,
                            position:`fixed`,
                            left:`2rem`,
                            top:`2rem`,
                        }}
                    >
                        <ProjectLogo/>
                    </div>
                    {/* Header UI */}
                    <div
                        ref={headerUiRef}
                        className='no-select'
                        style={{
                            // opacity:`0`,
                            position:`absolute`,
                            zIndex:`2`,
                            right:`0`,
                            top:`0`,
                            transition:`transform 1s`,
                        }}
                    >
                        <NavBar
                            hideIcon
                            backgroundColor={lightBlueColor}
                        />
                        <div
                            ref={mapContainerRef}
                            style={{
                                width:`100%`,
                            }}
                        >
                            <MapImage
                                backgroundColor={lightBlueColor}
                            />
                        </div>
                    </div>
                    {/* Footer UI */}
                    <div
                        ref={imageNavigationRef}
                        style={{
                            cursor:`initial`,
                            zIndex:`4`,
                            position:`fixed`,
                            bottom:`0rem`,
                            width:`calc(100% - 2rem)`,
                            transition:`all 1s`,
                            display:`flex`,
                            justifyContent:`space-between`,
                            gap:`1rem`, 
                            backgroundColor:lightBlueColor,
                            padding:isTablet?`1rem 1rem 4rem 1rem`:`1rem`,//Top Right Bottom Left
                        }}
                    >
                        {/* Left UI */}
                        <div
                            style={{
                                display:`flex`,
                            }}
                        >
                            <div
                                style={{
                                    margin:`0rem 6rem`,
                                    height:`100%`,
                                    display:`flex`,
                                    flexDirection:`column-reverse`,
                                    alignItems:`center`
                                }}
                            >
                                <FullscreenUi/>
                                {isMobile?
                                    <DeviceOrientation/>
                                :null}
                            </div>
                            <div
                                className="bg-white"
                                style={{
                                    width:`1px`,
                                    height:`100%`,
                                }}
                            />
                        </div>
                        {/* Image Navigator */}
                        <ImageNavigator/>
                        {/* Right UI */}
                        <div
                            style={{
                                display:`flex`,
                            }}
                        >
                            <div
                                className="bg-white"
                                style={{
                                    width:`1px`,
                                    height:`100%`,
                                }}
                            />
                            <div
                                style={{
                                    margin:`0rem 6rem`,
                                }}
                            >
                                <div
                                    style={{
                                        width:`27.5px`
                                    }}
                                >

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Menu Ui */}
                    <div
                        style={{
                            position:`fixed`,
                            bottom:isTablet?`4rem`:`1rem`,
                            right:`5rem`,
                            zIndex:`100`,
                        }}
                    >
                        <MenuUi/>
                    </div>
                </>
            :null}
            {isMobile && !isTablet?
                <>
                    <div
                        className='text-white'
                        ref={logoRef}
                        style={{
                            transition:`transform 1s`,
                            zIndex:`20`,
                            position:`fixed`,
                            width:`100%`,
                            display:`flex`,
                            justifyContent:`center`
                        }}
                    >
                        <ProjectLogo/>
                    </div>
                    {/* Footer UI */}
                    <div
                        ref={imageNavigationRef}
                        style={{
                            background:lightBlueColor,
                            position:`fixed`,
                            bottom:`0`,
                            // height:`35%`,
                            width:`100%`,
                            zIndex:`20`,
                            display:`flex`,
                            flexDirection:`column-reverse`,
                            transition:`all 1s`,
                            gap:`1rem`
                        }}
                    >
                        {/* Level navigation */}
                        <div
                            style={{
                                display:`flex`,
                                justifyContent:`space-between`
                            }}
                        >
                            {/* Left */}
                            <div
                                style={{
                                    display:`flex`,
                                    justifyContent:`center`,
                                    alignItems:`center`,
                                    width:`10rem`,
                                }}
                            >
                                <div
                                    className="no-select"
                                    style={{
                                        width:`4rem`,
                                        height:`4rem`,
                                        display:`flex`,
                                        justifyContent:`center`,
                                        alignItems:`center`,
                                        background:unselectedDarkBlueColor,
                                        borderRadius:`4px`
                                    }}
                                >
                                    <DeviceOrientation/>
                                </div>
                            </div>
                            {/* Middle */}
                            <NavBar/>
                            {/* Right */}
                            <div
                                style={{
                                    // background:`red`,
                                    display:`flex`,
                                    justifyContent:`center`,
                                    alignItems:`center`,
                                    width:`10rem`,
                                }}
                            />
                        </div>
                        <ImageNavigator/>
                        <div
                            ref={mapContainerRef}
                            style={{
                                width:`100%`,
                            }}
                        >
                            <MapImage/>
                        </div>

                    </div>
                    {/* Menu Ui */}
                    <div
                        className="no-select"
                        style={{
                            position:`fixed`,
                            bottom:`1rem`,
                            right:`1rem`,
                            width:`4rem`,
                            height:`4rem`,
                            display:`flex`,
                            justifyContent:`center`,
                            alignItems:`center`,
                            zIndex:`100`,
                            background:unselectedDarkBlueColor,
                            borderRadius:`4px`
                        }}
                    >
                        <MenuUi/>
                    </div>
                </>
            :null}
            
            
        </TopgolfUiContext.Provider>
    );
}
 
export default TopgolfUi;