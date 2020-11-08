import * as express from 'express'
const PORT = process.env.PORT || 5000;

const app = express()

app.get('/', (req: express.Request, res: express.Response) => {
  res.json( { result: "ok?"} )
})

app.listen( PORT, () => console.log( `Listening on ${ PORT }` ) ); 