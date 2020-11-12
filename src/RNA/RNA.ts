import * as x1382                       from "./RNAx1382";
import * as x1309                       from "./RNAx1309";
import * as x1127                       from "./RNAx1127";
import * as x834                        from "./RNAx834";
import * as g                           from '../types/genetics'
import * as u                           from "../types/user";

// -- =====================================================================================
interface aRNA { 
   gene: ( ribosomeCode: string, user: u.user ) => Promise<g.gene>
   junk: ( ribosomeCode: string ) => Promise<g.junk>
   snap: ( ribosomeCode: string ) => Promise<g.rawSnap>
} 

export const RNA: { [key: string]: aRNA} = { 
   x1382,
   x1309,
   x1127,
   x834
}