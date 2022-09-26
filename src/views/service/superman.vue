<template>
  <div class="main">
      <div class="head">
      <el-button type="danger"
                 @click="push"
                 plain>新增</el-button>
    </div>
    <div class="body">
      <!-- 表格 -->
      <el-table :data="tableData"
                border
                height="100%"
                style="width: 100%;">
        <el-table-column prop="No"
                         label="序号">
        </el-table-column>
        <el-table-column prop="userName"
        label="用户账号">
      </el-table-column>
      <el-table-column prop="id"
                       label="用户id">
      </el-table-column>
        <el-table-column prop="password"
                         label="密码">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.value"
            active-color="#13ce66"
            @change="value(scope.row)"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
        <el-table-column prop="time"
                         label="更新时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)"
                       type="text"
                       style="color: #29B3B7"
                       size="small">编辑</el-button>
            <el-button @click="deleteClick(scope.row)"
                       type="text"
                       style="color: red"
                       size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑弹窗 -->
      <el-dialog title="修改用户"
                 :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="用户名"
                        :label-width="formLabelWidth">
            <el-input v-model="form.name"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        :label-width="formLabelWidth">
            <el-input v-model="form.etc"
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
      <el-dialog title="新增用户"
                 :visible.sync="newDialogFormVisible">
        <el-form :model="newForm">
          <el-form-item label="用户名"
                        :label-width="formLabelWidth">
            <el-input v-model="newForm.name"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        :label-width="formLabelWidth">
            <el-input v-model="newForm.etc"
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
  name: 'superman',
  data () {
    return {
      tableData: [],
      options: [{
        value: 'true',
        label: '开启'
      }, {
        value: 'false',
        label: '禁止'
      }],
      newDialogFormVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        etc: ''
      },
      newForm: {
        name: '',
        etc: ''
      },
      formLabelWidth: '120px',
      tempRow: null
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getData()
    },
    getData () {
      this.$axios.get('/juxtserver/admin/getData').then((res) => {
        if (res.data.status === 200 && res.data.msg === '获取管理数据成功') {
          this.tableData = res.data.data.data
        } else {
          this.$message({ type: 'error', msg: res.data.msg })
        }
      })
    },
    async pushData () {
      this.newDialogFormVisible = false
      const formData = {
        username: this.newForm.name,
        password: this.newForm.etc
      }
      await this.$axios.post('/juxtserver/admin/pushData', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
          this.newForm.name = ''
          this.newForm.etc = ''
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    deleteClick (row) {
      this.$axios.get('/juxtserver/admin/deleteData', { params: { id: row.id } }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    async resetData () {
      this.dialogFormVisible = false
      const formData = {
        id: this.tempRow,
        username: this.form.name,
        password: this.form.etc
      }
      await this.$axios.post('/juxtserver/admin/resetData', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
          this.form.name = ''
          this.form.etc = ''
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    value (row) {
      this.$axios.get('/juxtserver/admin/setType', { params: { id: row.id } }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: '状态更改' })
          this.getData()
        } else {
          this.$message({ type: 'error', message: '状态更改异常——' + res.data.msg })
          this.getData()
        }
      })
    },
    handleClick (row) {
      this.dialogFormVisible = true
      this.form.name = row.userName
      this.form.etc = row.password
      this.tempRow = row.id
    },
    push () {
      this.newDialogFormVisible = true
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
    .el-input,.el-select {
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
      /deep/ .el-input{
        height: 100%;
      }
      /deep/ .el-input__suffix{
        height: 85%;
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
