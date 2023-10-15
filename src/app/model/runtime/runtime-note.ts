import { BaseRuntimeDocument } from "../runtime-document";
import { EncryptedNote } from "../storage/encrypted-note";

export interface RuntimeNote extends BaseRuntimeDocument, EncryptedNote {
    type: "note"
    encryptedKeys: ["name"]
}