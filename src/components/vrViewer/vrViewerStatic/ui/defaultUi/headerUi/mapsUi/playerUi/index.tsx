
import { VrViewerStaticContext } from '@/components/vrViewer/vrViewerStatic';
import {useEffect, useContext,useRef, useState} from 'react';


const PlayerUi = () => {

    const playerUiRef = useRef<HTMLDivElement>(null)
    const viewingAngleRef = useRef<HTMLDivElement>(null)

    const {cameraRig, camera, selectedPinpoint, selectedMap, isEditorMode,} = useContext(VrViewerStaticContext)

    // Test render
    useEffect(()=>{
        let animationFrameId:any

        const render = () => {
            if(playerUiRef.current){
                // Set viewfinder rotation and location
                const angleInDegrees = camera.rotation.y * (180 / Math.PI);
                const rotation = -angleInDegrees % 360;
                playerUiRef.current.style.transform = `rotate(${rotation}deg)`
                playerUiRef.current.style.left = `${selectedPinpoint.position.x}%`
                playerUiRef.current.style.top = `${selectedPinpoint.position.y}%`

                // Set viewfinder FOV
                setFov(camera.fov)
            }
    
 
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    },)

    const [fov, setFov] = useState(camera.fov)
    
    return (  
        <div
            style={{
                pointerEvents:`none`,
                position:`absolute`,
                top:`0`,
                width:`100%`,
                height:`100%`,
                zIndex:`1`,
                overflow:`hidden`
            }}
        >
            <div
                ref={playerUiRef}
                className='bg-blue'
                style={{
                    zIndex:`2`,
                    position:`absolute`,
                    left:`50%`,
                    top:`50%`,
                    display:`flex`,
                    justifyContent:`center`,
                    alignItems:`center`,
                    flexWrap:`wrap`,
                    transition:`left 0.5s, top 0.5s`
                }}
            >
                <div
                    ref={viewingAngleRef}
                    style={{
                        position:`absolute`,
                        display:`flex`,
                        justifyContent:`center`,
                        alignItems:`center`
                    }}
                >
                    {/* Viewing Angle */}
                    {selectedMap.showViewfinder?
                        // <div
                        //     style={{
                        //         pointerEvents:`none`,
                        //         opacity:`30%`,
                        //         position:`absolute`,
                        //         transform:`translateY(-${viewSize / 1.4}px)`,
                        //         borderLeft: `${viewSize * 1.5}px solid transparent`,
                        //         borderRight: `${viewSize * 1.5}px solid transparent`,
                        //         borderTop: `${viewSize * 1.5}px solid rgba(0,80,229,0.8)`
                        //     }}
                        // />
                        <img
                            src="/images/icons/viewfinder.png"
                            style={{
                                height:`${selectedMap.sizePercentage}px`,
                                width:`${selectedMap.sizePercentage * fov / 40}px`,
                                transform:`translateY(-50%)`,
                                opacity:`50%`
                            }}
                        />
                        
                    :null}
                    {/* Axis */}
                    {isEditorMode?
                        <div
                            style={{
                                pointerEvents:`none`,
                                position:`absolute`,
                                zIndex:`2`,
                                // display:`flex`
                            }}
                        >
                            <div
                                className='bg-green'
                                style={{
                                    position:`absolute`,
                                    height:`1000rem`,
                                    width:`0.3px`,
                                    transform:`translate(-50%,-50%)`
                                }}
                            />
                            <div
                                className='bg-green'
                                style={{
                                    position:`absolute`,
                                    width:`1000rem`,
                                    height:`0.3px`,
                                    transform:`translate(-50%,-50%)`
                                }}
                            />

                        </div>
                    :null}
                    {/* Dot */}
                    <div
                        className='bg-white'
                        style={{
                            width:`15px`,
                            height:`15px`,
                            position:`absolute`,
                            borderRadius:`10px`,
                            boxShadow:`3px 3px 5px rgba(0,0,0,0.5)`
                        }}
                    />
                        
                
                </div>
                
            </div>
        </div>
    );
}
 
export default PlayerUi;