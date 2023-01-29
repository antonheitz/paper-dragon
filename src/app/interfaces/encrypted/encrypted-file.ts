import { BaseDocument } from "../base-document"

export interface EncryptedFile extends BaseDocument {
    name: string
    folderID: string
    content: string
    type: "note"
}
