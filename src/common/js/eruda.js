const eruda = require('eruda/eruda.js')
if (NODE_ENV === 'dev' && location.hostname === 'localhost' === -1) {
  eruda.init()
  console.log("eruda is running")
}