export interface NewEncryptedUser {
    name: string,
    pwHint: string,
    workspaces: string[],
    theme: string,
    pwDoubbleHash: string
}

export interface EncryptedUser extends NewEncryptedUser{
    _id: string
    _rev: string
}