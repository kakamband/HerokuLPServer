const de = require( "../db/ribosome/de.json" );
const it = require( "../db/ribosome/it.json" );
const en = require( "../db/ribosome/en.json" );

export const ribosomesCollection = [ ...de, ...it, ...en ];