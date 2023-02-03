import { BaseRuntimeDocument } from "../runtime-document";
import { EncryptedFile } from "../storage/encrypted-file";

export interface RuntimeFile extends BaseRuntimeDocument, EncryptedFile {
    type: "file"
}