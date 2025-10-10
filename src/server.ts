import express from 'express'
const app = express()

app.get('/health', (req, res) => {
  //   res.json({ message: 'hello', fuck: 'you' }).status(200)
  res.send('<h1>HELLO</h>')
})

export { app }
export default app
