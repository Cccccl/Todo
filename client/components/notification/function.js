import Vue from 'vue'
import Component from './func-notification.js'

const NotificationConstructor = Vue.extend(Component)

const instances = []
let seed = 1

const removeInstance = (instance) => {
  if (!instance) return
  const len = instances.length
  const index = instances.findIndex(inst => instance.id === inst.id)

  instances.splice(index, 1)

  if (len <= 1) return
  const removeHeight = instance.height
  for (let i = index; i < len - 1; i++) {
    instances[i].verticalOffset = parseInt(instances[i].verticalOffset) - removeHeight - 16
  }
}

// 通过方法调用
const notify = (options) => {
  if (Vue.prototype.$isServer) return

  const { autoClose, ...rest } = options
  const instance = new NotificationConstructor({
    propsData: {
      ...rest
    },
    data: {
      autoClose: autoClose === undefined ? 3000 : autoClose
    }
  })
  // console.log(instance)
  const id = `notification_${seed++}`
  instance.id = id
  // instance.vm = instance.$mount() // 生成dom节点但是没有插入
  instance.visiable = true
  instance.$mount()
  document.body.appendChild(instance.$el)

  let verticalOffset = 0
  instances.forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16
  })
  // console.log(instance)
  // console.log(instance.vm)
  // console.log(instance === instance.$mount())
  // console.log(instance === instance.vm)
  // verticalOffset += 16
  instance.verticalOffset = verticalOffset
  instances.push(instance)
  instance.$on('closed', () => {
    removeInstance(instance)
    document.body.removeChild(instance.$el)
    instance.$destroy()
  })
  instance.$on('close', () => {
    instance.visiable = false
  })
  return instance
}

export default notify
