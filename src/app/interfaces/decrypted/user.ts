export interface NewUser {
    name: string,
    pwHash: string,
    pwHint: string,
    workspaces: string[],
    theme: string,
    pwDoubbleHash: string
}

export interface User extends NewUser{
    _id: string
    _rev: string
}