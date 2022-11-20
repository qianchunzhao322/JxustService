<template>
  <div class="main">
    <div class="head">
      <el-date-picker v-model="time"
                      type="date"
                      format="yyyy 年 MM 月 dd 日"
                      prefix-icon="el-icon-dat"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
      </el-date-picker>
      <el-input placeholder="请输入动态内容"
                v-model="value">
      </el-input>
      <el-button type="primary"
                 @click="search"
                 plain>查询</el-button>
      <el-button type="info"
                 @click="reset"
                 plain>重置</el-button>
      <el-button type="danger"
                 @click="push"
                 plain>新增</el-button>
    </div>
    <div class="body">
      <!-- 表格 -->
      <el-table :data="tableData"
                border
                height="100%"
                style="width: 100%">
        <el-table-column prop="id"
                         label="动态编号">
        </el-table-column>
        <el-table-column prop="time"
                         label="动态时间">
        </el-table-column>
        <el-table-column prop="value"
                         label="动态内容">
        </el-table-column>
        <el-table-column prop="url"
                         label="第二链接">
        </el-table-column>
        <el-table-column prop="upTime"
                         label="最近更新时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)"
                       type="text"
                       style="color: #29B3B7"
                       size="small">编辑</el-button>
            <el-button @click="closeClick(scope.row)"
                       type="text"
                       style="color: red"
                       size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑弹窗 -->
      <el-dialog title="编辑打卡点"
                 :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="动态时间"
                        :label-width="formLabelWidth">
            <el-date-picker style="width: 100%;"
                            v-model="newForm.time"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            prefix-icon="el-icon-dat"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="动态内容"
                        :label-width="formLabelWidth">
            <el-input v-model="form.value"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="第二链接"
                        :label-width="formLabelWidth">
            <el-input v-model="form.url"
                      autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="resetData">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新增弹窗 -->
      <el-dialog title="新增打卡点"
                 :visible.sync="newDialogFormVisible">
        <el-form :model="newForm">

          <el-form-item label="动态时间"
                        :label-width="formLabelWidth">
            <el-date-picker style="width: 100%;"
                            v-model="newForm.time"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            prefix-icon="el-icon-dat"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="动态内容"
                        :label-width="formLabelWidth">
            <el-input v-model="newForm.value"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="第二链接"
                        :label-width="formLabelWidth">
            <el-input v-model="newForm.url"
                      autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="newDialogFormVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="pushData">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'info',
  data () {
    return {
      time: '',
      value: '',
      tableData: [],
      newDialogFormVisible: false,
      dialogFormVisible: false,
      form: {
        id: '',
        time: '',
        value: '',
        url: ''
      },
      newForm: {
        time: '',
        value: '',
        url: ''
      },
      formLabelWidth: '120px'
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getData()
    },
    // 获取数据
    getData () {
      this.$axios.get('/juxtserver/info/getData').then((res) => {
        if (res.data.status === 200 && res.data.msg === '所有最新动态数据查询成功') {
          this.tableData = res.data.data.data
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    // 增数据
    async pushData () {
      this.newDialogFormVisible = false
      const formData = new FormData()
      formData.append('time', '' + this.newForm.time)
      formData.append('value', '' + this.newForm.value)
      formData.append('url', '' + this.newForm.url)
      await this.$axios.post('/juxtserver/info/pushData', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
          this.newForm.time = ''
          this.newForm.value = ''
          this.newForm.url = ''
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    // 改数据
    async resetData () {
      this.dialogFormVisible = false
      const formData = new FormData()
      formData.append('id', '' + this.form.id)
      formData.append('newTime', '' + this.form.time)
      formData.append('newValue', '' + this.form.value)
      formData.append('newUrl', '' + this.form.url)
      await this.$axios.post('/juxtserver/info/resetData', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
          this.newForm.time = ''
          this.newForm.value = ''
          this.newForm.url = ''
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    // 查数据
    async search () {
      console.log(this.time)
      const formData = new FormData()
      formData.append('time', '' + this.time)
      formData.append('value', '' + this.value)
      await this.$axios.post('/juxtserver/info/selectData', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.tableData = res.data.data.data
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    // 重置数据
    reset () {
      this.time = ''
      this.value = ''
      this.getData()
    },
    push () {
      this.newDialogFormVisible = true
    },
    // 获取点击行的数据
    handleClick (row) {
      this.dialogFormVisible = true
      this.form.time = row.time
      this.form.value = row.value
      this.form.url = row.url
      this.form.id = row.id
    },
    // 删除数据请求
    closeClick (row) {
      this.$axios.get('/juxtserver/info/deleteData', { params: { id: row.id } }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.main {
  width: 100%;
  height: 100%;
  .head {
    width: 100%;
    height: 10%;
    background-color: #fff;
    .el-input {
      width: 15%;
      float: left;
      margin-top: 1%;
      margin-left: 1%;
      height: 0.3rem;
      font-size: 0.08rem;
      justify-items: center;
      /deep/ .el-input__inner {
        height: 84%;
      }
    }
    .el-button {
      margin-top: 1%;
      margin-left: 2%;
      font-size: 0.1rem;
      width: 6%;
      height: 60%;
      padding: auto auto;
    }
  }
  .body {
    width: 100%;
    height: 90%;
  }
}
</style>
