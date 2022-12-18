<template>
  <div class="main">
    <div class="head">
      <el-input placeholder="请输入校区"
                v-model="campus">
      </el-input>
      <el-input placeholder="请输入照片名称"
                v-model="name">
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
                style="width: 100%;">
        <el-table-column prop="No"
                         label="序号"
                         >
        </el-table-column>
        <el-table-column prop="address"
                         label="所在校区"
                         >
        </el-table-column>
        <el-table-column prop="type"
                         label="照片类型"
                         >
        </el-table-column>
        <el-table-column prop="name"
                         label="照片名称"
                         >
        </el-table-column>
        <el-table-column prop="url"
                         label="照片URL"
                         >
        </el-table-column>
        <el-table-column label="操作"
                         >
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)"
                       type="text"
                       style="color: #29B3B7"
                       size="small">编辑</el-button>
            <el-button @click="closeClick(scope.row)"
                       type="text"
                       style="color: red"
                       size="small">删除</el-button>
            <el-button @click="openClick(scope.row)"
                       type="text"
                       style="color: black"
                       size="small">展开照片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑弹窗 -->
      <el-dialog title="编辑打卡点"
                 :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="校区名称"
                        :label-width="formLabelWidth">
            <el-input v-model="form.campus"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="照片名称"
                        :label-width="formLabelWidth">
            <el-input v-model="form.name"
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
          <el-form-item label="所在校区"
                        :label-width="formLabelWidth">
            <el-select v-model="newForm.campus"
                       style="width:100%"
                       clearable
                       placeholder="请选择所在校区">
              <el-option v-for="item in yearOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="照片名称"
                        :label-width="formLabelWidth">
            <el-input v-model="newForm.name"
                      autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <el-upload action=""
        :file-list="fileList"
        ref="pictureUpload"
                   list-type="picture-card"
                   :on-change="uploadimg"
                   :limit="1"
                   :auto-upload="false">
          <i slot="default"
             class="el-icon-plus"></i>
          <div slot="file"
               slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail"
                 :src="file.url"
                 alt="">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
        <div slot="footer" class="dialog-footer">
    <el-button @click="newDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="pushData">确 定</el-button>
  </div>
      </el-dialog>
      <!-- 大图弹窗 -->
      <el-dialog title="展开图片"
                 :visible.sync="dialogBigVisible">
        <img :src="dialogImageUrl" alt="" style="width:60%;height:60%">
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'position',
  data () {
    return {
      campus: '',
      name: '',
      fileList: [],
      tableData: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      newDialogFormVisible: false,
      dialogFormVisible: false,
      dialogBigVisible: false,
      form: {
        name: '',
        campus: ''
      },
      newForm: {
        returnImgUrl: '',
        name: '',
        campus: ''
      },
      yearOptions: [{
        label: 1999,
        value: 1999
      }],
      formLabelWidth: '120px'
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getCampus()
      this.getData()
    },
    getCampus () {
      this.$axios.get('/jlclient/getItems/getCampus').then((res) => {
        if (res.data.status === 200 && res.data.msg === '请求成功') {
          this.yearOptions = res.data.data.campus
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    getData () {
      this.$axios.get('/juxtserver/photo/position/getData').then((res) => {
        if (res.data.status === 200 && res.data.msg === '查询成功') {
          this.tableData = res.data.data
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    async search () {
      const formData = new FormData()
      formData.append('name', '' + this.name)
      formData.append('address', '' + this.campus)
      await this.$axios.post('/juxtserver/photo/position/selectData', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.tableData = res.data.data
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    async pushData () {
      this.newDialogFormVisible = false
      const formData = new FormData()
      formData.append('address', '' + this.newForm.campus)
      formData.append('name', '' + this.newForm.name)
      formData.append('url', '' + this.newForm.returnImgUrl)
      await this.$axios.post('/juxtserver/photo/position/pushData', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    reset () {
      this.getData()
      this.campus = ''
      this.name = ''
    },
    handleClick (row) {
      this.dialogFormVisible = true
      this.form.name = row.name
      this.tempFormName = row.name
      this.form.campus = row.address
      // this.resetData(row)
    },
    async resetData () {
      var oldName = this.tempFormName
      this.dialogFormVisible = false
      const formData = new FormData()
      formData.append('address', '' + this.form.campus)
      formData.append('OldName', '' + oldName)
      formData.append('NewName', '' + this.form.name)
      await this.$axios.post('/juxtserver/photo/position/resetData', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    async uploadimg (file, fileList) {
      var that = this
      // const file = event.raw
      console.log(file)
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        that.$message.error('格式不对，上传图片只能是 JPG、PNG 格式!')
        file.url = ''
      }
      if (!isLt5M) {
        that.$message.error('上传图片大小不能超过 5MB!')
        file.url = ''
      }
      if (isJPG && isLt5M) {
        const formData = new FormData()
        formData.append('image', file.raw)
        await that.$axios.post('/admin/uploadImg', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          if (res.data.status === 200 && res.data.msg === '文件上传成功') {
            that.$message({ type: 'success', message: '图片上传成功' })
            this.newForm.returnImgUrl = res.data.data.url
          } else {
            that.$message({ type: 'warning', message: res.data.msg })
          }
        })
      }
    },
    closeClick (row) {
      const formData = new FormData()
      formData.append('name', row.name)
      this.$axios.post('/juxtserver/photo/position/deleteData', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    push () {
      this.newDialogFormVisible = true
    },
    openClick (row) {
      console.log(row)
      this.dialogBigVisible = true
      this.dialogImageUrl = row.url
    },
    handleRemove (file, fileList) {
      console.log(this.$refs.pictureUpload.uploadFiles)
      this.$refs.pictureUpload.uploadFiles = []
      console.log(this.$refs.pictureUpload.uploadFiles)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
    .el-input{
      width: 15%;
      float: left;
      margin-top: 1%;
      margin-left: 1%;
      height: 0.3rem;
      font-size: 0.08rem;
      justify-items: center;
      /deep/ .el-input__inner{
        height: 84%;
      }
    }
    .el-button{
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
