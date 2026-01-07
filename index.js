const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require ('dotenv').config()

const PORT = process.env.PORT || 5000

const app = express()

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 *1000, // 10 Mins
    max:10
})
app.use(limiter)
app.set('trust proxy', 1)

// Set static folder
app.use(express.static('public'))

// Enable cors
app.use(cors())

// Routes
app.use('/api', require('./routes'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
