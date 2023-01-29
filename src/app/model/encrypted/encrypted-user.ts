import { BaseDocument } from "../base-document";

export interface EncryptedUser extends BaseDocument {
    name: string,
    conf: string,
    remoteConfig: string
    type: "user"
}