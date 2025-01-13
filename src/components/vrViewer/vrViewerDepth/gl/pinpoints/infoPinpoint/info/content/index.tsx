import { createContext, useContext } from "react";
import Description from "./description";
import Header from "./header";
import Images from "./images";
import LineDivider from "./lineDivider";
import _ from "lodash";
import { InfoPinpointContext } from "../..";
import Url from "./url";

type ContentContextType = {
    descriptionArray:any[]
}
export const ContentContext = createContext<ContentContextType>({} as ContentContextType)
const Content = () => {
    const {pinpoint, descriptionSize} = useContext(InfoPinpointContext)
    const charCount = 500 / descriptionSize
    
    const getDescription = ()=>{
        const textArray = pinpoint.info.description.split(' ')
        const finalTextArray = []
        let lineCount = 0
        let lineText = []
        for(const text of textArray){
            lineCount += (text.length + 2)
            if(lineCount > charCount){
                finalTextArray.push(lineText)
                lineCount = 0
                lineText = []
                lineText.push(text)
            }
            else{
                lineText.push(text)
            }
        }
        finalTextArray.push(lineText)
        return finalTextArray.map(textArray=>{return textArray.join(' ')})
    }

    const descriptionArray = getDescription()
    
    return (  
        <ContentContext.Provider
            value={{
                descriptionArray
            }}
        >
            <group
                position={[
                    0,
                    0,
                    0.01
                ]}
            >
                {pinpoint.info.header !== ""?
                    <Header/>
                :null}
                <LineDivider/>
                {pinpoint.info.description !== ""?
                    <Description/>
                :null}
                {pinpoint.info.images.imageList.length > 0?
                    <Images/>
                :null}
                {pinpoint.info.url !== ""?
                    <Url/>
                :null}
            </group>
        </ContentContext.Provider>
    );
}
 
export default Content;