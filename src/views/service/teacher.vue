<template>
  <div class="main">
    <el-button type="primary"
                 @click="newDialogFormVisible = true"
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
    prop="professor"
    label="教授"
    >
  </el-table-column>
  <el-table-column
    prop="associateProfessor"
    label="副教授"
    >
  </el-table-column>
    <el-table-column
      prop="lecturer"
      label="讲师"
      >
    </el-table-column>
    <el-table-column
      prop="undergrad"
      label="本科生"
      >
    </el-table-column>
    <el-table-column label="研究生">
    <el-table-column
      prop="localPostgra"
      label="研究生（本校自考）"
      >
    </el-table-column>
    <el-table-column
      prop="unlocalPostgra"
      label="研究生（外校考入）"
      >
    </el-table-column>
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
  <el-dialog title="新增数据" :visible.sync="newDialogFormVisible">
  <el-form :model="newForm">
    <el-form-item label="年份" :label-width="formLabelWidth">
      <el-input v-model="newForm.year" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="newDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="append">确 定</el-button>
  </div>
</el-dialog>
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
    <el-form-item label="研究生人数(本校自考)" :label-width="formLabelWidth">
      <el-input v-model="form.localPostgra" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="研究生人数（外校考入）" :label-width="formLabelWidth">
      <el-input v-model="form.unlocalPostgra" autocomplete="off"></el-input>
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
      newDialogFormVisible: false,
      newForm: {
        year: ''
      },
      form: {
        year: '',
        professor: '',
        associateProfessor: '',
        lecturer: '',
        undergrad: '',
        unlocalPostgra: '',
        localPostgra: ''
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
      this.form.localPostgra = row.localPostgra
      this.form.unlocalPostgra = row.unlocalPostgra
    },
    append () {
      this.newDialogFormVisible = false
      const formData = {}
      formData.year = this.newForm.year
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
          this.newForm.year = ''
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    resetData () {
      this.dialogFormVisible = false
      const formData = {}
      formData.year = this.form.year
      formData.postgraduate = parseInt(this.form.localPostgra) + parseInt(this.form.unlocalPostgra)
      formData.localPostgra = this.form.localPostgra
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
