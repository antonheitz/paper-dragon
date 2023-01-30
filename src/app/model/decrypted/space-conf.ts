import { BaseItem } from "./base-item";

export interface SpaceConf extends BaseItem {
    name: string
    pwHash: string
    pwDoubleHash: string
    pwHint: string
    personal: boolean
    type: "space-conf"
}