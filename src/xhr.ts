import {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse
} from './types'

import { parseHeaders } from './helpers/header'
import { rejects } from 'assert'

/***
 * 实现获取响应数据逻辑
 * 1.首先我们要在 xhr 函数添加 onreadystatechange 事件处理函数，并且让 xhr 函数返回的是 AxiosPromise 类型
 * */ 

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    // timeout
    if(timeout) {
      request.timeout = timeout
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

      if (request.status === 0) {
        return
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())

      const responseData = responseType && responseType !== 'text' ? request.response : request.responseText

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    /***
     * 处理非 200 状态码
     * 对于一个正常的请求，往往会返回 200-300 之间的 HTTP 状态码
     * 对于不在这个区间的状态码，我们也把它们认为是一种错误的情况做处理。
     * */ 
    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(new Error(`Request failed with status code ${response.status}`))
      }
    }


    /***
     * 处理网络异常错误
     * 当网络出现异常（比如不通）的时候发送请求会触发 XMLHttpRequest 对象实例的 error 事件
     * 于是我们可以在 onerror 的事件回调函数中捕获此类错误。
     * */ 
    request.onerror = function handleError() {
      reject(new Error('NetWork Error'))
    }

    /***
     * 处理超时错误
     * 我们可以设置某个请求的超时时间 timeout，
     * 当请求发送后超过某个时间后仍然没收到响应，则请求自动终止，并触发 timeout 事件。
     * */ 
    request.ontimeout = function handleTimeout() {
      reject(new Error(`Timeout of ${timeout} ms exceeded`))
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