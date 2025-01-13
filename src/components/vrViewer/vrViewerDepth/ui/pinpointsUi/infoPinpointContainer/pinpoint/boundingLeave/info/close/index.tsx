import { useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { InfoPinpointContainerContext } from "../../../..";
import { PinpointsUiContext, isEditObject } from "../../../../..";
import { pinpointObject } from "@/types/vrProjectType";

const Close = () => {
    const {setIsRenderInfo} = useContext(InfoPinpointContainerContext)
    const {setIsEdit, setEditedPinInfo} = useContext(PinpointsUiContext)
    const size = 35
    return (  
        <div
            className='text-red'
            style={{
                zIndex:`2`,
                position:`absolute`,
                right:`${0}px`,
                top:`${0}px`
            }}
            onClick={()=>{
                setIsRenderInfo(false)
                setIsEdit(isEditObject)
                setEditedPinInfo(pinpointObject)
            }}
        >
            <IoIosClose
                size={size}
            />
        </div>
    );
}
 
export default Close;