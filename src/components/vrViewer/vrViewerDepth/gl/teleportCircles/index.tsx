import React,{useContext, useEffect, useState} from 'react'
import * as THREE from 'three'
import TeleportCircle from './teleportCircle';
import { ViewListType } from '@/types/vrProjectType';
import { VrViewerDepthContext } from '../..';
import { VrViewerContext } from '../../..';

const TeleportCircles = () => {
    const {selectedProject} = useContext(VrViewerContext)
    const {teleportCirclesRef, selectedScene} = useContext(VrViewerDepthContext)

    return ( 
        <>
            <group
                ref={teleportCirclesRef}
            >
                {selectedProject?.globalSettings.teleportation.isShow?
                    selectedScene.viewList.map((view,index)=>
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