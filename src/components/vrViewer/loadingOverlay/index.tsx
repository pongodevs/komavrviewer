"use client"
import {Puff} from "react-loading-icons";
import {SVGProps, useContext} from 'react'
import { VrViewerContext } from "..";

const LoadingOverlay = () => {
    const {loadingText} = useContext(VrViewerContext)
    return (  
        <div
            className="text-white"
            style={{
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                zIndex:`5`,
                width:`100%`,
                height:`100%`,
                position:`fixed`,
                background:`black`,
                opacity:`50%`
            }}
        >
            <div
                style={{
                    display:`flex`,
                    justifyContent:`center`,
                    alignItems:`center`,
                    position:`absolute`,
                    right:`4rem`,
                    bottom:`4rem`
                }}
            >
                <div
                    style={{
                        fontSize:`1.2rem`,
                        fontWeight:`400`,
                        padding:`2rem`
                    }}
                >
                    {loadingText}
                </div>
                <div>
                    <Puff
                        style={{
                            width:`3rem`,
                            height:`3rem`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
 
export default LoadingOverlay;