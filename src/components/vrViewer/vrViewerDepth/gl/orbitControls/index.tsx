import { useFrame, useThree } from '@react-three/fiber';
import { useContext} from 'react';
import { VrViewerDepthContext } from '../..';

const OrbitControls = () => {
    const {camera, gl} = useThree()
    const {mouse, showProjectInfo} = useContext(VrViewerDepthContext)

    useFrame(()=>{
        // console.log(gl.info.memory)
        const multiplier = 0.005;

        const reducer = 0.92
        const precision = 1000
        // Yaw
        mouse.movement.x *= reducer;
        mouse.movement.x = Math.round(mouse.movement.x * precision) / precision
        if(Math.abs(mouse.movement.x) < 0.01){
            mouse.movement.x = 0
        }
        // Roll
        mouse.movement.y *= reducer;
        mouse.movement.y = Math.round(mouse.movement.y * precision) / precision
        if(Math.abs(mouse.movement.y) < 0.01){
            mouse.movement.y = 0
        }

        camera.rotation.y += mouse.movement.x * multiplier
        camera.rotation.x = Math.max(Math.min( (camera.rotation.x + (mouse.movement.y * multiplier)) , 1.2),-1.2)

        camera.updateMatrixWorld()
    })
    return (
        null
    );
}
 
export default OrbitControls;