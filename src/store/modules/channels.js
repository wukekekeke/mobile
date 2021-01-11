import { reqGetChannels, reqGetAllChannels } from '@/api/channel.js'

const state = {
  // vuex中提供我的频道数据
  channels: [], // 我的频道
  allChannels: [] // 所有频道
}

const mutations = {
  setChannels (state, newChannels) {
    state.channels = newChannels
  },
  setAllChannels (state, newAllChannels) {
    state.allChannels = newAllChannels
  },
  addChannels (state, addChannel) {
    state.channels.push(addChannel)
  },
  delChannels (state, delChannel) {
    state.channels = state.channels.filter(item => item.id !== delChannel.id)
  }
}

// 异步操作 需要通过提交mutations
// 固定参数context——》this.store
const actions = {
  async setChannelsAsync (context) {
    // 1. 发送请求, 获取数据
    const res = await reqGetChannels()
    // 2. 基于拿到的数据, 提交mutation, 存到仓库中
    context.commit('setChannels', res.data.data.channels)
  },

  async setAllChannelsAsync (context) {
    const res = await reqGetAllChannels()
    context.commit('setAllChannels', res.data.data.channels)
  }
}

// 计算属性：函数形式 并且需要有返回值
const getters = {
  // 对 allChannels 中的元素进行过滤, 只保留那些没有在 channels 中出现的元素
  optionalChannels: (state) => {
    const res = state.allChannels.filter(channel => {
      // findIndex如果找到了, index不是 -1, 如果找不到才是 -1 (要留下)
      const index = state.channels.findIndex(item => item.id === channel.id)
      return index === -1 // 相当于返回true
    })
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
