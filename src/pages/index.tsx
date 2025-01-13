import VrViewer from "@/components/vrViewer";
import Head from "next/head";
import project from '../project.json'

const HomepageIndex = () => {
    return ( 
        <>
            <Head>
                <title>{'Pongo Library'}</title>
                <meta 
                    name="description"
                    content={'All in one Blender Addon to improve and optimize your workflow.'}
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
                    content={'Pongo Library'}
                />
                <meta
                    property="og:description"
                    content={'All in one Blender Addon to improve and optimize your workflow.'}
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
            <VrViewer
                vrProject={project as any}
            />
        </>
     );
}
 
export default HomepageIndex;

