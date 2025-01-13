import { useContext } from "react"
import { ZoomUiContext } from "../.."
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import gsap, { Power4 } from "gsap"
import useAnimation from "@/hooks/animation";

const Zoom = ({zoom}:{zoom:number})=>{
    const {setShowZoomSelection} = useContext(ZoomUiContext)
    const {selectedZoom, setSelectedZoom,camera} = useContext(VrViewerDynamicContext)
    const {animate} = useAnimation()
    return(
        <div
            className="text-white bg-dark-grey"
            style={{
                opacity:selectedZoom === zoom? `100%`:`50%`,
                cursor:`pointer`,
                width:`3rem`,
                height:`3rem`,
                borderRadius:`3rem`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                fontSize:`1.3rem`,
                fontWeight:`400`,
                margin:`0.5rem`,
                padding:`0.3rem`,
                transition:`all 0.2s`

            }}
            onClick={()=>{
                setShowZoomSelection(false)
                setSelectedZoom(zoom)

                const isPotrait = innerWidth < innerHeight
                const isLandscape = innerHeight < innerWidth
                if(isPotrait){
                    if(zoom === 0.5){
                        animate(camera,{
                            fov:125,
                            duration:1,
                            onUpdate:()=>{
                                camera.updateProjectionMatrix()
                            },
                            ease:`power4.inOut`
                        })
                    }
                    if(zoom === 1){
                        animate(camera,{
                            fov:105,
                            duration:1,
                            onUpdate:()=>{
                                camera.updateProjectionMatrix()
                            },
                            ease:`power4.inOut`
                        })
                    }
                    if(zoom === 2){
                        animate(camera,{
                            fov:85,
                            duration:1,
                            onUpdate:()=>{
                                camera.updateProjectionMatrix()
                            },
                            ease:`power4.inOut`
                        })
                    }
                }
                if(isLandscape){
                    if(zoom === 0.5){
                        animate(camera,{
                            fov:105,
                            duration:1,
                            onUpdate:()=>{
                                camera.updateProjectionMatrix()
                            },
                            ease:`power4.inOut`
                        })
                    }
                    if(zoom === 1){
                        animate(camera,{
                            fov:85,
                            duration:1,
                            onUpdate:()=>{
                                camera.updateProjectionMatrix()
                            },
                            ease:`power4.inOut`
                        })
                    }
                    if(zoom === 2){
                        animate(camera,{
                            fov:65,
                            duration:1,
                            onUpdate:()=>{
                                camera.updateProjectionMatrix()
                            },
                            ease:`power4.inOut`
                        })
                    }
                }
            }}
        >
            {zoom}x
        </div>
    )
}

export default Zoom