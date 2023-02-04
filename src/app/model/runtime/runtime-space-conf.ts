import { BaseRuntimeDocument } from "../runtime-document";
import { EncryptedSpaceConf } from "../storage/encrypted-space-conf";

export interface RuntimeSpaceConf extends BaseRuntimeDocument, EncryptedSpaceConf {
    pwHash: string
    type: "space-conf",
    encryptedKeys: []
}