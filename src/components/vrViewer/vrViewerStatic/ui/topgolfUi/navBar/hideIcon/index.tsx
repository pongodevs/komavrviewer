import { useContext } from "react";
import { TopgolfUiContext } from "../..";

const HideIcon = () => {
    const {isShowMap, setIsShowMap,mapRef} = useContext(TopgolfUiContext)
    return (  
        <div
            onClick={()=>{
                if(mapRef.current){
                    const {height} = mapRef.current.getBoundingClientRect()
                    if(isShowMap){
                        setIsShowMap(false)
                        if(mapRef.current){
                            mapRef.current.style.transform = `translateY(-${height}px)`
                        }
                    }
                    else{
                        setIsShowMap(true)
                        if(mapRef.current){
                            mapRef.current.style.transform = `translateY(0px)`
                        }
                    }
                }
            }}
            style={{
                fontSize:`0.8rem`,
                fontWeight:`700`,
                // width:`5rem`,
                background:`#0b1219`,
                height:`100%`,
                padding:`0rem 1rem`,
                borderRadius:`4px`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                cursor:`pointer`
            }}
        >
            <div
                style={{
                    width:`5rem`,
                    border:`1.5px solid white`,
                    borderRadius:`15px`,
                    display:`flex`,
                    padding:`0.2rem 0.4rem`,
                    justifyContent:`center`,
                    alignItems:`center`,
                    gap:`0.5rem`
                }}
            >
                {isShowMap?
                    <div
                        style={{

                        }}
                    >
                        HIDE
                    </div>
                :null}
                <div
                    style={{
                        border:`2px solid white`,
                        borderRadius:`100rem`,
                        height:`1rem`,
                        width:`1rem`,
                        // padding:`5px`
                    }}
                >
                    
                </div>
                {!isShowMap?
                    <div
                        style={{

                        }}
                    >
                        SHOW
                    </div>
                :null}
            </div>

        </div>
    );
}
 
export default HideIcon;