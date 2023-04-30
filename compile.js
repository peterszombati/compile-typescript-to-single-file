const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.join(__dirname, 'build.js'))
const before = Buffer.from(`const ___defined = {}
let ___exports = null
`)
const after = Buffer.from(`
function ___require(name) {
    if (!___defined[name]) {
        ___defined[name] = require(name)
    }
    return ___defined[name]
}
function define(target, functions, callback) {
    ___defined[target] = {}
    ___exports = ___defined[target]
    callback(___require, ___defined[target], ...functions.slice(2).map(i => {
        if (!___defined[i]) {
            ___defined[i] = require(i)
        }
        return ___defined[i]
    }))
}
module.exports = ___exports === null ? exports : ___exports`)
fs.writeFileSync(path.join(__dirname, 'build.js'), Buffer.concat([before, data, after]))