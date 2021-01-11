<template>
  <div class="channel-edit">
    <!-- 当前登陆用户已经订阅的频道 -->
    <div class="channel">
      <van-cell title="我的频道" :border="false">
        <!-- 点击时, 切换状态, 控制文字的显示 -->
        <van-button plain size="mini" type="danger" @click='editing=!editing'>
          {{editing?'取消':'编辑'}}
        </van-button>
      </van-cell>
      <van-grid>
        <van-grid-item v-for="(item,index) in channels" :key="item.id" @click="clickMychannel(index)">
          <span :class='{current:index===active}'>{{item.name}}</span>
           <!-- 在编辑状态时，删除按钮显示 -->
           <!-- 注意：如果是推荐, 不需要显示删除按钮 -->
           <!-- .stop 阻止事件冒泡 -->
          <van-icon name="cross" class="btn" @click.stop="delChannel(item)" v-show="editing&&index!==0"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
     <!-- 当前登陆用户没有订阅的频道 -->
    <div class="channel">
      <van-cell title="可选频道" :border="false"></van-cell>
      <van-grid>
        <van-grid-item v-for="item in optionalChannels" :key="item.id" @click="clickAddChannel(item)">
        <span >{{item.name}}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { reqSetChannels } from '@/api/channel.js'
export default {
  name: 'ChannelEdit',
  data () {
    return {
      editing: false // 是否处于编辑状态
    }
  },
  computed: {
    ...mapState('channels', ['channels']),
    ...mapGetters('channels', ['optionalChannels'])
  },
  created () {
    this.setChannelsAsync()
  },
  methods: {
    ...mapActions('channels', ['setChannelsAsync']),
    ...mapMutations('channels', ['addChannels', 'delChannels']),

    // 点击频道，同步跳转到相应频道
    clickMychannel (index) {
      this.$emit('update-curchannel', index)
    },

    // 添加频道
    async clickAddChannel (addchannel) {
      // 1. 将选择 channel 数据往我的频道 channel 中添加 ( 通过提交mutation，操作vuex中的数据)
      this.addChannels(addchannel)

      this.resetChannel()
    },
    // 删除频道
    delChannel (delChannel) {
      // 1. 操作vuex中的数据，从我的频道中删除
      this.delChannels(delChannel)

      this.resetChannel()
    },

    // 封装重置式请求
    async resetChannel () {
      // 组装接口需要的数据
      // 已有的数据格式  [{ id: 0, name: '推荐'}, { id: 2, name: '开发者资讯'}, ... ]
      // 需要的数据格式 [{ id: 0,  seq: 0 },  { id: 2, seq: 1 }]   seq 就是频道下标
      // map:映射，遍历数组，将函数的返回值进行收集，放到一个新数组中
      const channelList = this.channels.map((item, index) => {
        return {
          id: item.id,
          seq: index
        }
      })
      // 去掉推荐频道, 由于推荐频道是在第一个位置，所以这里直接删除第一个
      channelList.shift()
      // 向后台发重置式请求
      await reqSetChannels(channelList)
    }
  },
  props: {
    active: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.channel{
  padding:15px;
  font-size:14px;
  ::v-deep {
    .van-button--mini {
    height: 22px;
    min-width: 50px;
    }
  }
  .btn {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 14px;
  }
  .current {
  color: #e5615b;
  font-weight: bold;
  }
}
</style>
