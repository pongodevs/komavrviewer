import { BallTriangle, Circles, Puff, SpinningCircles } from "react-loading-icons";

const TeleportLoading = () => {
    return (  
        <div
            style={{
                position:`fixed`,
                width:`100%`,
                height:`100%`,
                background:`rgba(0,0,0,0.2)`,
                zIndex:`1`,
                display:`flex`,
                justifyContent:`center`,
                alignItems:`center`
            }}
        >
            <Puff/>
        </div>
    );
}
 
export default TeleportLoading;