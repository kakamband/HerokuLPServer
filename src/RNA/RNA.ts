import * as x1382                       from "./RNAx1382";
import * as x1309                       from "./RNAx1309";
import * as x1127                       from "./RNAx1127";
import * as x834                        from "./RNAx834";
import * as x549                        from "./RNAx549";
import * as g                           from '../types/genetics'
import * as u                           from "../types/user";

// -- =====================================================================================
interface aRNA { 
   gene: ( user: u.user, ribosome?: g.Ribosome ) => Promise<g.gene>
   junk: ( ribosome: g.Ribosome ) => Promise<g.junk>
   snap: () => Promise<g.rawSnap>
} 

export const RNA: { [key: string]: aRNA } = { 
   x1382,
   x1309,
   x1127,
   x834,
   x549
}