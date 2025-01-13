import { ListItem2Type } from "../listItem2"

export type ListItem1Type ={
    label:string,
    items:ListItem2Type[]
}

export const listItem1Object:ListItem1Type = {
    label:'',
    items:[]
}