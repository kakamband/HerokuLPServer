import * as x1127                       from "./RNAx1127";
import * as x834                        from "./RNAx834";
import * as commonRNA                   from "./common";
import * as g                           from "../types/genetics"
import * as u                           from "../types/user";

// -- =====================================================================================
interface aRNA { 
   gene: ( user: u.user, ribosome?: g.Ribosome ) => Promise<g.gene>
   junk: ( ribosome: g.Ribosome ) => Promise<g.junk>
} 

export const RNA: { [key: string]: aRNA } = { 
   x1127,
   x834,
   commonRNA
}