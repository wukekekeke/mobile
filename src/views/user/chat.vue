<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list" ref='refList'>
      <div class="chat-item"
      v-for="(item,index) in list"
      :key="index"
      :class="item.name==='xz'?'left':'right'">
          <!-- 左侧是机器人小智 -->
        <template v-if='item.name==="xz"'>
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{item.msg}}</div>
        </template>

        <!-- 右侧是当前用户 -->
        <template v-else>
          <div class="chat-pao">{{item.msg}}</div>
          <van-image  fit="cover" round :src="user.photo" />
        </template>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <span  @click="send" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import { reqProfile } from '@/api/user.js'
import io from 'socket.io-client'
export default {
  name: 'UserChat',
  data () {
    return {
      word: '',
      user: {},
      socket: null,
      list: [ // 对话记录
        // { name: 'xz', msg: '你好，我是无所不知的小智同学！', timestamp: Date.now() },
        // { name: 'me', msg: '小智同学, 请问今天下雨吗？', timestamp: Date.now() },
        // { name: 'me', msg: '快帮我查查', timestamp: Date.now() },
        // { name: 'xz', msg: '今天不下雨', timestamp: Date.now() }
      ]
    }
  },
  created () {
    this.loadUserProfile()
    this.initSocket() // 连接websocket
  },
  // 路由跳转后，对应的组件会被销毁，需要关闭连接
  destroyed () {
    this.socket.close()
  },
  methods: {
    // 初始化websocket
    initSocket () {
      // 建立连接
      this.socket = io('http://localhost:8888')
      // 监听连接状态
      this.socket.on('connect', () => {
        this.$toast.success('连接成功，开始聊天吧')
      })
      // 监听消息
      // socket.on('自定义消息名', function(msg){}）
      this.socket.on('message', ({ msg, timestamp }) => {
        this.list.push({
          name: 'xz',
          msg,
          timestamp
        })
        this.$nextTick(() => {
          this.$refs.refList.scrollTop = this.$refs.refList.scrollHeight
        })
      })
    },
    send () {
      // console.log(this.word)
      if (!this.word) return
      // 点击按钮时，发消息
      // 发消息：socket.emit('自定义消息名', '内容');
      // 自定义消息名：收消息和发消息的名字需要一样
      // 内容:需要按照接口的要求
      this.socket.emit('message', {
        msg: this.word,
        timestamp: Date.now()
      })
      // 添加聊天内容
      this.list.push({
        name: 'me',
        msg: this.word,
        timestamp: Date.now()
      })
      this.word = ''
      // 滚动条随着对话，能自己滚到底部
      // 注意:vue是异步dom更新的, push完, 视图还没更新
      this.$nextTick(() => {
        this.$refs.refList.scrollTop = this.$refs.refList.scrollHeight
      })
    },
    async loadUserProfile () {
      const res = await reqProfile()
      this.user = res.data.data
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
