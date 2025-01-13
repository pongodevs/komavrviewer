import Icon from "./icon";
import Thumbnail from "./thumbnail";

const ThumbnailContainer = () => {
    return (  
        <group
            position={[
                0,
                0,
                0.01
            ]}  
        >
            <Thumbnail/>
            <Icon/>
        </group>
    );
}
 
export default ThumbnailContainer;