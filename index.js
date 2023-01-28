import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import conectarDB from './config/db.js'
import pacienteRoutes from './routes/pacienteRoutes.js'
import veterinarioRoutes from './routes/veterinarioRoutes.js'

dotenv.config()

const app = express()

app.use(express.json())

app.use(express.static('public'))

conectarDB()

const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || dominiosPermitidos.indexOf(origin) !== -1) {
            // El origen del Request está permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido el acceso por CORS'))
        }
    }
}

app.use(cors(corsOptions))

app.use('/api/veterinarios', veterinarioRoutes)
app.use('/api/pacientes', pacienteRoutes)

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})