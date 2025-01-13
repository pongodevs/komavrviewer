import { useContext, useEffect } from "react";
import { VrViewerDepthContext } from "../..";
import { VrViewerContext } from "../../..";
import _ from "lodash";
import * as THREE from 'three'
import useDecoder from "@/hooks/decoder";
import { isDesktop } from "react-device-detect";

const AutoLoadViews = () => {
    const {setLoadedViews, loadedViews, selectedProject, textureLoader}= useContext(VrViewerContext)
    const {decode16BitPng} = useDecoder()
    useEffect(()=>{
        const allViews = _.flatten(selectedProject.scenes.map(scene=>{
            return [...scene.viewList]
        }))
        const firstView = selectedProject.scenes[0].viewList[0]
        const allViewsWithDistance = allViews.map(view=>{
            return {...view,
                distance:new THREE.Vector3(firstView.position.x, firstView.position.y, firstView.position.z).distanceTo(new THREE.Vector3(view.position.x, view.position.y, view.position.z))
            }
        })
        const sortedAllViewsByNearest = allViewsWithDistance.sort((a,b)=>{
            return a.distance - b.distance
        })

        sortedAllViewsByNearest.forEach((view,index)=>{
            setTimeout(async()=>{
                const findView = loadedViews.find(v=>{return v._id === view._id})
                if(!findView){
                    const depth = await decode16BitPng(view.depthUrl)
                    textureLoader.load(isDesktop? view.imageUrl6000 : view.imageUrl4000,(diffuseTexture)=>{
                        diffuseTexture.magFilter = THREE.LinearFilter
                        diffuseTexture.minFilter = THREE.LinearFilter
                        const newView = {...view}
                        newView.texture = diffuseTexture
                        newView.depthMacroTexture = depth.macroTexture
                        newView.depthMicroTexture = depth.microTexture
                        setLoadedViews(prev=>{return [...prev, newView]})
                    })
                }
            },index * 500)
        })
    },[])
    return (  
        <>
        </>
    );
}
 
export default AutoLoadViews;