import { BaseDocument } from "../base-document";

export interface EncryptedNote extends BaseDocument {
    name: string
    type: "note"
}
