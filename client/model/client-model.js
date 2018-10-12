import axios from 'axios'
import { createError } from '../common/util/error.js'

/* 服务端渲染获取数据，可以自己给自己发请求，但是不能拿到cookie
 * 服务端没有同域的概念，所以不会在地址前面添加ip地址
 * 需要判断当前为客户端渲染还是服务端渲染，如果为服务端渲染要添加baseUrl的地址为127.0.0.1:3333
 * process.env.VUE_ENV === 'server' ? 'http://127.0.0.1:3333' : '/'
 */
const request = axios.create({
  baseURL: '/'
})

const handleRequest = (req) => {
  return new Promise((resolve, reject) => {
    req.then(resp => {
      const data = resp.data
      if (!data) {
        return reject(createError(400, 'no data'))
      }
      if (!data.success) {
        return reject(createError(400, data.message))
      }
      resolve(data.data)
    }).catch(err => {
      const resp = err.response
      console.log('----------------', resp)
      if (resp.status === 401) {
        reject(createError(401, 'need auth!!!%%%'))
        return
      }
      reject(err)
    })
  })
}

export default {
  getAllTodos () {
    return handleRequest(request.get('/api/todos'))
  },
  updateTodo (id, todo) {
    return handleRequest(request.put(`/api/todo/${id}`, todo))
  },
  createTodo (todo) {
    return handleRequest(request.post('/api/todo', todo))
  },
  deleteTodo (id) {
    return handleRequest(request.delete(`/api/todo/${id}`))
  },
  deleteAllCompleted (ids) {
    return handleRequest(request.post('/api/delete/completed', { ids: ids }))
  },
  login (username, password) {
    return handleRequest(request.post('/user/login', { username, password }))
  }
}
