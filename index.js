import 'dotenv/config.js'
import express from 'express'

const app = express()

// 3000: Porta que será usada para acessar o projeto
app.listen(3000, () => console.log('listening on port 3000'))

