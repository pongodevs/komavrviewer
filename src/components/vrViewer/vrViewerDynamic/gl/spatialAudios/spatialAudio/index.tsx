import { SpatialAudioType } from '@/types/vrProjectType'
import { useFrame, useThree } from '@react-three/fiber'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import TransformAxes from './transformAxes'
import RadiusHelper from './radiusHelper'
import axios from 'axios'


type SpatialAudioContextType = {
    spatialAudio:SpatialAudioType,
    movement:string, 
    setMovement:Dispatch<SetStateAction<string>>,
    panner:PannerNode,
    audioSource:AudioBufferSourceNode
}

export const SpatialAudioContext = createContext<SpatialAudioContextType>({} as SpatialAudioContextType)

const SpatialAudio = ({spatialAudio}:{spatialAudio:SpatialAudioType}) => {    
    const {camera} = useThree()
    const {selectedSpatialAudio, setSelectedProject, selectedProject, cameraRig, player, selectedAmbientSound} = useContext(VrViewerDynamicContext)
    const [movement, setMovement] = useState('')
    
    // Create Audio 
    const audioContext = useMemo(()=>{
        return new AudioContext()
    },[selectedAmbientSound])
    const audioSource = useMemo(()=>{
        return audioContext.createBufferSource()
    },[selectedAmbientSound])
    const panner = useMemo(()=>{
        return audioContext.createPanner()
    },[selectedAmbientSound])
    useEffect(()=>{
        const init = async()=>{
            // Clean up for first time
            audioSource.buffer = null
            audioSource.disconnect()
            panner.disconnect()
            // Re-connect All
            panner.panningModel = "HRTF";
            panner.distanceModel = "linear";
            panner.refDistance = spatialAudio.refDistance;
            panner.maxDistance = spatialAudio.maxDistance;
            panner.rolloffFactor = 1;
            panner.coneInnerAngle = 360;
            panner.coneOuterAngle = 0;
            panner.coneOuterGain = 0;
            const source = spatialAudio.source !== '' ? spatialAudio.source : '/sounds/ambient/forest1.mp3'
            const res = await axios.get(source, { responseType: 'arraybuffer' })
            const buffer = await audioContext.decodeAudioData(res.data)
            audioSource.buffer = buffer
        
            audioSource.connect(panner)
            panner.connect(audioContext.destination)

            audioSource.start(0)
        }
        init()
    },[selectedAmbientSound])

    // Change the sound position whenever mouse p
    useEffect(()=>{
        const handleMouseMove = (e:MouseEvent)=>{
            const camDirection = camera.getWorldDirection(new THREE.Vector3())
            const camDirXY = new THREE.Vector3(camDirection.x, 0, camDirection.z).normalize()
            const globalMult = 0.01
            if(movement === 'x'){
                const dir = new THREE.Vector3(1,0,0)
                const dot = camDirXY.dot(dir)
                const cross = camDirXY.cross(dir)
                const rightVector = cross.y < 0 ? 1 : -1
                const xMovement = rightVector * (1 - dot) * e.movementX
                const yMovement =  -dot * e.movementY
                const finalMovement = globalMult * (xMovement + yMovement)
                spatialAudio.position.x = Math.round((spatialAudio.position.x + finalMovement) * 100)/ 100
                setSelectedProject(prev=>{return {...prev}})
            }
            if(movement === 'y'){
                const dir = new THREE.Vector3(0,0,1)
                const dot = camDirXY.dot(dir)
                const cross = camDirXY.cross(dir)
                const rightVector = cross.y < 0 ? 1 : -1
                const xMovement = rightVector * (1 - dot) * e.movementX
                const yMovement =  dot * -e.movementY
                const finalMovement = globalMult * (xMovement + yMovement)
                spatialAudio.position.z = Math.round((spatialAudio.position.z + finalMovement) * 100)/ 100
                setSelectedProject(prev=>{return {...prev}})
            }
            if(movement === 'z'){
                spatialAudio.position.y = Math.round((spatialAudio.position.y + e.movementY * -globalMult) * 100)/100
                setSelectedProject(prev=>{return {...prev}})
            }
        }

        const handleMouseUp = (e:MouseEvent)=>{
            setMovement('')
        }

        addEventListener('mousemove', handleMouseMove)
        addEventListener('mouseup',handleMouseUp)
        return()=>{
            removeEventListener('mousemove',handleMouseMove)
            removeEventListener('mouseup',handleMouseUp)
        }
    },)

    // Set audio position refer to camera position and orientation
    useFrame(()=>{
        const cameraRigPos = new THREE.Vector3(cameraRig.position.x, cameraRig.position.y, cameraRig.position.z)
        const audioPos = new THREE.Vector3(spatialAudio.position.x, spatialAudio.position.y, spatialAudio.position.z)
        const subPos = audioPos.sub(cameraRigPos).multiplyScalar(1)
        
        const magnitude = subPos.length()
        const newVector = new THREE.Vector3(0,0,-magnitude)

        const quaternion = new THREE.Quaternion()
        const cameraDir = camera.getWorldDirection(new THREE.Vector3())
        const audioDir = new THREE.Vector3(subPos.x, subPos.y, subPos.z).normalize()
        const dot = cameraDir.dot(audioDir)
        const cross = cameraDir.cross(audioDir)
        const angleInRadian = Math.acos(dot)
        quaternion.setFromAxisAngle(cross, angleInRadian)

        const finalPos = newVector.applyQuaternion(quaternion)

        panner.positionX.setValueAtTime(finalPos.x, audioContext.currentTime)
        panner.positionY.setValueAtTime(finalPos.y, audioContext.currentTime)
        panner.positionZ.setValueAtTime(finalPos.z, audioContext.currentTime)
    })
    return (  
        <SpatialAudioContext.Provider
            value={{
                spatialAudio,
                movement, setMovement,
                panner,
                audioSource
            }}
        >
            <group>
                {/* Axes */}
                {selectedSpatialAudio._id === spatialAudio._id?
                    <TransformAxes
                        axesHeight={0.7}
                        axesSize={0.005}
                        division={6}
                    />
                :null}
                <RadiusHelper/>
            </group>
        </SpatialAudioContext.Provider>
    );
}
 
export default SpatialAudio;