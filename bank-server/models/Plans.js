const mongoose = require('mongoose')

const PlanSchema = mongoose.Schema({
    minMonths: {
        type: Number,
        required: true
    },
    maxMonths: {
        type: Number,
        required: true
    },
    minAmount: {
        type: Number,
        required: true
    },
    maxAmount: {
        type: Number,
        required: true
    },
    interest: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Plans', PlanSchema)