import { BaseDocument } from "../base-document"

export interface EncryptedFile extends BaseDocument {
    name: string
    folderId: string
    content: string
    type: "file"
}
