
<template>
  <div class="main">
    <el-container>
      <el-aside width="1.6rem">
        <div class="logo"></div>
        <el-menu :default-active="defaultUrl"
                 class="el-menu-vertical-demo"
                 @select="handleSelect"
                 background-color="#304156"
                 text-color="#fff"
                 unique-opened
                 router
                 active-text-color="#ffd04b">
          <el-menu-item index="/service/index">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item v-if="isRoot" index="/service/superman">
            <i class="el-icon-s-home"></i>
            <span slot="title">超级管理</span>
          </el-menu-item>
          <el-menu-item index="/service/teacher">
            <i class="el-icon-user"></i>
            <span slot="title">师生管理</span>
          </el-menu-item>
          <el-menu-item index="/service/class">
            <i class="el-icon-s-custom"></i>
            <span slot="title">研究生</span>
          </el-menu-item>
          <el-menu-item index="/service/class">
            <i class="el-icon-bangzhu"></i>
            <span slot="title">班级管理</span>
          </el-menu-item>
          <el-submenu index="">
            <template slot="title">
              <i class="el-icon-picture-outline"></i>
              <span>照片管理</span>
            </template>
            <el-menu-item-group>
              <template slot="title"> <i class="el-icon-s-operation"></i> 参数配置</template>
              <el-menu-item index="/service/campus">校区</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title"> <i class="el-icon-school"></i> 校园忆</template>
              <el-menu-item index="/service/position">打卡点</el-menu-item>
              <el-menu-item index="/service/building">学院楼</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group index="">
              <template slot="title"><i class="el-icon-user"></i>校友忆</template>
              <el-menu-item index="/service/graduation">毕业照</el-menu-item>
              <el-menu-item index="/service/life">生活照</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/service/awards">
            <i class="el-icon-medal-1"></i>
            <span slot="title">竞赛获奖</span>
          </el-menu-item>
          <el-menu-item index="/service/from">
            <i class="el-icon-receiving"></i>
            <span slot="title">本科生源</span>
          </el-menu-item>
          <el-menu-item index="/service/togo">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">毕业去向</span>
          </el-menu-item>
          <el-menu-item index="/service/sex">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">男女比例</span>
          </el-menu-item>
          <el-menu-item index="/service/info">
            <i class="el-icon-s-comment"></i>
            <span slot="title">最新动态</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="same router">{{bread }}</div>
          <div class="same time" v-if="timeVisiable">{{nowTime}}</div>
          <div class="same avatar">
            <div class="img"></div>
            <!-- <div class="name">管理员</div> -->
            <el-popover
  placement="top"
  style="padding-left: 0.1rem"
  width="1rem"
  v-model="visible">
  <p>确定要退出吗？</p>
  <div style="text-align: right; margin: 0">
    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
    <el-button type="primary" size="mini" @click="logout">确定</el-button>
  </div>
  <el-button slot="reference">管理员</el-button>
</el-popover>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'service',
  data () {
    return {
      isRoot: false,
      nowTime: '',
      visible: false,
      defaultUrl: '/service',
      timeVisiable: false,
      bread: '首页'
    }
  },
  created () {
    setInterval(() => {
      this.getTime()
      this.getUrl()
    }, 1000)
  },
  mounted () {
    this.isRoot = this.$route.params.isRoot
  },
  methods: {
    getUrl () {
      this.defaultUrl = this.$route.fullPath
      this.handleSelect(this.defaultUrl)
    },
    handleSelect (key, keyPath) {
      if (key === '/service/index') {
        this.bread = '首页'
        this.timeVisiable = false
      } else if (key === '/service/superman') {
        this.bread = '超级管理'
        this.timeVisiable = true
      } else if (key === '/service/teacher') {
        this.bread = '师生管理'
        this.timeVisiable = true
      } else if (key === '/service/class') {
        this.bread = '班级管理'
        this.timeVisiable = true
      } else if (key === '/service/awards') {
        this.timeVisiable = true
        this.bread = '竞赛获奖'
      } else if (key === '/service/from') {
        this.timeVisiable = true
        this.bread = '本科生源'
      } else if (key === '/service/togo') {
        this.timeVisiable = true
        this.bread = '毕业去向'
      } else if (key === '/service/sex') {
        this.timeVisiable = true
        this.bread = '男女比例'
      } else if (key === '/service/info') {
        this.timeVisiable = true
        this.bread = '最新动态'
      } else if (key === '/service/campus') {
        this.timeVisiable = true
        this.bread = '照片管理 / 配置 / 校区管理'
      } else if (key === '/service/position') {
        this.timeVisiable = true
        this.bread = '照片管理 / 校园忆 / 打卡点'
      } else if (key === '/service/building') {
        this.timeVisiable = true
        this.bread = '照片管理 / 校园忆 / 学院楼'
      } else if (key === '/service/graduation') {
        this.timeVisiable = true
        this.bread = '照片管理 / 校友忆 / 毕业照'
      } else if (key === '/service/life') {
        this.timeVisiable = true
        this.bread = '照片管理 / 校友忆 / 生活照'
      }
    },
    logout () {
      this.visible = false
      this.webSocket.ws.close()
      this.$router.push('/login')
      localStorage.removeItem('btapex')
    },
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    getTime () {
      var today = new Date()
      var year = this.checkTime(today.getFullYear())
      var month = this.checkTime(today.getMonth() + 1)
      var day = this.checkTime(today.getDate())
      var hour = this.checkTime(today.getHours())
      var minute = this.checkTime(today.getMinutes())
      var second = this.checkTime(today.getSeconds())
      this.nowTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    }
  }
}
</script>

<style scoped lang="less">
.main {
  background-color: #ffffff;
  /deep/ .el-container {
    width: 100%;
    height: 100vh;
    .el-aside {
      background-color: #304156;
      color: #333;
      text-align: center;
      .logo {
        height: 8.6%;
        width: 100%;
        background: url("../assets/img/logo.png") no-repeat;
        background-size: 100% 100%;
      }
      .el-menu {
        height: 91.4%;
      }
    }
    .el-header {
      background-color: #fff;
      color: #333;
      text-align: center;
      position: relative;
      height: 8.57% !important;
      .same {
        height: 100%;
        position: absolute;
        font-size: 0.14rem;
        display: flex;
        align-items: center;
        text-align: left;
      }
      .router {
        left: 3%;
        width: 45%;
      }
      .time {
        right: 20%;
        width: 16%;
      }
      .avatar {
        height: 90%;
        margin-top: 0.25%;
        right: 2%;
        width: 14%;
        .img {
          height: 100%;
          width: 33%;
          border-radius: 50%;
          background: url("../assets/img/3.jpg") no-repeat;
          background-size: 100% 100%;
        }
        .name {
          padding-left: 6%;
        }
      }
    }

    .el-main {
      background-color: #e9eef3;
      color: #333;
      text-align: center;
    }
  }
}
</style>
