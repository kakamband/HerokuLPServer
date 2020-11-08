export interface gene {
    id              : number;
    title           : string;
    text            : string;
    avatarURL       : string;
    mediaURL        : string;
}

export interface _new_gene { 
    [key: string ]  : ( userId: string, ribosomeCode: string ) => Promise<gene> 
}

export interface junk {
    // .. mandatory properties                       
    institute       : string                        ,
    type            : LessonType                    ,
    level           : CEF                           ,
    hPath           : string[]                      ,
    vPath           : string[]                      ,
    uPath           : {                              
        context     : string                        ,
        media       : string                        ,
        avatar      : string                        ,
    }                                               ,
    status          : LessonStatus                  ,
}

export interface _junk { 
    [key: string ]  : () => Promise<junk> 
}


export interface Chromosome {
    // .. mandatory properties                       
    institute       : string                        ,
    id              : number                        ,
    type            : LessonType                    ,
    level?          : CEF                           ,
    title           : string                        ,
    hPath           : string[]                      ,
    vPath           : string[]                      ,
    uPath           : {                              
        context     : string                        ,
        media       : string                        ,
        avatar      : string                        ,
    }                                               ,
    wPath           : {                              
        mediaURL?   : string                        ,
        avatarURL?  : string                        ,
    }                                               ,
    status          : LessonStatus                  ,
    // .. common properties                          
    icon?           : string                        ,
    isYouTube?      : boolean                       ,
    pinnedPoint?    : number                        ,
    snapMargin?     : { a:number, b: number }       ,
    etikett?        : { [key: string]: number[] }   ,
    forceRender?    : boolean                       ,
                                                     
}


type LessonType = 'audio' | 'video';
type LessonStatus = 'reading' | 'read';
type CEF = "A1"|"A2"|"B1"|"B2"|"C1"|"C2";
