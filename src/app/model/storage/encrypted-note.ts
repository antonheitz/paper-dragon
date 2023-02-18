import { BaseDocument } from "../base-document";

export interface EncryptedNote extends BaseDocument {
    name: string
    folderId: string
    content: string
    type: "note"
}
