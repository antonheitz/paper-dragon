import { BaseRuntimeDocument } from "../runtime-document";
import { EncryptedFolder } from "../storage/encrypted-folder";

export interface RuntimeFolder extends BaseRuntimeDocument, EncryptedFolder {
    type: "folder"
    encryptedKeys: ["name"]
}