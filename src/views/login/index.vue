<template>
  <div id="login">
    <!-- 标题 -->
    <van-nav-bar
    title="标题"
    />

    <!-- 输入框 -->
    <van-cell-group>
    <van-field
      required
      v-model="mobile"
      label="手机号"
      placeholder="请输入手机号"
      :error-message='mobileErr'
      @input='inp'/>
    <van-field
      v-model="code"
      center
      clearable
      required
      label="短信验证码"
      placeholder="请输入短信验证码"
      :error-message='codeErr'
      @input='inp'>
    <template #button>
      <van-button size="small" type="info">发送验证码</van-button>
    </template>
    </van-field>
    <!-- <van-field
      required
      v-model="code"
      label="验证码"
      placeholder="请输入验证码"
      :error-message='codeErr'/> -->
    </van-cell-group>

    <!-- 按钮 -->
    <div class="btnWrap">
      <van-button type="info" id="loginBtn" @click="login">登录</van-button>
    </div>
  </div>
</template>

<script>
// 引入封装好的api:登录请求
import { reqLogin } from '@/api/user.js'
// 导入辅助函数
import { mapMutations } from 'vuex'
export default {
  name: 'login', // 取名字后，方便在浏览器调试时，搜索组件
  data () {
    return {
      mobile: '13764318902',
      code: '246810',
      mobileErr: '',
      codeErr: ''
    }
  },
  methods: {
    // 导入user仓库模块中的方法
    ...mapMutations('user', ['setTokenInfo']),
    // 校验函数返回 true 表示校验通过，false 表示不通过
    validate () {
      if (this.mobile.trim() === '') {
        this.mobileErr = '手机号不能为空'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.mobileErr = '请输入11位手机号'
        return false
      }
      // 通过校验后，清空校验规则
      this.mobileErr = ''
      if (this.code.trim() === '') {
        this.codeErr = '请输入验证码'
        return false
      }
      this.codeErr = ''
      // 全部通过后，校验通过
      return true
    },
    async login () {
    // 在发请求之前，开启loading状态
      if (!this.validate()) { // false 校验没有通过
        return
      }
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        overlay: true // 整体添加一个遮罩
      })
      // 发请求
      // post.('地址',数据)
      // const res = await this.$http.post('/v1_0/authorizations', {
      //   mobile: this.mobile,
      //   code: this.code

      // })
      // 通过使用封装好的api
      const res = await reqLogin(this.mobile, this.code)
      console.log(res.data)
      // 保存token有关信息（token和refresh token）
      this.setTokenInfo(res.data.data)
      // 拿到结果后，关闭提示
      // this.$toast.clear()
      // 一个页面上只能有一个toast, 它会把上面的Loading状态覆盖掉
      this.$toast.success('登录成功')
      // 最后跳转
      // this.$router.push('/')
      // 更新跳转目标
      this.$router.push(this.$route.query.backto || '/')
    },
    inp () {
      this.validate() // 在输入时调用验证
    }
  }
}
</script>

<style lang='scss' scoped>
.btnWrap{
  padding: 20px;
  #loginBtn{
    width: 100%;
    color: #fff;
    border-radius: 5px;
  }
}
</style>
