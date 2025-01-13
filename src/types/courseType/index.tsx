
export type SubtitleType={
    language:string,
    subtitleUrl:string
}

export type VideoType={
    language:string,
    videoUrl:string
}
export const videoObject: VideoType={
    language:'',
    videoUrl:'',
}

export type VideoItemType = {
    label:string,
    type:string,
    subtitle:SubtitleType[],
    video:VideoType[]
}
export const videoItemObject:VideoItemType = {
    label:'',
    type:'',
    subtitle:[],
    video:[]
}

export type ChapterType = {
    chapter:string,
    isLocked:boolean,
    items:VideoItemType[],
} 

export type CourseType={
    _id:string,
    courseLabel:string,
    description:string,
    courseIndex:number,
    language:string[],
    price:number,
    thumbnailUrl:string,
    videos:ChapterType[],
    author:string
}

export const courseObject: CourseType = {
    _id:'',
    courseLabel:'',
    description:'',
    courseIndex:0,
    language:[''],
    price:0,
    thumbnailUrl:'',
    videos:[
        {
            chapter:'',
            isLocked:false,
            items:[{
                label:'',
                type:'',
                video:[],
                subtitle:[]
            }],
        }
    ],
    author:''
}