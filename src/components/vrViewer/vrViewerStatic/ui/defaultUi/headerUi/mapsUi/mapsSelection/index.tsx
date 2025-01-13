import { useContext, Dispatch, SetStateAction } from 'react';

import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import {useState, createContext } from 'react';
import MapList from './mapList';
import { VrViewerStaticContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerStatic';
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';


type MapsSelectionContextType = {
    isShowList:boolean, 
    setIsShowList:Dispatch<SetStateAction<boolean>>
}

export const MapsSelectionContext = createContext<MapsSelectionContextType>({} as MapsSelectionContextType)
const MapsSelection = () => {
    const {selectedMap} = useContext(VrViewerStaticContext)
    const {setSelectedProject,selectedProject} = useContext(VrViewerContext)
    const [isShowList, setIsShowList] = useState(false)
    return (  
        <MapsSelectionContext.Provider
            value={{
                isShowList, setIsShowList
            }}
        >
            <div
                className='text-white no-select bg-darker-grey'
                style={{
                    fontSize:`1.4rem`,
                    fontWeight:`600`,
                    padding:`0.5rem 1rem`,
                    position:`absolute`,
                    top:`-4rem`,
                    right:`0rem`,
                    width:`calc(100% - 2rem)`,
                    minHeight:`2.5rem`,
                    display:`flex`,
                    flexDirection:`column`,
                    justifyContent:`center`,
                    zIndex:`15`,
                    borderRadius:`4px`,
                }}
            >
                <div
                    style={{
                        display:`flex`,
                        // justifyContent:`space-between`,
                        alignItems:`center`
                    }}
                >
                    <div>
                        {selectedMap.mapName}
                    </div>
                    {selectedProject.maps.length > 1?
                        <div
                            style={{
                                cursor:`pointer`,
                                display:`flex`,
                                justifyContent:`center`,
                                alignItems:`center`,
                                marginLeft:`1rem`
                            }}
                            onClick={()=>{
                                setIsShowList(prev=>!prev)
                            }}
                        >
                            {isShowList?
                                <IoMdArrowDropup
                                    size={25} 
                                />
                            :
                                <IoMdArrowDropdown
                                    size={25} 
                                />
                            }
                        </div>
                    :null}
                </div>
                {isShowList?
                    <div>
                        {selectedProject.maps.filter(map=>map._id !== selectedMap._id).map((map,index)=>
                            <MapList
                                key={index}
                                map={map}
                            />
                        )}
                    </div>
                :null}
            </div>
        </MapsSelectionContext.Provider>
    );
}
 
export default MapsSelection;