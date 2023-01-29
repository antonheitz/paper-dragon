import { BaseDocument } from "../base-document";

export interface EncryptedFolder extends BaseDocument {
    name: string
    parent: string
    type: "folder"
}
