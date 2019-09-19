import {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse
} from './types'
import { resolve } from 'url'

/***
 * 实现获取响应数据逻辑
 * 1.首先我们要在 xhr 函数添加 onreadystatechange 事件处理函数，并且让 xhr 函数返回的是 AxiosPromise 类型
 * */ 

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)

    /***
     * onreadystatechange 来判断readystate 是否为4
     * 0	UNSENT	代理被创建，但尚未调用 open() 方法。
     * 1	OPENED	open() 方法已经被调用。
     * 2	HEADERS_RECEIVED	send() 方法已经被调用，并且头部和状态已经可获得。
     * 3	LOADING	下载中； responseText 属性已经包含部分数据。
     * 4	DONE	下载操作已完成。
     * */
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }

      const responseHeaders = request.getAllResponseHeaders()

      const responseData = responseType && responseType !== 'text' ? request.response : request.responseText

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }

    // 传入的 data 为空的时候，请求 header 配置 Content-Type 是没有意义的，于是我们把它删除。
    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}