import * as u                           from "./user";

export interface Ribosome {
    institute       : string                        ,
    code            : string                        ,
    type            : LessonType                    ,
    level           : CEF                           ,
    title           : string                        ,
    avatar          : string                        ,
    source          : string                        ,
    contains        : number|"∞"                    ,
    readMode        : "start"|"random"|"end"        ,
}

export interface gene {
    id?             : string;
    title           : string;
    text            : string;
    avatarURL       : string;
    mediaURL        : string;
    hPath?          : string[];
}

export interface _new_gene { 
    [key: string ]  : ( ribosomeCode: string, user: u.user ) => Promise<gene> 
}

export interface junk {
    // .. mandatory properties                       
    institute       : string                        ,
    type            : LessonType                    ,
    level           : CEF                           ,
    vPath           : string[]                      ,
    uPath           : {                              
        media       : string                        ,
        avatar      : string                        ,
    }                                               ,
    status          : LessonStatus                  ,
    etikett         : { [key: string]: number[] }   ,
}

export interface _junk { 
    [key: string ]  : () => Promise<junk> 
}

export interface Chromosome {
    // .. mandatory properties                       
    institute       : string                        ,
    type            : LessonType                    ,
    code            : {                              
        ribosome    : string                        ,
        idx         : string                        ,
    }                                               ,
    level?          : CEF                           ,
    title           : string                        ,
    hPath           : string[]                      ,
    vPath           : string[]                      ,
    uPath           : {                              
        media       : string                        ,
        avatar      : string                        ,
    }                                               ,
    wPath           : {                              
        mediaURL?   : string                        ,
        avatarURL?  : string                        ,
    }                                               ,
    status          : LessonStatus                  ,
    etikett         : { [key: string]: number[] }   ,
    // .. common properties                          
    icon?           : string                        ,
    isYouTube?      : boolean                       ,
    pinnedPoint?    : number                        ,
    forceRender?    : boolean                       ,
                                                     
}

export interface cell { 
    "chromosome"    : Chromosome                    ,
    "rawText"       : string                        ,
    "rawSnap"       : rawSnap                       ,
}

export interface rawSnap { [key: string]: string }

type LessonType = 'audio' | 'video' | 'slide' | 'comic';
type LessonStatus = 'reading' | 'read';
type CEF = "A1"|"A2"|"B1"|"B2"|"C1"|"C2";
// TODO diff enum vs type