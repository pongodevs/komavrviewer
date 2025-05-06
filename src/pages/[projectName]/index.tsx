import Head from "next/head";
import dynamic from 'next/dynamic'
import { useState } from "react";
import { useRouter } from "next/router";
import wenzhou from '../../projects/fdd79a97-24e8-5048-b39b-04e0e0cbcad8/project.json'
import wuhan from '../../projects/48f3b315-1f47-5dcc-813f-9006a3a1d529/project.json'

const VrViewerNoSSR = dynamic(() => import('@/components/vrViewer'), { ssr: false })

const HomepageIndex = () => {
    const router = useRouter()
    const {projectName} = router.query

    const getProject = ()=>{
        if(projectName == 'wenzhou'){
            return wenzhou
        }
        if(projectName == 'wuhan'){
            return wuhan
        }
    }

    const project = getProject() as any
    if(!project) return null;
   
    return ( 
        <>
            <Head>
                <title>{project.projectName}</title>
                <meta 
                    name="description"
                    content={'Topgolf VR Viewer.'}
                />
                <meta 
                    name="viewport" 
                    content="initial-scale=1.0, width=device-width" 
                />
                <meta 
                    httpEquiv="Content-Type" 
                    content="text/html;charset=UTF-8"
                />
                {/* Open Graph Protocol */}
                <meta 
                    property="og:title" 
                    content={project.projectName}
                />
                <meta
                    property="og:description"
                    content={'Topgolf VR Viewer.'}
                />
                {/* Image */}
                <meta
                    property="og:image"
                    content={'https://pongolibrary.com/images/metadata.jpg'}
                />
                <meta 
                    property="og:image:secure_url" 
                    content={'https://pongolibrary.com/images/metadata.jpg'}
                />
                <meta 
                    property="og:image:type" 
                    content="image/jpeg" 
                />
                <meta 
                    property="og:image:width" 
                    content="400" 
                />
                <meta 
                    property="og:image:height" 
                    content="225" 
                />
                <meta 
                    property="og:image:alt" 
                    content="an example render of Pongo" 
                />
            </Head>
            <VrViewerNoSSR
                vrProject={project as any}
            />
        </>
     );
}
 
export default HomepageIndex;

