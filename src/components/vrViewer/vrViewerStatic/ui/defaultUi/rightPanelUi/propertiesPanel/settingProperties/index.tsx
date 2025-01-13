import Button from "@/components/common/button";
import { VrViewerContext } from "@/components/homepage/bodyContainer/vrViewer";
import { VrProjectType } from "@/types/vrProjectType";
import { useContext } from "react";
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { saveAs } from 'file-saver';

const SettingProperties = () => {
    const {selectedProject} = useContext(VrViewerContext)
    return (  
        <div
            style={{
                display:`flex`,
                flexDirection:`column`,
                gap:`2rem`,
                margin:`2rem`
            }}
        >
            <Button
                label="Create Local Project"
                onClick={async()=>{
                    console.log(selectedProject)
                    const formatLabel = (label:string)=>{
                        return label.toLowerCase().split(' ').join('_')
                    }

                    // Edit json data
                    // every single url must be converted to require syntax in order for React Native to read it localy
                    const localProject:VrProjectType = {...selectedProject}
                    
                    // For Logo
                    localProject.globalSettings.logo.logoUrl = `REQUIRESTART_images/logo/topgolf_logo.png_REQUIREEND`

                    // For Map
                    localProject.maps = selectedProject.maps.map(map=>{
                        return {...map,
                            imageUrl: `REQUIRESTART_images/maps/${formatLabel(map.mapName)}.png_REQUIREEND`,
                            pinpoints: map.pinpoints.map(pinpoint=>{
                                return {...pinpoint,
                                    thumbnailUrl:''
                                }
                            })
                        }
                    })

                    // For Views
                    localProject.scenes = selectedProject.scenes.map(scene=>{
                        return {...scene,
                            viewList:scene.viewList.map(view=>{
                                return {...view,
                                    imageUrl4000:'',
                                    imageUrl6000:'',
                                    imageUrl:`REQUIRESTART_images/views/${formatLabel(view.labelName)}.jpg_REQUIREEND`,
                                    thumbnailUrl:`REQUIRESTART_images/thumbnails/${formatLabel(view.labelName)}.jpg_REQUIREEND`,
                                    pinpoints:view.pinpoints.map(pinpoint=>{
                                        return {...pinpoint,
                                            thumbnailUrl:`REQUIRESTART_images/thumbnails/${formatLabel(pinpoint.labelName)}.jpg_REQUIREEND`,
                                        }
                                    })
                                }
                            })
                        }
                    })

                    
                    // Files for Map
                    const files:any[] = []

                    // For Map
                    selectedProject.maps.forEach(map=>{
                        const file = {url: map.imageUrl, filename:`maps/${formatLabel(map.mapName)}.png`}
                        files.push(file)
                    })
                    
                    // For View and Thumbnail
                    selectedProject.scenes.forEach(scene=>{
                        scene.viewList.forEach(view=>{
                            const viewFile = {url:view.imageUrl, filename:`views/${formatLabel(view.labelName)}.jpg`}
                            const thumbnailFile = {url:view.thumbnailUrl, filename:`thumbnails/${formatLabel(view.labelName)}.jpg`}
                            files.push(viewFile)
                            files.push(thumbnailFile)
                        })
                    })

                    const zip = new JSZip();

                    // Zip all files
                    const promises = files.map(async(file) => {
                        const promise = new Promise(async(resolve,reject)=>{
                            const fileBlob = await (await fetch(file.url)).blob();
                            zip.file(file.filename, fileBlob);
                            return resolve('solved')
                        })
                        return await promise
                    });
                    const res = await Promise.all(promises)

                    // Zip json data
                    const headerString = `
                    import { VrProjectType } from "../../types/vrProjectType";
                    import { Asset } from 'expo-asset';
                
                    export const projectInfo: VrProjectType = `;

                    const jsonString = JSON.stringify(localProject, null , 2).replaceAll(`"REQUIRESTART_`,`require("../`).replaceAll(`_REQUIREEND"`,`")`)
                    console.log(jsonString)

                    const finalString = `${headerString}\n${jsonString};\n`;
                    zip.file('projectInfo.tsx', finalString)
                    
       
                    zip.generateAsync({ type: 'blob' }).then(function (content) {
                        FileSaver.saveAs(content, `${formatLabel(selectedProject.projectName)}.zip`);
                    });

                    // Maps Folder

                }}
            />
            <Button
                label="Create Local Project Topgolf"
                onClick={async()=>{
                    // console.log(project)
                    // console.log(JSON.stringify(project))

                    const zip = new JSZip();
                    
                    // Zip JSON object
                    zip.file('project.json',JSON.stringify(selectedProject, null, 2))
                    // Array to hold all fetch promises
                    const fetchPromises = [] as any[];

                    // Iterate through scenes
                    selectedProject.scenes.forEach(scene => {
                        const sceneFolder = zip.folder(scene.sceneName) as any; // Create a folder for each scene

                        // Iterate through viewList in the scene
                        scene.viewList.forEach(view => {
                            console.log(view.viewName)
                            // Fetch the image and store the promise
                            const fetchPromise = fetch(view.imageUrl)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`Failed to fetch ${view.imageUrl}`);
                                    }
                                    return response.blob();
                                })
                                .then(blob => {
                                    // Add the image to the scene folder with the viewName
                                    sceneFolder.file(`${view.viewName}.jpg`, blob);
                                });

                            fetchPromises.push(fetchPromise); // Add promise to the array
                        });
                    });

                    // Wait for all fetches to complete
                    try {
                        await Promise.all(fetchPromises);

                        // Generate the ZIP after all images are added
                        zip.generateAsync({ type: 'blob' }).then(content => {
                            // Save the ZIP file
                            saveAs(content, `${selectedProject.projectName}.zip`);
                        });
                    } catch (error) {
                        console.error('Error fetching images:', error);
                    }

                }}
            />
        </div>
    );
}
 
export default SettingProperties;