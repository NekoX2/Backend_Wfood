const  request = require('request')
const fs = require('fs')

exports.notifyEvent = (msg) => {
    request({
        url: 'https://notify-api.line.me/api/notify',
        method: 'POST',
        auth:{
            bearer:'tmAdul8e26zJpm1zhBpCKnfQBtQrT2k9zM4CtbVjJOo'
        },
        form:{
            message: msg
        }
    })
}

exports.notifyEvening = (msg ,filename) => {
    var filedata = `public/uploads/${filename}`
    request({
        url: 'https://notify-api.line.me/api/notify',
        method: 'POST',
        auth:{
            bearer:'tmAdul8e26zJpm1zhBpCKnfQBtQrT2k9zM4CtbVjJOo'
        },
        formData:{
            message: msg,
            imageFile: fs.createReadStream(filedata)
        }
    })
}