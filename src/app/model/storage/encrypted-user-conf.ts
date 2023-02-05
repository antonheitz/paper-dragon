import { BaseDocument } from "../base-document";

export interface EncryptedUserConf extends BaseDocument {
    name: string
    value: string
    type: "user-conf"
}