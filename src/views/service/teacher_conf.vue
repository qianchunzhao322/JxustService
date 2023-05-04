<template>
  <div class="main">
    <el-tree :data="data"
             node-key="id"
             ref="rootTree"
             highlight-current
             default-expand-all
             :expand-on-click-node="false">
      <span class="custom-tree-node"
            slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text"
                     size="mini"
                     @click="() => append(node,data)">
            <i class="el-icon-plus"></i>新增
          </el-button>
          <el-button type="text"
                     size="mini"
                     @click="() => reset(node,data)">
            <i class="el-icon-edit-outline"></i>编辑
          </el-button>
          <el-button type="text"
                     size="mini"
                     @click="() => remove(node,data)">
            <i class="el-icon-delete"></i>删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog title="新增数据"
               :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item v-if="year" label="部门名称"
                      :label-width="formLabelWidth">
          <el-input v-model="form.year"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="level" label="姓名"
                      :label-width="formLabelWidth">
                      <el-input v-model="form.label"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="pushData(form.data,form.node)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改数据"
               :visible.sync="newDialogFormVisible">
      <el-form :model="newForm">
        <el-form-item label="修改数据"
                      :label-width="formLabelWidth">
          <el-input v-model="newForm.year"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="resetData(newForm.data,newForm.node)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'teacher_conf',
  data () {
    return {
      id: null,
      data: [],
      dialogFormVisible: false,
      newDialogFormVisible: false,
      year: false,
      level: false,
      form: {
        year: null,
        label: ''
      },
      newForm: {
        year: null
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
    getData () {
      this.$axios.get('/juxtserver/teacher/getTree').then((res) => {
        if (res.data.status === 200 && res.data.msg === '所有部门教职工数据获取成功') {
          const temp = []
          temp.push(res.data.data)
          this.data = temp
          this.id = res.data.data.maxId
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    append (node, data) {
      this.form.label = ''
      this.form.year = ''
      if (node.level === 3) {
        this.$message({ type: 'warning', message: '最大层级为3级，不可新增了' })
      } else if (node.level === 2) {
        this.form.node = node
        this.form.data = data
        this.dialogFormVisible = true
        this.level = true
        this.year = false
      } else if (node.level === 1) {
        this.form.node = node
        this.form.data = data
        this.dialogFormVisible = true
        this.level = false
        this.year = true
      }
    },
    pushData (node, data) {
      const formData = new FormData()
      var that = this
      formData.append('id', this.id++)
      formData.append('father_id', node.id)
      data.level === 1 ? formData.append('value', that.form.year) : formData.append('value', that.form.label)
      that.$axios.put('/juxtserver/teacher', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          that.$message({ type: 'success', message: res.data.msg })
          that.getData()
        } else {
          that.$message({ type: 'error', message: res.data.msg })
        }
      })
      this.dialogFormVisible = false
    },
    reset (node, data) {
      this.newForm.year = ''
      if (node.level === 1) {
        this.$message({ type: 'warning', message: '根节点不可修改' })
      } else {
        this.newDialogFormVisible = true
        this.newForm.node = node
        this.newForm.data = data
      }
    },
    resetData (node, data) {
      const formData = new FormData()
      var that = this
      formData.append('id', node.id)
      formData.append('value', that.newForm.year)
      that.$axios.post('/juxtserver/teacher', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          that.$message({ type: 'success', message: res.data.msg })
          that.getData()
        } else {
          that.$message({ type: 'error', message: res.data.msg })
        }
      })
      this.newDialogFormVisible = false
    },
    remove (node, data) {
      if (node.level === 1) {
        this.$message({ type: 'warning', message: '根节点不可删除' })
        return
      }
      this.$axios.delete('/juxtserver/teacher', { params: { id: data.id } }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={() => this.append(node, data)}><i class="el-icon-plus"></i>新增</el-button>
            <el-button size="mini" type="text" on-click={() => this.reset(node, data)}><i class="el-icon-edit-outline"></i>编辑</el-button>
            <el-button size="mini" type="text" on-click={() => this.remove(node, data)}><i class="el-icon-delete"></i>删除</el-button>
          </span>
        </span>)
    }
  }
}
</script>

<style scoped lang="less">
.main {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
