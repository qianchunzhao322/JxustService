<template>
  <div class="main">
    <!-- <div class="info">注意：  为保证系统安全，当检测到刷新或不正当出入系统等操作将清除数据，返回至重新登陆</div> -->

<el-dialog
  title="系统提示"
  :visible.sync="dialogVisible"
  width="30%">
  <span>注意：  为保证系统安全，当检测到刷新或不正当出入系统等对系统存在风险隐患的操作将清除本地数据，返回至重新登陆</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="login">我已知晓</el-button>
  </span>
</el-dialog>
    <div class="third">
      <div class="second">
        <div class="frist">
          <div class="title">信息学院管理端</div>
          <div class="inputs">
            <el-input placeholder="用户名"
                      prefix-icon="el-icon-user"
                      v-model="username">
            </el-input>
          </div>
          <div class="inputs">
            <el-input show-password
                      placeholder="密码"
                      prefix-icon="el-icon-lock"
                      v-model="password">
            </el-input>
          </div>
          <div class="inputs"
               style="display:flex">
            <el-input placeholder="验证码"
            style="width:40%; float: left;"
                      v-model="code">
            </el-input>
            <div class="img" style="width:35%;height:100%; margin-left: 0.14rem; float: left; background-color: #FAFAF8" >
              <img :src="codeImg" style="width:100%;height:100%;" alt="">
            </div>
            <button style="width:10%;height:100%; margin-left: 0rem; float: left; border-style: none; line-height: 1.7; font-size: 0.09rem;">
              <i class="el-icon-refresh" @click="init"></i>
            </button>
          </div>
          <div class="inputs"
               style="width:60%">
            <el-button type="primary"
                       @click="dialogVisible = true"
                       round>LOGIN</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      dialogVisible: false,
      codeImg: '',
      username: '',
      password: '',
      code: ''
    }
  },
  created () {
    this.init()
    localStorage.removeItem('btapex')
  },
  methods: {
    init () {
      this.$axios.get('/juxtserver/captcha', {
        responseType: 'arraybuffer'
      })
        .then(response => {
          return 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data,
            byte) => data + String.fromCharCode(byte), ''))
        }).then(res => {
          this.codeImg = res
        })
    },
    login () {
      this.dialogVisible = false
      this.$axios.defaults.headers.post['Content-Type'] = 'application/json'
      var formData = {
        username: this.username,
        password: this.password,
        kaptcha: this.code
      }
      this.$axios({
        url: '/juxtserver/login',
        method: 'post',
        data: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200 && res.data.msg === '登录成功') {
          this.$message.success('登录成功')
          this.initWebSocket()
          localStorage.setItem('btapex', res.data.data.token)
          // this.$cookies.set('token', res.data.data.token, 60)
          this.$router.push({
            name: 'index',
            params: {
              isRoot: res.data.data.isRoot
            }
          })
        } else {
          this.$message.error('登录失败--' + res.data.msg)
        }
      }).catch(res => {
        console.log(res)
      })
    },
    initWebSocket () {
      var that = this
      if ('WebSocket' in window) {
        var socketUrl = 'ws://10.21.213.47:8081/api/pushMessage/' + this.username + '_' + new Date().getTime()
        that.ws = new WebSocket(socketUrl)
        that.webSocket.setWs(that.ws)

        // 打开事件
        that.ws.onopen = function () {
          console.log('websocket已打开')
        }
        // 获得消息事件
        that.ws.onmessage = function (msg) {
          console.log(msg)
          // 发现消息进入,开始处理前端触发逻辑
          if (msg.data === '420') {
            that.$router.push('/login')
            that.$message({ type: 'warning', message: '数据发生异常，异地登录，您已被迫下线' })
          }
        }
        // 关闭事件
        that.ws.onclose = function () {
          console.log('websocket已关闭')
        }
        // 发生了错误事件
        that.ws.onerror = function () {
          console.log('websocket发生了错误')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  // background-color: #fff;
  background: url("../assets/img/loginIMG.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .info{
    position: absolute;
    top: 5%;
    right: 5%;
    height: 8%;
    width: 14%;
    // background-color: rgba(255, 255, 255, 0.5);
    font-size: 0.1rem;
    font-weight: 700;
    color: rgb(241, 84, 67);
  }
  .third {
    height: 59.5%;
    width: 30%;
    background-color: rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    .second {
      height: 85%;
      width: 85%;
      background-color: rgba(255, 255, 255, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      .frist {
        height: 85%;
        width: 85%;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 50%;
        .title {
          height: 14%;
          width: 100%;
          font-size: 0.22rem;
        }
        .inputs {
          height: 13%;
          width: 80%;
          margin-left: 0%;
          margin-top: 3%;
          /deep/.el-button {
            width: 100%;
            font-size: 0.16rem;
          }
        }
      }
    }
  }
}
</style>
