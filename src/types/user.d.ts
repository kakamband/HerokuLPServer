export interface user {
    id                  : number                        ,
    username            : string                        ,
    password            : string                        ,
    email               : string                        ,
    avatar              : string                        ,
    devices             : [ {                            
        name            : string                        , 
        uuid            : string                        , 
        date            : number                        ,
    } ]                                                 ,
    currentDevice       : string                        ,
    credit              : number                        ,
    purchased_items     : { [key: string]: string[] }   ,
    gotFromThisRibosome : string[]                      ,
}

export interface key {
    name: string,
    uuid: string,
    date?: number
}