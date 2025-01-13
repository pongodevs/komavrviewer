import { useContext } from "react";
import { VrViewerContext } from "..";

const DialogBoxContainer = () => {
    const {showDialogBox} = useContext(VrViewerContext)
    return (  
        <>
            {showDialogBox}
        </>
    );
}
 
export default DialogBoxContainer;