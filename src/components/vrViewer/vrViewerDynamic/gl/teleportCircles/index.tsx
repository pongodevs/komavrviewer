import React,{useContext, useEffect, useState} from 'react'
import * as THREE from 'three'
import { VrViewerDynamicContext } from '@/components/homepage/bodyContainer/vrViewer/vrViewerDynamic';
import TeleportCircle from './teleportCircle';
import { ViewListType } from '@/types/vrProjectType';

const TeleportCircles = () => {
    const {selectedProject, selectedScene,  isDollHouseMode, mainMeshRef, flooredViewArray, setFlooredViewArray, mainGeometry, gazedGroupRef} = useContext(VrViewerDynamicContext)

    useEffect(()=>{
        if(selectedProject && mainMeshRef && mainMeshRef.current){
            const normalizedView = selectedScene.viewList.map((view:ViewListType)=>{
                const raycaster = new THREE.Raycaster()
                raycaster.set(new THREE.Vector3(view.position.x, view.position.y, view.position.z), new THREE.Vector3(0,-1,0))
                const intersectObject = raycaster.intersectObject(mainMeshRef.current, false)
                if(intersectObject.length > 0){
                    return {...view,
                        position:new THREE.Vector3(view.position.x, view.position.y - intersectObject[0].distance + 0.06, view.position.z)
                    }
                }
                else{
                    return view
                }
            })
            if(mainGeometry.boundingBox){
                const filterClippingPosition = normalizedView.filter((view:ViewListType)=>{
                    return view.position?.y - mainGeometry.boundingBox.min.y < selectedProject.globalSettings.dollHouse.sectionHeight
                })
                setFlooredViewArray(isDollHouseMode? filterClippingPosition : normalizedView)
            }
        }
    },[selectedProject, isDollHouseMode, mainMeshRef, selectedProject?.globalSettings?.dollHouse.sectionHeight, mainGeometry])

    return ( 
        <>
            <group
                ref={gazedGroupRef}
            >
                {selectedProject?.globalSettings.teleportation.isShow?
                    flooredViewArray.map((view,index)=>
                        <TeleportCircle
                            key={index}
                            view={view}
                        />
                    )
                :null}
            </group>
        </>
    );
}
 
export default TeleportCircles;