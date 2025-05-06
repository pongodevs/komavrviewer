import Head from "next/head";
import { useRouter } from "next/router";

const navLists = [
    'Wenzhou',
    'Wuhan'
]
const HomepageIndex = () => {
    const router= useRouter()
    return ( 
        <>
            <Head>
                <title>{'Topgolf VR Viewer'}</title>
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
                    content={'Topgolf VR Viewer'}
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
            <div
                style={{
                    padding:`4rem`,
                    boxSizing:`border-box`,
                    display:`flex`,
                    flexDirection:`column`,
                    gap:`2rem`
                }}
            >
                <div
                    style={{
                        fontSize:`2.4rem`,
                        fontWeight:`700`
                    }}
                >
                   Project Directory 
                </div>
                {/*  */}
                <div
                    style={{
                        display:`flex`,
                        flexDirection:`column`,
                        gap:`1rem`
                    }}
                >
                    {navLists.map((nav,index)=>
                        <div
                            style={{
                                cursor:`pointer`,
                                fontSize:`1.6rem`,
                                fontWeight:`400`
                            }}
                            key={index}
                            onClick={()=>{
                                router.push(`/${nav.toLowerCase()}`)
                            }}
                        >
                            {nav}
                        </div>
                    )}
                </div>
            </div>
        </>
     );
}
 
export default HomepageIndex;

