<template>
  <div class="main">
    <div class="head">
      <el-input placeholder="请输入教师名称"
                v-model="year">
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
                :default-sort = "{prop: 'time', order: 'descending'}"
                height="100%"
                style="width: 100%">
        <el-table-column prop="id"
                        label="图片ID">
        </el-table-column>
        <el-table-column prop="teacher_name"
                        label="教师姓名">
        </el-table-column>
        <el-table-column prop="year"
                        label="拍摄年份">
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
      <!-- 新增弹窗 -->
      <el-dialog title="新增教师风采照"
                :visible.sync="newDialogFormVisible">
          <el-input placeholder="请输入教师名称"
          style="margin-bottom: 20px"
                v-model="teacherName"/>
          <el-input placeholder="请输入照片拍摄年份"
          style="margin-bottom: 20px"
                v-model="teacherTime"/>
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
  name: 'teacher_hist',
  data () {
    return {
      year: '',
      fileList: [],
      tableData: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      newDialogFormVisible: false,
      dialogFormVisible: false,
      dialogBigVisible: false,
      teacherName: null,
      teacherTime: null,
      newYearOptions: [],
      returnImgUrl: null,
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
    getData () {
      this.$axios.get('/teacher-image/getAll').then((res) => {
        if (res.data.status === 200 && res.data.msg === '教师毕业照信息获取成功') {
          this.tableData = res.data.data
        } else {
          this.$message({ type: 'error', message: res.msg })
        }
      })
    },
    async search () {
      this.$axios.get('/teacher-image', { params: { teacher_name: this.year } }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.tableData = res.data.data
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    reset () {
      this.year = ''
      this.getData()
    },
    push () {
      this.fileList = []
      this.newDialogFormVisible = true
    },
    async uploadimg (file, fileList) {
      var that = this
      // const file = event.raw
      console.log(file)
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
      const isLt11M = file.size / 1024 / 1024 < 11

      if (!isJPG) {
        that.$message.error('格式不对，上传图片只能是 JPG、PNG 格式!')
        file.url = ''
      }
      if (!isLt11M) {
        that.$message.error('上传图片大小不能超过 11MB!')
        file.url = ''
      }
      if (isJPG && isLt11M) {
        const formData = new FormData()
        formData.append('image', file.raw)
        await that.$axios.post('/admin/uploadImg', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          if (res.data.status === 200 && res.data.msg === '文件上传成功') {
            that.$message({ type: 'success', message: '图片上传成功' })
            this.returnImgUrl = res.data.data.url
            console.log(this.returnImgUrl)
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
      formData.append('teacher_name', '' + this.teacherName)
      formData.append('year', '' + this.teacherTime)
      formData.append('url', '' + this.returnImgUrl)
      await this.$axios.put('/teacher-image', formData, {
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
    },
    closeClick (row) {
      this.$axios.delete('/teacher-image', { params: { id: row.id } }).then((res) => {
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
