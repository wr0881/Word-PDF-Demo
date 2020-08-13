const baseUrl = 'http://192.168.1.168:8082'
const config = {
  locale: 'zh-CN', // en-US, zh-CN
  url: baseUrl,
  debug: {
    http: false // http request log
  },
  api: `${baseUrl}/`,
}

export default config
