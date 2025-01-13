import { useXR } from "@react-three/xr";
import { useContext } from "react";
import * as THREE from 'three'
import { VrViewerDepthContext } from "../..";

const LoadingXrObject = () => {
    const {currentView, isTeleportLoading} = useContext(VrViewerDepthContext)
    const {player:xrPlayer} = useXR()
    return (  
        <>
            <mesh
                position={[xrPlayer.position.x, xrPlayer.position.y, xrPlayer.position.z]}
            >
                <meshBasicMaterial
                    color={`black`}
                    side={THREE.DoubleSide}
                    transparent={true}
                    opacity={isTeleportLoading?0.7 : 0}
                    depthTest={false}
                    depthWrite={false}
                />
                <sphereGeometry
                    args={[0.2,32,16]}
                />
            </mesh>
        </>
    );
}
 
export default LoadingXrObject;