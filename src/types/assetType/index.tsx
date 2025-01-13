// Asset Type
export type DimensionsType = {
    x:number,
    y:number,
    z:number
}

export type AssetType = {
    _id:string,
    category:string,
    dimensions:DimensionsType,
    downloadUrl:string,
    extension:string,
    fullname:string,
    fullpath:string,
    isFree:boolean,
    isPublished:boolean,
    isQueue:boolean,
    isTrash:boolean,
    name:string,
    privateUrl:string,
    size:number,
    subCategory:string,
    tags:string[],
    thumbnailUrl:string,
    uploader:string,
}

export const assetObject:AssetType = {
    _id:'',
    category:'',
    dimensions:{
        x:0,
        y:0,
        z:0,
    },
    downloadUrl:'',
    extension:'',
    fullname:'',
    fullpath:'',
    isFree:false,
    isPublished:true,
    isQueue:false,
    isTrash:false,
    name:'',
    privateUrl:'',
    size:0,
    subCategory:'',
    tags:[],
    thumbnailUrl:'',
    uploader:''
}




