import Storage from 'good-storage'

let actions = {
  get: 'get',
  set: 'set',
  remove: 'remove'
}

// 下划线命名转驼峰
const formatKey = function (key) {
  const arr = key.split('_')
  const newArr = []
  arr.forEach(s => newArr.push(`${s.slice(0, 1).toUpperCase()}${s.slice(1)}`))
  return newArr.join('')
}

// 生成get set remove函数
const cookieOperation = function (action, key) {
  if (action === 'get') {
    return (...args) => {
      return Storage.get(key, ...args) // key, value
    }
  }
  if (action === 'set') {
    return (...args) => {
      return Storage.set(key, ...args) // key, value
    }
  }
  if (action === 'remove') {
    return () => {
      return Storage.remove(key) // key
    }
  }
}

// 需要存放
const keys = ['token']

let utils = {}

for (const key of keys) {
  const str = formatKey(key)
  for (const action in actions) {
    utils[`${actions[action]}${str}`] = cookieOperation(actions[action], key)
  }
}

console.log(utils)
// utils = {
//   getToken: () => {},
//   setToken: () => {},
//   removeToken: () => {}
// }

export default utils
