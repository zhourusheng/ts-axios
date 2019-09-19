import { isPlainObject } from './util'

function normalizeHeaderName (headers: any, normalizeName: string): void {
  if(!headers) {
    return
  }

  Object.keys(headers).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

// 每一行都是以回车符和换行符 \r\n 结束，它们是每个 header 属性的分隔符
// 对于上面这串字符串，我们希望最终解析成一个对象结构
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  // 以换行符切割成数组, foreach遍历处理
  headers.split('\r\n').forEach(line =>{
    // 解构数组, 以: 冒号分割 key 和 val
    let [key, val] = line.split(':')

    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    // String.trim() 去空格
    if(val) {
      val = val.trim()
    }
    // 将key val塞入对象中
    parsed[key] = val
  })

  return parsed
}


export function processHeaders (headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}