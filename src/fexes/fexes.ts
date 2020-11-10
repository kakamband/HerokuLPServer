import * as x1382                       from "./x1382";
import * as g                           from '../types/genetics'
import * as u                           from "../types/user";

// -- =====================================================================================
interface aFex { 
   gene: ( ribosomeCode: string, user: u.user ) => Promise<g.gene>
   junk: ( ribosomeCode: string ) => Promise<g.junk>
   snap: ( ribosomeCode: string ) => Promise<g.rawSnap>
} 

export const fexes: { [key: string]: aFex } = { x1382 }