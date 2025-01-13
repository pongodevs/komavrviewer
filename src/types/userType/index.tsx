// User Type
// Affiliation

export type AffiliationType = {
    sales:PaymentType[],
    salesId:string[],
    isAffiliator:boolean
}

// Pongo Addons
export type TokenType = {
    _id:string,
    user:string,
    hostname:string,
    loginIp:string,
    migrationTimestamp:number,
    numberOfMigration:number
}
export type PongoAddonsType={
    isUnlocked:boolean,
    tokens:TokenType[],
    tokensId:string[]
}
// Pongo Hub
export type PongoHubType = {}

export type MyCoursesType = {
    _id:string
    ccOptions:string
    courseLabel:string
    playbackSpeed:number
    watchedVideos:string[]
}

// Pongo Learn
export type PongoLearnType= {
    myCourses:MyCoursesType[],
    myCoursesId:string[],
}

// Pongo Library
export type DownloadedAssetType = {
    _id:string,
    filename: string,
    isDownloaded: boolean,
    nextDownloadedTimestamp:number,
    downloadUrl:string,
}
export type PongoLibraryType={
    freeBandwidth:number,
    paidBandwidth:number,
    downloadedAssets:DownloadedAssetType[],
    downloadedAssetsId:string[],
    showDownloadDialogBox:boolean
}

export const pongoLibraryObject:PongoLibraryType = {
    paidBandwidth:0,
    freeBandwidth:0,
    downloadedAssets:[],
    downloadedAssetsId:[],
    showDownloadDialogBox:false
}

// Pongo Vr
export type PongoVrType ={
    vrProjects:Object[],
    vrProjectsId:string[],
}

export type SubscriptionStatusType={
    subscribeUntil:number,
    subscriptionType:string,
    usedFreeTrial:boolean,
}

export const subscriptionStatusObject:SubscriptionStatusType = {
    subscribeUntil:0,
    subscriptionType:'',
    usedFreeTrial:true
}

export type PaymentType = {
    _id:string,
    type:'pongolibrary' | 'pongovr' | 'pongohub' | 'pongolearn' | 'bundle',
    subType:string,
    firstName: string, 
    lastName: string, 
    buyerEmail: string, 
    transactionTime: string, 
    transactionId: string, 
    paymentType: string, 
    usdRate: string,
    grossAmount: number, 
    couponId: string, 
    itemName: string,
    url: string,
    disbursed:boolean,
    region:{
        country:string,
        city:string,
        countryCode:string,
        currency:string
    }
}
export const paymentObject: PaymentType = {
    _id:'',
    type:'pongolibrary',
    subType:'',
    firstName: '', 
    lastName: '', 
    buyerEmail: '', 
    transactionTime: '', 
    transactionId: '', 
    paymentType: '', 
    usdRate: '',
    grossAmount: 0, 
    couponId: '', 
    itemName: '',
    url: '',
    disbursed:false,
    region:{
        country:'',
        city:'',
        countryCode:'',
        currency:''
    }
}
export type TransactionType = {
    payments:PaymentType[],
    paymentsId:string[]
}

export type ReferralType = {
    referralCode:string
}

export type LoginStatusType={
    city: string,
    ip: string,
    network:string,
    org:string,
    country:string,
    countryCode:string,
    countryName:string,
    currency:string,
    utcOffset:string,
    version:string,
}

export const loginStatusObject:LoginStatusType = {
    city: '',
    ip: '',
    network:'',
    org:'',
    country:'',
    countryCode:'',
    countryName:'',
    currency:'',
    utcOffset:'',
    version:'',
}

export type UserType={
    _id:string,
    affiliation:AffiliationType,
    referral:ReferralType,
    transaction:TransactionType,
    displayName:string,
    email:string,
    firstName:string,
    lastName:string,
    phone:string | null,
    photoUrl:string,
    pongoAddons:PongoAddonsType,
    pongoHub:PongoHubType,
    pongoLearn:PongoLearnType,
    pongoLibrary:PongoLibraryType,
    pongoVr:PongoVrType,
    subscriptionStatus:SubscriptionStatusType,
    loginStatus:LoginStatusType,
}

export const userObject:UserType={
    _id:'',
    affiliation:{
        isAffiliator:false,
        sales:[],
        salesId:[]
    },
    transaction:{
        payments:[],
        paymentsId:[]
    },
    referral:{
        referralCode:'',
    },
    displayName:'',
    email:'',
    firstName:'',
    lastName:'',
    phone:'',
    photoUrl:'',
    pongoAddons:{
        isUnlocked:false,
        tokens:[],
        tokensId:[]
    },
    pongoHub:{
        
    },
    pongoLearn:{
        myCourses:[],
        myCoursesId:[]
    },
    pongoLibrary:pongoLibraryObject,
    pongoVr:{
        vrProjects:[],
        vrProjectsId:[]
    },
    subscriptionStatus:subscriptionStatusObject,
    loginStatus:loginStatusObject
}