import { BaseRuntimeDocument } from "../runtime-document";
import { EncryptedUserConf } from "../storage/encrypted-user-conf";

export interface RuntimeUserConf extends BaseRuntimeDocument, EncryptedUserConf {
    type: "user-conf"
}