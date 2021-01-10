// 处理时间格式
// dayjs 体积更小，只有核心功能（格式化日期），替他功能需要再按需导包
// 语法和moment一样
import dayjs from 'dayjs'
// 改变当前语言配置
import 'dayjs/locale/zh-cn'

// 相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// 全局使用简体中文
dayjs.locale('zh-cn')

// 格式化日期(核心功能)
export const formateTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 相对时间
export const getRelativeTime = (t) => {
  return dayjs(t).fromNow()
}
