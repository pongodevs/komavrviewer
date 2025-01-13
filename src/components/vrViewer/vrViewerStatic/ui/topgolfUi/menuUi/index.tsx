import { useContext } from "react";
import { IoIosMenu } from "react-icons/io";
import { VrViewerStaticContext } from "@/components/homepage/bodyContainer/vrViewer/vrViewerStatic";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import { TopgolfUiContext } from "..";
import { isDesktop } from "react-device-detect";

const MenuUi = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {logoRef, headerUiRef, imageNavigationRef} = useContext(TopgolfUiContext)
    const {showUi, setShowUi} = useContext(VrViewerStaticContext)
    return (  
        <>
            {selectedProject.globalSettings.customUi === 'topgolf'?
                <div
                    className="text-white no-select"
                    style={{
                        zIndex:`100`,
                        cursor:`pointer`
                    }}
                    onClick={()=>{
                        const projectInfoHeight = logoRef.current?.getBoundingClientRect().height
                        const mapHeight = headerUiRef.current?.getBoundingClientRect().height
                        const imageNavigationHeight = imageNavigationRef.current?.getBoundingClientRect().height

                        const offset = 20
                        if(!showUi){
                            setShowUi(true)
                            if(logoRef.current){
                                logoRef.current.style.transform = `translateY(0px)`
                            }
                            if(headerUiRef.current){
                                headerUiRef.current.style.transform = `translateY(0px)`
                            }
                            if(imageNavigationRef.current){
                                imageNavigationRef.current.style.transform = `translateY(0px)`
                            }
                        }
                        if(showUi){
                            setShowUi(false)
                            if(logoRef.current){
                                logoRef.current.style.transform = `translateY(-${(projectInfoHeight as number) + offset}px)`
                            }
                            if(headerUiRef.current){
                                headerUiRef.current.style.transform = `translateY(-${(mapHeight as number) + offset}px)`
                            }
                            if(imageNavigationRef.current){
                                imageNavigationRef.current.style.transform = `translateY(${(imageNavigationHeight as number) + offset}px)`
                            }
                            
                        }
                    }}
                >
                    <IoIosMenu
                        size={isDesktop?40:35}
                    />
                </div>
            :null}
        </>
    );
}
 
export default MenuUi;