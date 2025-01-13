import { useFrame, useThree } from '@react-three/fiber';
import { useContext} from 'react';
import { VrViewerStaticContext } from '../..';

const OrbitControls = () => {
    const {camera, gl} = useThree()
    const {mouse, enableOrbitControl, setEnableOrbitControl} = useContext(VrViewerStaticContext)

    useFrame(()=>{
        // console.log(gl.info.memory)
        const multiplier = 0.005;
        // Yaw
        // mouse.movement.x -= (mouse.movement.x/15);
        mouse.movement.x *= 0.92;
        camera.rotation.y += mouse.movement.x * multiplier

        // Roll
        // mouse.movement.y -= (mouse.movement.y/15);
        mouse.movement.y *= 0.92;
        camera.rotation.x = Math.max(Math.min( (camera.rotation.x + (mouse.movement.y * multiplier)) , 1.2),-1.2)

        camera.updateMatrixWorld()
    })
    return (
        null
    );
}
 
export default OrbitControls;