import { BaseDocument } from "../base-document";

export interface EncryptedSpaceConf extends BaseDocument{
    name: string
    pwDoubleHash: string
    pwHint: string
    personal: boolean
    type: "space-conf"
}
