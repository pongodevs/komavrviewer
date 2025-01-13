// Coupon Type
export type CouponType={
    _id:string,
    affiliator:string,
    discount:number,
    expiredTime:number,
    label:string,
    useLeft:number,
    validFor:string[]
}

export const couponObject:CouponType= {
    _id:'',
    affiliator:'',
    discount:0,
    expiredTime:0,
    label:'',
    useLeft:0,
    validFor:[]
}