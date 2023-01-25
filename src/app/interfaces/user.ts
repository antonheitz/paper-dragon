export interface User {
    name: string,
    pwHash: string,
    pwHint: string,
    workspaces: string[],
    theme: string,
    pwDoubbleHash: string
}
