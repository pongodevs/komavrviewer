import { useContext } from "react";
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';

const UiHiddenInstruction = () => {
    const {instructionRef, borderRadius} = useContext(VrViewerDynamicContext)
    return (  
        <div
            className=''
            style={{
                pointerEvents:`none`,
                width:`100%`,
                height:`15%`,
                bottom:`0`,
                position:`fixed`,
                display:`flex`,
                zIndex:`5`,
                justifyContent:`center`
            }}
        >
            <div
                ref={instructionRef}
                className="text-white"
                style={{
                    position:`absolute`,
                    top:`0rem`,
                    background:`rgba(0,0,0,0.5)`,
                    opacity:`0%`,
                    transform:`translateY(5rem)`,
                    padding:`1rem`,
                    fontSize:`1.2rem`,
                    fontWeight:`600`,
                    transition:`all 0.5s`,
                    borderRadius,
                }}
            >
            
            </div>
        </div>
    );
}
 
export default UiHiddenInstruction;