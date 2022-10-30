<template>
  <div id="app">
    <router-view></router-view>
    <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>为保证系统安全，刷新或不正当进出系统等操作将清除数据，请重新登陆</span>
  <span slot="footer" class="dialog-footer">
  </span>
</el-dialog>
  </div>
</template>
<script>

export default {
  data () {
    return {
      dialogVisible: false
    }
  },
  mounted () {
    // window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
  },
  methods: {
    beforeunloadHandler (e) {
      // alert('为保证系统安全，刷新或不正当进出系统等操作将清除数据，请重新登陆')
      // this.dialogVisible = true
      // this.sleep(5000)
      // this.dialogVisible = false
      // e.returnValue = '关闭提示'; 弹窗
      localStorage.removeItem('btapex')
    },
    sleep (ms) { // sleep延迟方法2
      var now = new Date().getTime()
      while (new Date().getTime() < now + ms) {}
    }
  },
  destroyed () {
    // window.removeEventListener('beforeunload', (e) =>
    //   this.beforeunloadHandler(e)
    // )
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  // position: absolute;
  // top: 0;
  // left: 0;
  background-color: rgb(169, 164, 164);
}

</style>
