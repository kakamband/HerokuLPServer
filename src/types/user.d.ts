export interface user {
    id              : number                        ,
    username        : string                        ,
    password        : string                        ,
    email           : string                        ,
    avatar          : string                        ,
    devices         : string                        ,
    credit          : number                        ,
    purchased_items : { [key: string]: string[] }   ,
    gotLessons      : string[]                      ,
}