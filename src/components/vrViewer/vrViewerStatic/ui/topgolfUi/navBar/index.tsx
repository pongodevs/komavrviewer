import { useContext } from "react";
import { VrViewerContext } from '@/components/homepage/bodyContainer/vrViewer';
import NavList from "./navList";
import HideIcon from "./hideIcon";
import { isDesktop } from "react-device-detect";

const NavBar = ({hideIcon,backgroundColor}:{hideIcon?:boolean, backgroundColor?:string}) => {
    const {selectedProject} = useContext(VrViewerContext)
    
    return (  
        <div
            className="text-white"
            style={{
                backgroundColor:backgroundColor,
                fontSize:`1.1rem`,
                fontWeight:`600`,
                width:`calc(100% - 1rem)`,
                height:isDesktop?`3rem`:`4rem`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`,
                gap:`.5rem`,
                padding:`1rem`,
                position:`relative`,
                zIndex:`1`
            }}
        >
            {selectedProject.maps.map((map,index)=>
                <NavList 
                    key={index}
                    map={map}
                />
            )}
            {hideIcon?
                <HideIcon/>
            :null}
        </div>
    );
}
 
export default NavBar;