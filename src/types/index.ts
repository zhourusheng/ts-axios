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
  params?: any 
}