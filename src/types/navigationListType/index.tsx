import { ListItem1Type } from "../listItem1"

export type NavigationListType = {
    label:string,
    items:ListItem1Type[],
    disable?:boolean
}

export const navigationListObject: NavigationListType = {
    label:'',
    items:[],
    disable:false
}