// 为了让 method 只能传入合法的字符串，我们定义一种字符串字面量类型 Method
export type Method = 'get' | 'GET'
  | 'delete' | 'Delete'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'

// AxiosRequestConfig 接口类型
/**
 * url 为请求的地址，必选属性；而其余属性都是可选属性
 * method 是请求的 HTTP 方法
 * data 是 post、patch 等类型请求的数据，放到 request body 中的
 * 
 */ 
export interface AxiosRequestConfig {
  url: string,
  method?: Method,
  data?: any,
  params?: any,
  headers?: any,
  responseType?: XMLHttpRequestResponseType,
  timeout?: number // 请求的超时时间
}


/***
 * 拿到 res 对象
 * 服务端返回的数据 data
 * HTTP 状态码status
 * 状态消息 statusText
 * 响应头 headers
 * 请求配置对象 config 
 * 请求的 XMLHttpRequest 对象实例 request
 * 
 */ 
export interface AxiosResponse {
  data: any,
  status: number,
  statusText: any,
  headers: any,
  config: AxiosRequestConfig,
  request: any
}


// axios 函数返回的是一个 Promise 对象，
// 我们可以定义一个 AxiosPromise 接口，它继承于 Promise<AxiosResponse> 这个泛型接口
export interface AxiosPromise extends Promise<AxiosResponse> {

}