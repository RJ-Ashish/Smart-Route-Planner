const express = require('express')
const router = express.Router()
const controller = require('../controllers/routeController')

router.post('/', controller.handleRoute)

module.exports = router
