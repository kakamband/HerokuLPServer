import * as express from 'express'

const app = express()

app.get('/', (req: express.Request, res: express.Response) => {
  res.json( { result: "ok"} )
})

app.listen(5000, () => {
  console.log('server started on port 5000')
})