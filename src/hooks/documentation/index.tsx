import { MouseEventHandler } from 'react';
import { useRouter } from 'next/router';
const Button = ({label,onClick}:{label:string, onClick:MouseEventHandler})=>{
    return (
        <span
            onClick={onClick}
            className="bg-grey"
            style={{
                cursor:`pointer`,
                padding:`0.5rem 0.8rem`,
                borderRadius:`5px`,
                margin:`0rem 0.5rem`

            }}
        >
            {label}
        </span>
    )
}

const Bold = ({label}:{label:string})=>{
    return(
        <span 
            style={{fontWeight:`600`}}
        >
            {label}
        </span>
    )
}

const useDocumentation = () => {
    const router = useRouter()
    const documentations = {
        gettingStarted:[
            {
                header:'Login via Google 1',
                description:<p>Go to account page.</p>,
                src:"/documentation/gettingStarted/1.jpg",
                animation: {
                    x:2.1,
                    y:95.4,
                    height:`6%`,
                    width:`4%`
                }
            },
            {
                header:'Login via Google 2',
                description:<p>Click this to login via google.</p>,
                src:"/documentation/gettingStarted/2.jpg",
                animation: {
                    x:8.3,
                    y:10.7,
                    height:`4%`,
                    width:`8%`
                }
            },
            {
                header:'Navigate to subscription page',
                description:<p>After successfully login, navigate to subscription page.</p>,
                src:"/documentation/gettingStarted/3.jpg",
                animation: {
                    x:8.3,
                    y:17.3,
                    height:`4%`,
                    width:`8%`
                }
            },
            {
                header:'Subscription',
                description:<p>You can click this to start subscription directly.</p>,
                src:"/documentation/gettingStarted/4.jpg",
                animation: {
                    x:57.8,
                    y:53,
                    height:`6%`,
                    width:`8%`
                }
            },
            {
                header:'Start free trial',
                description:<p>Or alternatively, click this button to start your <Bold label="Free Trial"/>.</p>,
                src:"/documentation/gettingStarted/4.jpg",
                animation: {
                    x:61.8,
                    y:76.8,
                    height:`4%`,
                    width:`5%`
                }
            },
            {
                header:'Subscription status',
                description:<p>After that, here you can see your subscription status.</p>,
                src:"/documentation/gettingStarted/5.jpg",
                animation: {
                    x:9.1,
                    y:9.9,
                    height:`4%`,
                    width:`10%`
                }
            },
            {
                header:'Bandwidth preview',
                description:<p>This indicates how much bandwidth do you have. <span className='text-green'>Green indicates paid bandwidth</span>  and <span className='text-blue'>blue indicates free bandwidth</span>.</p>,
                src:"/documentation/gettingStarted/5.jpg",
                animation: {
                    x:9.1,
                    y:13.3,
                    height:`4%`,
                    width:`10%`
                }
            },
            {
                header:'Download page',
                description:<p>Go to download page.</p>,
                src:"/documentation/gettingStarted/5.jpg",
                animation: {
                    x:8.3,
                    y:26.6,
                    height:`4%`,
                    width:`8%`
                }
            },
            {
                header:'Download addons',
                src:"/documentation/gettingStarted/6.jpg",
                animation: {
                    x:57.7,
                    y:92.7,
                    height:`7%`,
                    width:`11%`
                },
                description:
                <p>
                    Download addons by clicking this button. Then go to
                    <Button
                        onClick={()=>{
                            router.push('/documentation/installingAddons')
                        }}
                        label='Installing Addons'
                    />
                </p>,
            },
        ],
        installingAddons:[
            {
                header:'Edit',
                description:<p>Go to edit.</p>,
                src:"/documentation/installingAddons/1.jpg",
                animation: {
                    x:4.5,
                    y:4.4,
                    height:`3%`,
                    width:`3%`
                }
            },
            {
                header:'Preferences',
                description:<p>Go to preferences.</p>,
                src:"/documentation/installingAddons/2.jpg",
                animation: {
                    x:9.3,
                    y:35.2,
                    height:`4%`,
                    width:`14%`
                }
            },
            {
                header:'Install addons',
                description:<p>Click install.</p>,
                src:"/documentation/installingAddons/3.jpg",
                animation: {
                    x:59.7,
                    y:26.7,
                    height:`3%`,
                    width:`8%`
                }
            },
            {
                header:'Install Pongo Addons',
                description:<p>Search where you downloaded the addons, then click <Bold label="Install Add-on"/>.</p>,
                src:"/documentation/installingAddons/4.jpg",
                animation: {
                    x:73.5,
                    y:76.9,
                    height:`5%`,
                    width:`8%`
                }
            },
            {
                header:'Check addons',
                description:<p>Check the installed addons.</p>,
                src:"/documentation/installingAddons/5.jpg",
                animation: {
                    x:41.5,
                    y:32.1,
                    height:`3%`,
                    width:`3%`
                }
            },
            {
                header:'Get tokens',
                description:<p>Click <Bold label="Get/Refresh Token"/>.</p>,
                src:"/documentation/installingAddons/6.jpg",
                animation: {
                    x:63.5,
                    y:56.4,
                    height:`4%`,
                    width:`10%`
                }
            },
            {
                header:'Copy token',
                description:<p>You will be redirected to this page, click this to copy token id.</p>,
                src:"/documentation/installingAddons/7.jpg",
                animation: {
                    x:26.7,
                    y:28.9,
                    height:`3%`,
                    width:`15%`
                }
            },
            {
                header:'Paste token',
                description:<p>Go back to Blender and paste token.</p>,
                src:"/documentation/installingAddons/8.jpg",
                animation: {
                    x:51.7,
                    y:56.5,
                    height:`4%`,
                    width:`17%`
                }
            },
            {
                header:'Login',
                description:<p>Click login.</p>,
                src:"/documentation/installingAddons/8.jpg",
                animation: {
                    x:53.6,
                    y:59.4,
                    height:`4%`,
                    width:`30%`
                }
            },
            {
                header:'Updating addons',
                description:<p>For the first time, you&apos;ll be prompt to update addons, please wait until it finishes.</p>,
                src:"/documentation/installingAddons/9.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Login success',
                description:<p>If login success, you will be redirected like this, this mean the addons successfully installed. Next : 
                    <Button
                        onClick={()=>{
                            router.push('/documentation/assetsBrowser')
                        }}
                        label='Assets Browser'
                    />
                    </p>,
                src:"/documentation/installingAddons/10.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },

        ],
        assetsBrowser:[
            {
                header:'Split Window',
                description:<p>Split your window, and in that area, navigate to Asset Browser.</p>,
                src:"/documentation/assetsBrowser/2.jpg",
                animation: {
                    x:84.4,
                    y:19.3,
                    height:`4%`,
                    width:`12%`
                }
            },
            {
                header:'Asset Browser Area',
                description:<p>Here, you can navigate to <Bold label="Pongo Library"/> for all assets, or you can go to <Bold label="Pongo Library Free"/>  for accessing free assets.</p>,
                src:"/documentation/assetsBrowser/3.jpg",
                animation: {
                    x:52.4,
                    y:18.1,
                    height:`9%`,
                    width:`14%`
                }
            },
            {
                header:'Pongo Library Free',
                description:<p>Here the list of free assets</p>,
                src:"/documentation/assetsBrowser/5.jpg",
                animation: {
                    x:64,
                    y:49,
                    height:`90%`,
                    width:`42%`
                }
            },
            {
                header:'Update Asset Browser',
                description:<p>You can try drag and drop any assets here, it&apos;s <Bold label="totally free"/> , for example this tree.</p>,
                src:"/documentation/assetsBrowser/5.jpg",
                animation: {
                    x:68.3,
                    y:38.2,
                    height:`12%`,
                    width:`7%`
                }
            },
            {
                header:'Downloading All Assets',
                description:<p>Just drag it to the viewport like this.</p>,
                src:"/documentation/assetsBrowser/6.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Waiting for download',
                description:<p>It will start downloading directly, please wait.</p>,
                src:"/documentation/assetsBrowser/7.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Finish download',
                description:<p>When the progress 100%, the downloaded asset will appear on viewport.</p>,
                src:"/documentation/assetsBrowser/8.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Navigate to the downloaded assets',
                description:<p>Affter successfully download asset, please navigate here.</p>,
                src:"/documentation/assetsBrowser/10.jpg",
                animation: {
                    x:51.8,
                    y:18.1,
                    height:`2.7%`,
                    width:`13%`
                }
            },
            {
                header:'Donwloaded assets',
                description:<p>All the downloaded assets will appear here. Next :<Button label="Scene Manager" onClick={()=>{router.push('/documentation/sceneManager')}}/></p>,
                src:"/documentation/assetsBrowser/11.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
        ],
        sceneManager:[
            {
                header:'Scene Manager Scene',
                description:<p>Here, I have this simple project with this object lists.</p>,
                src:"/documentation/sceneManager/1.jpg",
                animation: {
                    x:91.4,
                    y:20.5,
                    height:`35%`,
                    width:`19%`
                }
            },
            {
                header:'Explanation 1',
                description:<p>Here, there are 3 Camera in Camera Collection.</p>,
                src:"/documentation/sceneManager/1.jpg",
                animation: {
                    x:89.3,
                    y:13.8,
                    height:`8%`,
                    width:`10%`
                }
            },
            {
                header:'Explanation 2',
                description:<p>Suzzane and a plane in Object Collection.</p>,
                src:"/documentation/sceneManager/1.jpg",
                animation: {
                    x:89.3,
                    y:21,
                    height:`6%`,
                    width:`10%`
                }
            },
            {
                header:'Explanation 3',
                description:<p>Lighting 2 collection for Camera 2.</p>,
                src:"/documentation/sceneManager/1.jpg",
                animation: {
                    x:89.3,
                    y:26.0,
                    height:`4%`,
                    width:`10%`
                }
            },
            {
                header:'Explanation 4',
                description:<p>Lighting 3 collection for Camera 3.</p>,
                src:"/documentation/sceneManager/1.jpg",
                animation: {
                    x:89.3,
                    y:31.1,
                    height:`6.5%`,
                    width:`10%`
                }
            },
            {
                header:'Accessing Addons',
                description:<p>You can go to <Bold label="Pongo Addons"/> by press <Bold label="N"/> to side panel properties.</p>,
                src:"/documentation/sceneManager/2.jpg",
                animation: {
                    x:81.9,
                    y:29.0,
                    height:`10%`,
                    width:`2%`
                }
            },
            {
                header:'Adding Scene Set',
                description:<p>By clicking this button, you can add many Scene Set.</p>,
                src:"/documentation/sceneManager/3.jpg",
                animation: {
                    x:53.7,
                    y:15.4,
                    height:`3%`,
                    width:`2%`
                }
            },
            {
                header:'Scene Set',
                description:<p>Scene Set act like sub-project, example here I can rename to Still Images, Animation, and VR Project.</p>,
                src:"/documentation/sceneManager/4.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Adding Scene',
                description:<p>You can add many scene for each Scene Set.</p>,
                src:"/documentation/sceneManager/5.jpg",
                animation: {
                    x:53.7,
                    y:28,
                    height:`3%`,
                    width:`2%`
                }
            },
            {
                header:'Pick Camera',
                description:<p>Here we can pick camera for each scene.</p>,
                src:"/documentation/sceneManager/6.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Pick World',
                description:<p>Don&apos;t forget to also pick the world for this scene.</p>,
                src:"/documentation/sceneManager/7.jpg",
                animation: {
                    x:70.2,
                    y:42,
                    height:`5%`,
                    width:`23%`
                }
            },
            {
                header:'Pick World Rest',
                description:<p>Do this until the scene 3, pick every camera and world for every scene.</p>,
                src:"/documentation/sceneManager/8.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Preview Render',
                description:<p>Go back to Scene 1, preview the render from camera view.</p>,
                src:"/documentation/sceneManager/9.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Collection Adjustment',
                description:<p>Hide the Lighting 2 and 3 since this collection don&apos;t belong to Scene 1.</p>,
                src:"/documentation/sceneManager/10.jpg",
                animation: {
                    x:92,
                    y:28.7,
                    height:`10.5%`,
                    width:`15%`
                }
            },
            {
                header:'Update Scene',
                description:<p>Everytime there&apos;s a collection changed, the Scene have an Update option to remember these collection settings.</p>,
                src:"/documentation/sceneManager/10.jpg",
                animation: {
                    x:66.8,
                    y:41.1,
                    height:`4%`,
                    width:`28.4%`
                }
            },
            {
                header:'Updated Scene',
                description:<p>After you click Update Scene, this scene will remember the collection settings.</p>,
                src:"/documentation/sceneManager/11.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Updated Scene 2',
                description:<p>Also do this for Scene 2.</p>,
                src:"/documentation/sceneManager/12.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Updated Scene 3',
                description:<p>And Scene 3.</p>,
                src:"/documentation/sceneManager/13.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Other Settings',
                description:<p>All these properties are binded to the scene that we are selected.</p>,
                src:"/documentation/sceneManager/14.jpg",
                animation: {
                    x:66.9,
                    y:62.3,
                    height:`30%`,
                    width:`28.4%`
                }
            },
            {
                header:'Output By Folder',
                description:<p>Here we have output by folder checklist.</p>,
                src:"/documentation/sceneManager/14.jpg",
                animation: {
                    x:60.4,
                    y:45.8,
                    height:`3%`,
                    width:`2%`
                }
            },
            {
                header:'Go to output properties',
                description:<p>Let&apos;s go to the output properties.</p>,
                src:"/documentation/sceneManager/15.jpg",
                animation: {
                    x:83.5,
                    y:46.4,
                    height:`3%`,
                    width:`2%`
                }
            },
            {
                header:'Output Folder Status',
                description:<p>Here, I have output folder in C:/Render.</p>,
                src:"/documentation/sceneManager/15.jpg",
                animation: {
                    x:92,
                    y:69.4,
                    height:`3%`,
                    width:`15%`
                }
            },
            {
                header:'Output Folder Check',
                description:<p>If I click Output By folder, the output path will be C:/Render/Scene 3 (and also the output file in compositor node if you have any). This will corespond to other scene as well.</p>,
                src:"/documentation/sceneManager/16.jpg",
                animation: {
                    x:0,
                    y:0,
                    height:`0%`,
                    width:`0%`
                }
            },
            {
                header:'Batch Render',
                description:<p>This checkbox is for Batch Render.</p>,
                src:"/documentation/sceneManager/17.jpg",
                animation: {
                    x:79.7,
                    y:30.5,
                    height:`8%`,
                    width:`2%`
                }
            },
            {
                header:'Batch Render Execution',
                description:<p>
                    When you click this button, it will batch render Scene 1 and Scene 3. Next : 
                    <Button
                        label='Material Converter'
                        onClick={()=>{
                            router.push('/documentation/materialConverter')
                        }}
                    />
                </p>,
                src:"/documentation/sceneManager/17.jpg",
                animation: {
                    x:67.2,
                    y:81.5,
                    height:`6%`,
                    width:`29%`
                }
            },
            
        ],
        
        materialConverter:{
            convertMaterial:[
                {
                    header:'1',
                    description:<p>Here I have an object with set of material.</p>,
                    src:"/documentation/materialConverter/convertMaterial/1.jpg",
                    animation: {
                        x:91.2,
                        y:48.2,
                        height:`14%`,
                        width:`15%`
                    }
                },
                {
                    header:'2',
                    description:<p>As you can see, the material settings are pretty basic.</p>,
                    src:"/documentation/materialConverter/convertMaterial/1.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                {
                    header:'3',
                    description:<p>As you can see, the material settings are pretty basic.</p>,
                    src:"/documentation/materialConverter/convertMaterial/2.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                {
                    header:'4',
                    description:<p>As you can see, the material settings are pretty basic.</p>,
                    src:"/documentation/materialConverter/convertMaterial/3.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                {
                    header:'5',
                    description:<p>As you can see, the material settings are pretty basic.</p>,
                    src:"/documentation/materialConverter/convertMaterial/4.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                {
                    header:'6',
                    description:<p>As you can see, the material settings are pretty basic.</p>,
                    src:"/documentation/materialConverter/convertMaterial/5.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                {
                    header:'7',
                    description:<p>Let&apos;s click convert material.</p>,
                    src:"/documentation/materialConverter/convertMaterial/5.jpg",
                    animation: {
                        x:34.6,
                        y:18.1,
                        height:`3%`,
                        width:`11%`
                    }
                },
                {
                    header:'8',
                    description:<p>All material will convert into somewhat useable. Imagine if your have hundred even thousands of material need to be set.</p>,
                    src:"/documentation/materialConverter/convertMaterial/6.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                
            ],
            updateMaterial:[
                {
                    header:'9',
                    description:<p>In this case, I have an object with duplicated material like this. Sometimes, you want duplicated material used the original one.</p>,
                    src:"/documentation/materialConverter/updateMaterial/1.jpg",
                    animation: {
                        x:91.2,
                        y:48.5,
                        height:`14%`,
                        width:`15%`
                    }
                },
                {
                    header:'10',
                    description:<p>Just click <Bold label="Update Material"/>.</p>,
                    src:"/documentation/materialConverter/updateMaterial/1.jpg",
                    animation: {
                        x:34.6,
                        y:20.3,
                        height:`3%`,
                        width:`11%`
                    }
                },
                {
                    header:'11',
                    description:<p>All duplicated material will use the original one.</p>,
                    src:"/documentation/materialConverter/updateMaterial/2.jpg",
                    animation: {
                        x:91.2,
                        y:48.5,
                        height:`14%`,
                        width:`15%`
                    }
                },
            ],
            deleteUnused:[
                {
                    header:'12',
                    description:<p>In this case, I have unnamed material and also unused material like this.</p>,
                    src:"/documentation/materialConverter/deleteUnused/1.jpg",
                    animation: {
                        x:91.2,
                        y:47.2,
                        height:`13%`,
                        width:`15%`
                    }
                },
                {
                    header:'13',
                    description:<p>If you want to clean this up, just click <Bold label="Delete Unused"/>.</p>,
                    src:"/documentation/materialConverter/deleteUnused/1.jpg",
                    animation: {
                        x:34.6,
                        y:22.7,
                        height:`3%`,
                        width:`11%`
                    }
                },
                {
                    header:'14',
                    description:<p>All unnamed and unused material will be deleted.</p>,
                    src:"/documentation/materialConverter/deleteUnused/2.jpg",
                    animation: {
                        x:91.2,
                        y:47.2,
                        height:`13%`,
                        width:`15%`
                    }
                },
            ],
            
        },
        subscription:{
            howtoSubscribe:[
                {
                    header:'1',
                    description:<p>Navigate to account page.</p>,
                    src:"/documentation/subscription/howToSubscribe/1.jpg",
                    animation: {
                        x:2.1,
                        y:95.4,
                        height:`6%`,
                        width:`4%`
                    }
                },
                {
                    header:'2',
                    description:<p>Go to subscription.</p>,
                    src:"/documentation/subscription/howToSubscribe/2.jpg",
                    animation: {
                        x:9.3,
                        y:22,
                        height:`3%`,
                        width:`8%`
                    }
                },
                {
                    header:'3',
                    description:<p>Choose how many tokens, maximum 5 tokens.</p>,
                    src:"/documentation/subscription/howToSubscribe/2.jpg",
                    animation: {
                        x:57.5,
                        y:64.5,
                        height:`4%`,
                        width:`8%`
                    }
                },
                {
                    header:'4',
                    description:<p>Then click subscribe.</p>,
                    src:"/documentation/subscription/howToSubscribe/2.jpg",
                    animation: {
                        x:57.6,
                        y:53,
                        height:`6%`,
                        width:`8%`
                    }
                },
                {
                    header:'5',
                    description:<p>You will be directed to payment page, add coupon if you have any.</p>,
                    src:"/documentation/subscription/howToSubscribe/3.jpg",
                    animation: {
                        x:57.6,
                        y:90.8,
                        height:`15%`,
                        width:`16%`
                    }
                },
                {
                    header:'6',
                    description:<p>Select payment method.</p>,
                    src:"/documentation/subscription/howToSubscribe/4.jpg",
                    animation: {
                        x:57.6,
                        y:51,
                        height:`15%`,
                        width:`20%`
                    }
                },
                {
                    header:'7',
                    description:<p>After payment success, your subscription status will be updated. If not, just refresh the page.</p>,
                    src:"/documentation/subscription/howToSubscribe/5.jpg",
                    animation: {
                        x:9.8,
                        y:11.5,
                        height:`7%`,
                        width:`11%`
                    }
                },
            ],
        },
        bandwidth:{
            topupBandwidth:[
                {
                    header:'1',
                    description:<p>Navigate to account page.</p>,
                    src:"/documentation/bandwidth/topupBandwidth/1.jpg",
                    animation: {
                        x:2.1,
                        y:95.4,
                        height:`6%`,
                        width:`4%`
                    }
                },
                {
                    header:'2',
                    description:<p>Go to bandwidth.</p>,
                    src:"/documentation/bandwidth/topupBandwidth/2.jpg",
                    animation: {
                        x:9.3,
                        y:22,
                        height:`3%`,
                        width:`8%`
                    }
                },
                {
                    header:'3',
                    description:<p>Select bandwidth amount.</p>,
                    src:"/documentation/bandwidth/topupBandwidth/2.jpg",
                    animation: {
                        x:57.7,
                        y:50,
                        height:`35%`,
                        width:`50%`
                    }
                },
                {
                    header:'4',
                    description:<p>You will be directed to payment page, add coupon if you have any.</p>,
                    src:"/documentation/bandwidth/topupBandwidth/3.jpg",
                    animation: {
                        x:57.6,
                        y:90.8,
                        height:`15%`,
                        width:`16%`
                    }
                },
                {
                    header:'5',
                    description:<p>Select payment method.</p>,
                    src:"/documentation/bandwidth/topupBandwidth/4.jpg",
                    animation: {
                        x:57.6,
                        y:51,
                        height:`15%`,
                        width:`20%`
                    }
                },
                {
                    header:'6',
                    description:<p>
                        After payment success, your bandwidth will be updated. If not, just refresh the page.
                    </p>,
                    src:"/documentation/bandwidth/topupBandwidth/5.jpg",
                    animation: {
                        x:9.8,
                        y:11.5,
                        height:`7%`,
                        width:`11%`
                    }
                },
            ],
            paidvsFree:[
                {
                    header:'1',
                    description:<p>
                        <div>
                            Here, you can see your bandwidth status in account page.
                        </div>
                        <div>
                            <span className='text-green'>Green indicates paid bandwidth</span>  and <span className='text-blue'>blue indicates free bandwidth</span>.
                        </div>
                    </p>,
                    src:"/documentation/bandwidth/paidvsFree/1.jpg",
                    animation: {
                        x:9.8,
                        y:11.5,
                        height:`7%`,
                        width:`11%`
                    }
                },
                {
                    header:'2',
                    description:<p>
                        <span className='text-blue'>Free Bandwidth</span> reset at 1st day of the month whenever your subscription status active. This bandwidth won&apos;t be accumulate next month if you don&apos;t use it.
                    </p>,
                    src:"/documentation/bandwidth/paidvsFree/1.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                {
                    header:'3',
                    description:<p>
                        On the other hand, <span className='text-green'>Paid Bandwidth</span> acquired by topup. If your subscription inactive, it can&apos;t be used until the subscription active again.
                    </p>,
                    src:"/documentation/bandwidth/paidvsFree/1.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
            ]
           
        },
        tokens:{
            addingToken:[
                {
                    header:'1',
                    description:<p>Navigate to account page.</p>,
                    src:"/documentation/tokens/addingToken/1.jpg",
                    animation: {
                        x:2.1,
                        y:95.4,
                        height:`6%`,
                        width:`4%`
                    }
                },
                {
                    header:'2',
                    description:<p>Click add new Token.</p>,
                    src:"/documentation/tokens/addingToken/2.jpg",
                    animation: {
                        x:20.6,
                        y:5.4,
                        height:`6%`,
                        width:`8%`
                    }
                },
                {
                    header:'3',
                    description:<p>Please pay attention to this section since there will be changed according to tokens count possesion.</p>,
                    src:"/documentation/tokens/addingToken/3.jpg",
                    animation: {
                        x:57.7,
                        y:44,
                        height:`24%`,
                        width:`27%`
                    }
                },
                {
                    header:'4',
                    description:<p>After reading through it and you sure, please proceed by clicking this button.</p>,
                    src:"/documentation/tokens/addingToken/3.jpg",
                    animation: {
                        x:57.7,
                        y:63.9,
                        height:`5%`,
                        width:`8%`
                    }
                },
                {
                    header:'5',
                    description:<p>You will be directed to payment page, add coupon if you have any.</p>,
                    src:"/documentation/tokens/addingToken/4.jpg",
                    animation: {
                        x:57.6,
                        y:90.8,
                        height:`15%`,
                        width:`16%`
                    }
                },
                {
                    header:'6',
                    description:<p>Select payment method.</p>,
                    src:"/documentation/tokens/addingToken/5.jpg",
                    animation: {
                        x:57.6,
                        y:51,
                        height:`15%`,
                        width:`20%`
                    }
                },
                {
                    header:'7',
                    description:<p>
                        After payment success, your tokens will be updated.
                    </p>,
                    src:"/documentation/tokens/addingToken/6.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
            ],
            renameUser:[
                {
                    header:'1',
                    description:<p>
                        Renaming your token&apos;s user name for to track your token possession. You can double click in this area to change the user name.
                    </p>,
                    src:"/documentation/tokens/renameUser/1.jpg",
                    animation: {
                        x:53.1,
                        y:37.2,
                        height:`21%`,
                        width:`10%`
                    }
                },
                {
                    header:'2',
                    description:<p>
                        Just write the user name you desired.
                    </p>,
                    src:"/documentation/tokens/renameUser/3.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                {
                    header:'3',
                    description:<p>
                        After that you can press enter, the dialog box will pop up in a sec indicating you&apos;re successfully changing the user name.
                    </p>,
                    src:"/documentation/tokens/renameUser/4.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                {
                    header:'4',
                    description:<p>
                        We recommend to give a user name for every tokens since it can be confusing later on when distributing your tokens to multiple devices.
                    </p>,
                    src:"/documentation/tokens/renameUser/5.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
            ],
            usingToken:[
                {
                    header:'1',
                    description:<p>
                        Go to <Bold label="Pongo Addons"/>user preferences in <Bold label="Blender"/>, then <Bold label="Get/Refresh Token"/>.
                    </p>,
                    src:"/documentation/tokens/usingToken/1.jpg",
                    animation: {
                        x:63.6,
                        y:56.6,
                        height:`3.5%`,
                        width:`10%`
                    }
                },
                {
                    header:'2',
                    description:<p>
                        You will be redirected to this page if you&apos;re login using your Google Account. Copy any token that you want to use.
                    </p>,
                    src:"/documentation/tokens/usingToken/2.jpg",
                    animation: {
                        x:73.7,
                        y:37.4,
                        height:`23%`,
                        width:`8%`
                    }
                },
                {
                    header:'3',
                    description:<p>
                        Go back to <Bold label="Blender"/>, and paste the token here.
                    </p>,
                    src:"/documentation/tokens/usingToken/3.jpg",
                    animation: {
                        x:51.8,
                        y:56.6,
                        height:`3.5%`,
                        width:`17%`
                    }
                },
                {
                    header:'4',
                    description:<p>
                        Click login.
                    </p>,
                    src:"/documentation/tokens/usingToken/3.jpg",
                    animation: {
                        x:53.6,
                        y:59.4,
                        height:`3.5%`,
                        width:`30%`
                    }
                },
                {
                    header:'5',
                    description:<p>
                        You will be updating the addons for a while, please wait.
                    </p>,
                    src:"/documentation/tokens/usingToken/4.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                {
                    header:'6',
                    description:<p>
                        After update proccess finished, you will be logged-in.
                    </p>,
                    src:"/documentation/tokens/usingToken/5.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
            ],
            releaseToken:[
                {
                    header:'1',
                    description:<p>
                        Releasing tokens can be accessed here. Releasing token is used for migrating purpose from one device to another.
                    </p>,
                    src:"/documentation/tokens/releaseToken/1.jpg",
                    animation: {
                        x:73.2,
                        y:37.4,
                        height:`23%`,
                        width:`6%`
                    }
                },
                {
                    header:'2',
                    description:<p>
                        But before releasing tokens, please hover your mouse here.
                    </p>,
                    src:"/documentation/tokens/releaseToken/1.jpg",
                    animation: {
                        x:76.6,
                        y:37.4,
                        height:`23%`,
                        width:`1.5%`
                    }
                },
                {
                    header:'3',
                    description:<p>
                        We only give <Bold label="3 times release chance per token per year"/>. If you exceed this limit, you have to wait till the next timestamp for releasing the token again.
                    </p>,
                    src:"/documentation/tokens/releaseToken/2.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                {
                    header:'4',
                    description:<p>
                        If you sure about it, just click on the <Bold label="Release Token"/> button then the token will be released and can be used in another device.
                    </p>,
                    src:"/documentation/tokens/releaseToken/3.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
            ],
            removeToken:[
                {
                    header:'1',
                    description:<p>
                        Removing token can only be done if your subscription is expired.
                    </p>,
                    src:"/documentation/tokens/removeToken/1.jpg",
                    animation: {
                        x:8.4,
                        y:9.9,
                        height:`3%`,
                        width:`7%`
                    }
                },
                {
                    header:'2',
                    description:<p>
                        Removing token can be accessed here. Removing token is useful to adjust your subscription bill since many tokens mean you have to pay higher for the subscription.
                    </p>,
                    src:"/documentation/tokens/removeToken/1.jpg",
                    animation: {
                        x:90.5,
                        y:37.4,
                        height:`23%`,
                        width:`2%`
                    }
                },
                {
                    header:'3',
                    description:<p>
                        If you sure about this, just click any <Bold label="x"/> for the token you want to be delete. The dialog box will pop up next.
                    </p>,
                    src:"/documentation/tokens/removeToken/2.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
                {
                    header:'4',
                    description:<p>
                        After click yes, the token will be deleted with success message on top-right corner of the screen.
                    </p>,
                    src:"/documentation/tokens/removeToken/3.jpg",
                    animation: {
                        x:0,
                        y:0,
                        height:`0%`,
                        width:`0%`
                    }
                },
               
            ]
        },
        contactSupport:[
            {
                header:'14',
                description:<p>All unnamed and unused material will be deleted.</p>,
                src:"/documentation/materialConverter/10.jpg",
                animation: {
                    x:91.2,
                    y:47.2,
                    height:`13%`,
                    width:`15%`
                }
            }
        ]
    }

    return ({documentations});
}
 
export default useDocumentation;