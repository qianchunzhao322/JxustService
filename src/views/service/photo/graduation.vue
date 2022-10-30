<template>
  <div class="main">
    <div class="head">
      <el-input placeholder="请输入毕业年份"
                v-model="year">
      </el-input>
      <el-input placeholder="请输入专业"
                v-model="major">
      </el-input>
      <el-input placeholder="请输入班级"
                v-model="classes">
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
        <el-table-column prop="No"
                         label="序号">
        </el-table-column>
        <el-table-column prop="time"
                         label="毕业年份">
        </el-table-column>
        <el-table-column prop="major"
                         label="专业">
        </el-table-column>
        <el-table-column prop="class"
                         label="班级">
        </el-table-column>
        <el-table-column prop="type"
                         label="照片类型">
        </el-table-column>
        <el-table-column prop="name"
                         label="照片名称">
        </el-table-column>
        <el-table-column label="图片简略图">
          <template slot-scope="scope">
            <div style="margin-left: 0.25rem; height:0.22rem;weight:0.22rem"> <img :src="scope.row.url"
            style="height:100%;weight:100%"
                 alt=""></div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)"
                       type="text"
                       style="color: #29B3B7"
                       size="small">编辑</el-button> -->
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
      <!-- 新增弹窗 -->
      <el-dialog title="新增毕业照"
                 :visible.sync="newDialogFormVisible">
        <el-form :model="newForm">
          <el-form-item label="毕业年份"
                        :label-width="formLabelWidth">
            <el-select v-model="newForm.year"
                       style="width:100%"
                       clearable
                       @change="yearChangeToMajor($event)"
                       placeholder="请选择毕业年份">
              <el-option v-for="item in newYearOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业"
                        :label-width="formLabelWidth">
            <el-select v-model="newForm.major"
                       clearable
                       @change="majorChangeToClass"
                       style="width:100%"
                       placeholder="请选择专业">
              <el-option v-for="item in newMajorOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级"
                        :label-width="formLabelWidth">
            <el-select v-model="newForm.class"
                       style="width:100%"
                       clearable
                       placeholder="请选择毕业班级">
              <el-option v-for="item in newClassOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
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
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="newDialogFormVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="pushData">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 大图弹窗 -->
      <el-dialog title="展开图片"
                 :visible.sync="dialogBigVisible">
        <img :src="dialogImageUrl"
             alt=""
             style="width:60%;height:60%">
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'graduation',
  data () {
    return {
      year: '',
      major: '',
      classes: '',
      fileList: [],
      tableData: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      newDialogFormVisible: false,
      dialogFormVisible: false,
      dialogBigVisible: false,
      newForm: {
        year: '',
        major: '',
        class: '',
        name: '',
        returnImgUrl: ''
      },
      newYearOptions: [{
        label: 1999,
        value: 1999
      }],
      newMajorOptions: [{
        label: 1999,
        value: 1999
      }],
      newClassOptions: [{
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
      this.getData()
      this.getItemsYears()
    },
    async getItemsYears () {
      await this.$axios.get('/jlclient/getItems/getYear').then((res) => {
        if (res.data.status === 200 && res.data.msg === '请求成功') {
          this.newYearOptions = res.data.data.year
        }
      })
    },
    yearChangeToMajor (event) {
      this.$axios.get('/jlclient/getItems/getMajor', { params: { graduateYear: this.newForm.year } }).then((res) => {
        if (res.data.status === 200 && res.data.msg === '请求成功') {
          this.newMajorOptions = res.data.data.major
        }
      })
    },
    majorChangeToClass () {
      this.$axios.get('/jlclient/getItems/getClsss', { params: { graduateYear: this.newForm.year, majorName: this.newForm.major } }).then((res) => {
        if (res.data.status === 200 && res.data.msg === '请求成功') {
          this.newClassOptions = res.data.data.class
        }
      })
    },
    getData () {
      this.$axios.get('/juxtserver/photo/graduation/getData').then((res) => {
        if (res.data.status === 200 && res.data.msg === '所有毕业照信息查询成功') {
          this.tableData = res.data.data.data
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    async search () {
      const formData = new FormData()
      formData.append('graduateYear', '' + this.year)
      formData.append('majorName', '' + this.major)
      formData.append('className', '' + this.classes)
      await this.$axios.post('/juxtserver/photo/graduation/selectData', formData, {
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
    reset () {
      this.year = ''
      this.classes = ''
      this.major = ''
      this.getData()
    },
    push () {
      this.newDialogFormVisible = true
    },
    async uploadimg (file, fileList) {
      var that = this
      // const file = event.raw
      console.log(file)
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        that.$message.error('格式不对，上传图片只能是 JPG、PNG 格式!')
        file.url = ''
      }
      if (!isLt2M) {
        that.$message.error('上传图片大小不能超过 2MB!')
        file.url = ''
      }
      if (isJPG && isLt2M) {
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
    handleRemove (file, fileList) {
      console.log(this.$refs.pictureUpload.uploadFiles)
      this.$refs.pictureUpload.uploadFiles = []
      console.log(this.$refs.pictureUpload.uploadFiles)
    },
    async pushData () {
      this.newDialogFormVisible = false
      const formData = new FormData()
      formData.append('className', '' + this.newForm.class)
      formData.append('url', '' + this.newForm.returnImgUrl)
      await this.$axios.post('/juxtserver/photo/graduation/pushData', formData, {
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
    handleClick (row) {
      this.dialogFormVisible = true
      console.log(row)
    },
    closeClick (row) {
      this.$axios.get('/juxtserver/photo/graduation/deleteData', { params: { className: row.class } }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    openClick (row) {
      console.log(row)
      this.dialogBigVisible = true
      this.dialogImageUrl = row.url
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
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
