const url = require('url')
const express = require('express')
const router = express.Router()
const needle = require('needle')
const apicache = require('apicache')

// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

// Initialize cache
let cache = apicache.middleware

router.get('/', cache('2 minutes'), async (req, res) => {
    try {
        const params = new URLSearchParams({
            [API_KEY_NAME] : API_KEY_VALUE,
            ...url.parse(req.url, true).query,
        })
        const apiRes = await needle('get', `${API_BASE_URL}?${params}`)
        const data = apiRes.body

        res.status(200).json({
            city: data.city?.name,
            country: data.city?.country,
            timezone: data.city?.timezone,
            forecast: data.list
        })
    }   catch (error) {
        res.status(500).json({error: 'Failed to fetch weather data'})
    }    
})

module .exports =router