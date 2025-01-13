import { createContext, useContext, useRef, Dispatch, SetStateAction, useEffect } from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import useFirebase from '@/hooks/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import axios from 'axios';
import Pinpoints from './pinpoints';
import PlayerUi from './playerUi';
import Toggle from './toggle';
import {useState} from 'react';
import MapsSelection from './mapsSelection';
import { BsPlusCircleDotted } from 'react-icons/bs';
import UseMap from './useMap';
import DonutProgress from '@/components/common/donutProgress';
import { VrViewerContext } from '../../../..';
import { VrViewerDepthContext } from '../../..';

type MapsUiContextType = {
    isShowMap:boolean, 
    setIsShowMap:Dispatch<SetStateAction<boolean>>
}
export const MapsUiContext = createContext<MapsUiContextType>({} as MapsUiContextType)
const Maps = () => {
    const router = useRouter()
    const {projectId} = router.query
    const {selectedMap, setSelectedMap, isEditorMode, 
        mapContainerRef, selectedPinpoint, borderRadius
    } = useContext(VrViewerDepthContext)
    
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    const {storage} = useFirebase()
    const progressBarRef = useRef<HTMLDivElement>(null)
    const [isShowMap, setIsShowMap] = useState(false)
    
    const [progress, setProgress] = useState(0)
    const [isMouseEnter, setIsMouseEnter] = useState(false)
    const [showPlayerUi, setShowPlayerUi] = useState(false)

    const mapRef = useRef<HTMLDivElement>(null)
    const getWidth = ()=>{
        if(mapContainerRef.current){
            const width = `${(selectedProject.globalSettings.map.widthPercentage/100) * (selectedMap.sizePercentage/100) * 35}rem`
            const finalWidth = Math.round(Number(width.replace('rem','')) * 10)
            const containerWidth = mapContainerRef.current.getBoundingClientRect().x
            if(finalWidth > containerWidth){
                return containerWidth
            }
            else{
                return finalWidth
            }
        }
    }
    getWidth()
    const width = `${(selectedProject.globalSettings.map.widthPercentage/100) * (selectedMap.sizePercentage/100) * 35}rem`
    // Select map at first
    useEffect(()=>{
        if(selectedProject.maps.length > 0){
            setSelectedMap(selectedProject.maps[0])
        }
    },[])

    // If selected map no reference, don't render player ui
    useEffect(()=>{
        const findPin = selectedMap.pinpoints.find(pin=>pin._id === selectedPinpoint._id)
        if(findPin){
            setShowPlayerUi(true)
        }
        else{
            setShowPlayerUi(false)
        }
    },[selectedMap])

    useEffect(()=>{
        setShowPlayerUi(true)
    },[selectedPinpoint])
    return (  
        <MapsUiContext.Provider
            value={{
                isShowMap, setIsShowMap
            }}
        >
            <div
                ref={mapRef}
                className={selectedMap.imageUrl === ''?"bg-darker-grey no-select":`no-select`}
                style={{
                    height:selectedMap.imageUrl === ''?`${width}`:``,
                    width:isShowMap || isEditorMode?`${getWidth()}px`:`0rem`,
                    position:`fixed`,
                    top:`6rem`,
                    right:isEditorMode?`calc(20% + 2rem)`:`2rem`,
                    zIndex:`3`,
                    overflow:isShowMap?`initial`:`hidden`,
                    transition:`all 0.2s ease-out`,
                }}
                onDragEnter={(e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                    setIsMouseEnter(true)
                }}
                onDragOver={(e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                }}
                onDragLeave={(e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                    setIsMouseEnter(false)
                }}
                onDrop={(e:any)=>{
                    e.preventDefault()
                    e.stopPropagation()
                    setIsMouseEnter(false)
                    if(selectedMap._id === '') return toast.error(`There's no active map.`)

                    const id = v4()
                    const files = e.dataTransfer.files
                    console.log(files.length)
                    if(files.length > 1) return toast.error('Only 1 file is accepted')
                    if(files[0].name.endsWith('.jpg') || files[0].name.endsWith('.png')){
                        const image = files[0]
                        const imageName = `${image.name.replace('.jpg','')}-${id}.jpg`

                        const imageRef = ref(storage,`/pongovr/projects/${projectId}/map/${imageName}`)
                        const uploadTask = uploadBytesResumable(imageRef, image)

                        uploadTask.on('state_changed', 
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                setProgress(progress)
                            }, 
                            (error) => {
                                // Handle unsuccessful uploads
                            }, 
                            async() => {
                                const imageUrl = await getDownloadURL(uploadTask.snapshot.ref)                            
                                const {data}= await axios.post(`https://us-central1-pongoprojects-us.cloudfunctions.net/sharp`,{
                                    type:'compress',
                                    quality:80,
                                    format:`png`,
                                    imageUrl:imageUrl,
                                    storagePath:`pongovr/projects/${projectId}/map/${imageName}`,
                                })

                                const finalImagelUrl = await getDownloadURL(ref(storage,`pongovr/projects/${projectId}/map/${imageName}`))
                                
                                selectedMap.imageUrl = finalImagelUrl
                                setSelectedProject(prev=>{return {...prev}})
                                setProgress(0)
                                toast.success('Success adding view.')
                            }
                        )
                    }
                    else{
                        toast.error('Only jpg file is accepted.')
                    }
                    


                }}
            >
                {/* Blue overlay */}
                <div
                    className='bg-blue text-white'
                    style={{
                        position:`absolute`,
                        pointerEvents:`none`,
                        width:`100%`,
                        height:`100%`,
                        zIndex:`3`,
                        opacity:isMouseEnter?`50%`:`0`,
                        display:`flex`,
                        justifyContent:`center`,
                        alignItems:`center`,
                        fontSize:`2rem`,
                        fontWeight:`600`,
                        transition:`all 0.2s`
                    }}
                >
                    Drag and drop here.
                </div>
      
                {/*  */}
                <div
                    className='text-white'
                    style={{
                        background:progress > 0? `rgba(0,0,0,0.5)`: ``,
                        position:`absolute`,
                        pointerEvents:`none`,
                        width:`100%`,
                        height:`100%`,
                        display:`flex`,
                        justifyContent:`center`,
                        alignItems:`center`
                    }}
                >
                    {progress > 0?
                            <DonutProgress
                                borderWidth='1rem'
                                progress={progress}
                                width='15rem'
                            />
                        :
                            selectedMap.imageUrl === ''?
                                <BsPlusCircleDotted
                                    size={60}
                                    style={{
                                        pointerEvents:`none`
                                    }}
                                />  
                            :null
                    }
                </div>
 
                {selectedMap.imageUrl !== ''?
                    <img
                        className='no-select'
                        src={selectedMap.imageUrl}
                        style={{
                            pointerEvents:`none`,
                            width:`100%`,
                            borderRadius
                        }}
                    />
                :null}
                
                {selectedPinpoint._id !== '' && showPlayerUi?
                    <PlayerUi/>
                :null}

                <Pinpoints/>

                {isEditorMode && selectedMap.imageUrl !== ''?
                    <UseMap/>
                :null}
       
                <MapsSelection/>
            </div>
            {selectedProject.maps.length > 0 && !isEditorMode?
                <Toggle/>
            :null}
        </MapsUiContext.Provider>
    );
}
 
export default Maps;