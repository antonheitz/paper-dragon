import { BaseRuntimeDocument } from "../runtime-document";
import { EncryptedEntry } from "../storage/encrypted-entry";

export interface RuntimeEntry extends BaseRuntimeDocument, EncryptedEntry {
    type: "entry"
    encryptedKeys: ["title", "content"]
}