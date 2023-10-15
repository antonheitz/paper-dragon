import { BaseDocument } from "../base-document"

export interface EncryptedFile extends BaseDocument {
    name: string
    entryId: string
    content: string
    type: "file"
}
