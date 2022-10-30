<template>
  <div class="main">
    <el-tree
      :data="data"
      node-key="id"
      highlight-current
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ data.value }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(node, data)">
            <i class="el-icon-plus"></i>新增
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => reset(node, data)">
            <i class="el-icon-edit-outline"></i>编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            <i class="el-icon-delete"></i>删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog title="新增数据"
               :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item v-if="year"
                      label="新增年份"
                      :label-width="formLabelWidth">
          <el-input v-model="form.year"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="level"
                      label="新增专业"
                      :label-width="formLabelWidth">
          <el-select v-model="form.label"
                     style="width:100%"
                     placeholder="请选择">
            <el-option v-for="item in optionsStudent"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="value"
                      label="新增性别"
                      :label-width="formLabelWidth">
                      <el-select v-model="form.value"
                     style="width:100%"
                     placeholder="请选择">
            <el-option v-for="item in optionsType"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
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
  name: 'sex',
  data () {
    return {
      id: null,
      data: [],
      dialogFormVisible: false,
      newDialogFormVisible: false,
      year: false,
      level: false,
      value: false,
      form: {
        year: null,
        label: '',
        value: null
      },
      newForm: {
        year: null
      },
      optionsStudent: [{
        value: '1',
        label: '计算机类'
      }, {
        value: '2',
        label: '电子信息类'
      }],
      optionsType: [{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
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
    },
    getData () {
      this.$axios.get('/juxtserver/manandwomen/getData').then((res) => {
        if (res.data.status === 200 && res.data.msg === '所有大类专业数据获取成功') {
          this.data = res.data.data
          this.id = res.data.data[0].maxId
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    append (node, data) {
      this.form.label = ''
      this.form.type = ''
      this.form.value = ''
      this.form.year = ''
      if (node.level === 4) {
        this.$message({ type: 'warning', message: '最大层级为4级，不可新增了' })
      } else if (node.level === 3) {
        this.form.node = node
        this.form.data = data
        this.dialogFormVisible = true
        this.value = true
        this.level = false
        this.year = false
      } else if (node.level === 2) {
        this.form.node = node
        this.form.data = data
        this.dialogFormVisible = true
        this.level = true
        this.value = false
        this.year = false
      } else if (node.level === 1) {
        this.form.node = node
        this.form.data = data
        this.dialogFormVisible = true
        this.level = false
        this.value = false
        this.year = true
      }
    },
    pushData (node, data) {
      const formData = new FormData()
      var that = this
      formData.append('id', this.id++)
      if (data.level === 1) {
        formData.append('label', '年级')
        formData.append('value', that.form.year)
      }
      if (data.level === 2) {
        formData.append('label', '专业')
        formData.append('value', that.form.label)
        formData.append('grade', node.label)
      }
      if (data.level === 3) {
        formData.append('label', node.label)
        formData.append('type', that.form.value)
        formData.append('value', 0)
        formData.append('grade', data.parent.data.label)
      }
      that.$axios.post('/juxtserver/manandwomen/pushData', formData, {
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
      if (node.level === 1) {
        this.$message({ type: 'warning', message: '根节点不可修改' })
      } else if (node.level === 3) {
        this.$message({ type: 'warning', message: '禁止修改' })
      } else {
        this.newDialogFormVisible = true
        this.newForm.node = node
        this.newForm.data = data
      }
    },
    resetData (node, data) {
      console.log(node, data)
      const formData = new FormData()
      var that = this
      formData.append('id', node.id)
      formData.append('value', that.newForm.year)
      if (data.level === 2) {
        formData.append('label', '年级')
      }
      if (data.level === 4) {
        formData.append('label', data.parent.data.label)
        formData.append('type', node.label)
        formData.append('grade', data.parent.parent.data.label)
      }
      that.$axios.post('/juxtserver/manandwomen/resetData', formData, {
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
      this.newForm.year = ''
    },

    remove (node, data) {
      console.log(node, data)
      if (node.level === 1) {
        this.$message({ type: 'warning', message: '根节点不可删除' })
        return
      }
      var label = ''
      var type = ''
      var grade = ''
      if (node.level === 2) {
        label = '年级'
      }
      if (node.level === 3) {
        label = '专业'
      }
      if (node.level === 4) {
        label = node.parent.data.label
        type = data.label
        grade = node.parent.parent.data.label
      }
      this.$axios.get('/juxtserver/manandwomen/deleteData', { params: { id: data.id, label: label, grade: grade, type: type } }).then((res) => {
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
            <el-button size="mini" type="text" on-click={ () => this.append(data) }><i class="el-icon-plus"></i>新增</el-button>
            <el-button size="mini" type="text" on-click={ () => this.reset(data) }><i class="el-icon-edit-outline"></i>编辑</el-button>
            <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }><i class="el-icon-delete"></i>删除</el-button>
          </span>
        </span>)
    }
  }
}
</script>

<style scoped lang="less">
  .main{
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
