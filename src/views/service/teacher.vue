<template>
  <div class="main">
    <el-button type="primary"
                 @click="pushData"
                 plain>新增</el-button>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
    prop="id"
    label="序号"
    >
  </el-table-column>
    <el-table-column
    prop="year"
    label="年份"
    >
  </el-table-column>
  <el-table-column
    label="在职教师"
    >
    教授
  </el-table-column>
  <el-table-column
    prop="professor"
    label="人数"
    >
  </el-table-column>
  <el-table-column
    label="在职教师"
    >
    副教授
  </el-table-column>
  <el-table-column
    prop="associateProfessor"
    label="人数"
    >
  </el-table-column>
  <el-table-column
    label="在职教师"
    >
    讲师
  </el-table-column>
    <el-table-column
      prop="lecturer"
      label="人数"
      >
    </el-table-column>
  <el-table-column
    label="在校学生"
    >
    本科生
  </el-table-column>
    <el-table-column
      prop="undergrad"
      label="人数"
      >
    </el-table-column>
  <el-table-column
    label="在校学生"
    >
    研究生
  </el-table-column>
    <el-table-column
      prop="postgraduate"
      label="人数"
      >
    </el-table-column>
    <el-table-column
      prop="time"
      label="更新时间"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      >
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="closeClick(scope.row)"
                       type="text"
                       style="color: red"
                       size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="更新数据" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="年份" :label-width="formLabelWidth">
      <el-input v-model="form.year" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="教授人数" :label-width="formLabelWidth">
      <el-input v-model="form.professor" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="副教授人数" :label-width="formLabelWidth">
      <el-input v-model="form.associateProfessor" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="讲师人数" :label-width="formLabelWidth">
      <el-input v-model="form.lecturer" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="本科生人数" :label-width="formLabelWidth">
      <el-input v-model="form.undergrad" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="研究生人数" :label-width="formLabelWidth">
      <el-input v-model="form.postgraduate" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="resetData">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: 'teacher',
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      form: {
        year: '',
        professor: '',
        associateProfessor: '',
        lecturer: '',
        undergrad: '',
        postgraduate: ''
      }
      // formLabelWidth: '120px'
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
      this.$axios.get('/juxtserver/teacher/getData').then((res) => {
        if (res.data.status === 200 && res.data.msg === '所有在校师生数据获取成功') {
          this.tableData = res.data.data.data
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    handleClick (row) {
      this.dialogFormVisible = true
      this.form.year = row.year
      this.form.professor = row.professor
      this.form.lecturer = row.lecturer
      this.form.associateProfessor = row.associateProfessor
      this.form.undergrad = row.undergrad
      this.form.postgraduate = row.postgraduate
    },
    pushData () {
      this.dialogFormVisible = false
      const formData = {}
      formData.year = 0
      formData.postgraduate = 0
      formData.undergrad = 0
      formData.associateProfessor = 0
      formData.lecturer = 0
      formData.professor = 0
      this.$axios.post('/juxtserver/teacher/pushData', formData, {
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
    resetData () {
      this.dialogFormVisible = false
      const formData = {}
      formData.year = this.form.year
      formData.postgraduate = this.form.postgraduate
      formData.undergrad = this.form.undergrad
      formData.associateProfessor = this.form.associateProfessor
      formData.lecturer = this.form.lecturer
      formData.professor = this.form.professor
      this.$axios.post('/juxtserver/teacher/resetData', formData, {
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
    closeClick (row) {
      const formData = new FormData()
      formData.append('year', row.year)
      this.$axios.post('/juxtserver/teacher/deleteData', formData, {
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
    }
  }
}
</script>

<style scoped lang="less">

</style>
