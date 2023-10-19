import { BaseDocument } from "../base-document";

export interface EncryptedEntry extends BaseDocument {
    title: string
    noteId: string
    content: string
    type: "entry"
    order: number
}
