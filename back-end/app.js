//# Variaveis //

import express from 'express'
import port from './port.js'
const app = express()

import produtos from './routes/produtos.js'
import vendas from './routes/vendas.js'
import dashboard from './routes/dashboard.js'

//# Middlewares //
app.use(express.json())
app.use('/produtos', produtos)
app.use('/vendas', vendas)
app.use('/dashboard', dashboard)

//# Servidor //

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})

/*--------------*/