
import 'babel-polyfill'


import sum from './sum.js'
var minus = require('./minus.js')

console.log(sum(1,2))
console.log(minus(2,1))


let arr = [1,2,3]
let arrB = arr.map(item=>item * 2)

console.log('set',new Set(arrB))
console.log('includes',arr.includes(8))
