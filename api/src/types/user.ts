export type User =   {
    name : string,
    email: string,
    password : string,
    created_at: number,
    roles : string[],
    permissions: string[]
}

export type requestBodySignup = {
    name : string,
    email: string,
    password : string,
}

export type requestBodyLogin = {
    email: string,
    password : string,
}