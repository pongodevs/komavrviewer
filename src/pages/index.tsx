import VrViewer from "@/components/vrViewer";
import Head from "next/head";
import project from '../project.json'

const HomepageIndex = () => {
    return ( 
        <>
            <Head>
                <title>{'VR Viewer'}</title>
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
                    content={'VR Viewer'}
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
            <VrViewer
                vrProject={project as any}
            />
        </>
     );
}
 
export default HomepageIndex;

