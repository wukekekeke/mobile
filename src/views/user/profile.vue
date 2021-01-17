<template>
  <div class="profile">
    <!-- 导航条 -->
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料"></van-nav-bar>

    <!-- 编辑区 -->
    <van-cell-group>
      <van-cell is-link title="头像"  center @click="$refs.refPhoto.click()">
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src='user.photo'
        />
      </van-cell>
      <!-- 点击图标——》触发了<input type="file">,并且隐藏起来 -->
      <input type="file" ref="refPhoto" hidden @change="changePhoto">

      <van-cell is-link title="名称" :value="user.name" @click="clickShowName"/>
      <van-cell is-link title="性别" :value="user.gander===0?'男':'女'" @click="showGender=true"/>
      <van-cell is-link title="生日" :value="user.birthday" @click="showBirthday=true"/>
    </van-cell-group>

    <!-- 修改名字 -->
    <van-dialog v-model="showName" title="修改姓名" show-cancel-button @confirm='saveName'>
      <van-field v-model.trim="newName" placeholder="请输入姓名"></van-field>
    </van-dialog>

    <!-- 修改性别 -->
    <van-popup v-model="showGender" position="bottom">
      <van-nav-bar title="修改性别" left-text="取消" @click-left="showGender=false">
      </van-nav-bar>
      <van-cell title="男" @click="saveGender(0)" is-link></van-cell>
      <van-cell title="女" @click="saveGender(1)" is-link></van-cell>
    </van-popup>

    <!-- 修改日期 -->
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        v-model="newDate"
        type="date"
        title="选择生日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel='showBirthday=false'
        @confirm='saveBirthday'
      />
    </van-popup>
  </div>
</template>

<script>
import { reqProfile, reqUpdateUserInfo, reqUpdatePhoto } from '@/api/user.js'
import dayjs from 'dayjs'
export default {
  name: 'userProfile',
  data () {
    return {
      // 控制弹层
      showName: false,
      showGender: false,
      showBirthday: false,
      // 当前用户的信息
      user: {},
      newName: '', // 和输入框绑定的昵称变量
      minDate: new Date(1900, 0, 1), // 可选的最小时间
      maxDate: new Date(), // 可选的最大时间
      newDate: new Date() // 修改后的新生日
    }
  },
  created () {
    this.loadProfile()
  },
  methods: {
    async loadProfile () {
      const res = await reqProfile()
      this.user = res.data.data
    },
    clickShowName () {
      this.showName = true // 显示输入框
      this.newName = this.user.name // 回显数据
    },
    // 修改名字
    async saveName () {
      try {
        if (!this.newName) return
        if (this.newName.length > 6) {
          this.$toast.fail('昵称的长度不能超过6位哦')
          return
        }
        // 注意：接口中的参数是一个obj
        await reqUpdateUserInfo({
          name: this.newName
        })
        // 更新视图
        this.user.name = this.newName
        this.newName = ''
        this.$toast.success('修改昵称成功')
      } catch {
        this.$$toast.fail('修改昵称失败')
      }
    },
    // 修改性别
    async saveGender (gender) {
      try {
        await reqUpdateUserInfo({
          gender
        })
        this.user.gender = gender
        this.showGender = false
        this.$toast.success('修改性别成功')
      } catch {
        this.$toast.fail('修改性别失败')
      }
    },
    // 修改日期
    async saveBirthday () {
      try {
        // 注意：需要把日期格式——》后台需要的格式
        const newBirthday = dayjs(this.newDate).format('YYYY-MM-DD')
        await reqUpdateUserInfo({
          birthday: newBirthday
        })
        // 更新视图
        this.user.birthday = newBirthday
        this.showBirthday = false
        this.$toast.success('修改生日成功')
      } catch {
        this.$toast.fail('修改生日失败')
      }
    },
    // 修改日期
    async changePhoto (e) {
      try {
        // console.dir(e.target)
        // 拿到文档
        const file = e.target.files[0]
        // 文件校验
        // 可以校验类型，可以校验大小
        const arr = ['image/jpeg', 'image/gif', 'image/png']
        if (!arr.includes(file.type)) {
          this.$toast.fail('选择的格式不符合要求')
        }
        // 1. 创建一个formData实例
        // formData既可以提交简单数据格式，也可以提交文件对象
        const fm = new FormData()
        fm.append('photo', file)

        this.$toast.loading({
          message: '文件上传中...',
          forbidClick: true, // 禁止背景点击
          duration: 0 // 不自动关闭
        })

        const res = await reqUpdatePhoto(fm)

        this.user.photo = res.data.data.photo
        this.$toast.success('图片上传成功')
      } catch {
        this.$toast.fail('图片上传失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep{
  .van-nav-bar__text{
    color: white;
  }
}
</style>
