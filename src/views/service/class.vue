<template>
  <div class="main">
    <el-tree :data="data"
            node-key="id"
            ref="rootTree"
            highlight-current
            accordion
            :default-expanded-keys="[0]"
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
        <el-form-item v-if="year" label="毕业生（届）"
                      :label-width="formLabelWidth">
          <el-input v-model="form.year"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="level" label="新增专业"
                      :label-width="formLabelWidth">
                      <el-input v-model="form.label"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="classes" label="新增班级"
                      :label-width="formLabelWidth">
                      <el-input v-model="form.class"
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
        <el-button @click="newDialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                  @click="resetData(newForm.data,newForm.node)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'class',
  data () {
    return {
      id: null,
      data: [],
      dialogFormVisible: false,
      newDialogFormVisible: false,
      year: false,
      level: false,
      classes: false,
      form: {
        year: null,
        label: '',
        class: ''
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
    // 获取数据
    getData () {
      this.$axios.get('/juxtserver/class/getData', { params: { type: '本科生' } }).then((res) => {
        if (res.data.status === 200 && res.data.msg === '所有专业班级数据获取成功') {
          this.data = res.data.data
          this.id = res.data.data[0].maxId
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    // 添加数据的弹出层
    append (node, data) {
      this.form.label = ''
      this.form.year = ''
      this.form.class = ''
      if (node.level === 4) {
        this.$message({ type: 'warning', message: '最大层级为4级，不可新增了' })
      } else if (node.level === 3) {
        this.form.node = node
        this.form.data = data
        this.dialogFormVisible = true
        this.classes = true
        this.level = false
        this.year = false
      } else if (node.level === 2) {
        this.form.node = node
        this.form.data = data
        this.dialogFormVisible = true
        this.level = true
        this.year = false
        this.classes = false
      } else if (node.level === 1) {
        this.form.node = node
        this.form.data = data
        this.dialogFormVisible = true
        this.level = false
        this.classes = false
        this.year = true
      }
    },
    // 添加数据的发送请求
    pushData (node, data) {
      console.log(node, data)
      const formData = new FormData()
      var that = this
      formData.append('id', this.id++)
      formData.append('type', '本科生')
      if (data.level === 1) {
        formData.append('label', '年份')
        formData.append('year', that.form.year)
      }
      if (data.level === 2) {
        formData.append('majorName', that.form.label)
        formData.append('label', '专业')
        formData.append('year', data.data.label)
      }
      if (data.level === 3) {
        formData.append('className', that.form.class)
        formData.append('majorName', data.data.label)
        formData.append('label', '班级')
        formData.append('year', data.parent.data.label)
      }
      that.$axios.post('/juxtserver/class/pushData', formData, {
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
    // 修改数据的弹出层
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
    // 修改数据请求
    resetData (node, data) {
      const formData = new FormData()
      var that = this
      formData.append('id', node.id)
      formData.append('type', '本科生')
      if (data.level === 2) {
        formData.append('label', '年份')
        formData.append('year', that.newForm.year)
      }
      if (data.level === 3) {
        formData.append('label', '专业')
        formData.append('majorName', that.newForm.year)
      }
      if (data.level === 4) {
        formData.append('label', '班级')
        formData.append('className', that.newForm.year)
      }
      that.$axios.post('/juxtserver/class/resetData', formData, {
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
    // 删除数据
    remove (node, data) {
      console.log(node, data)
      if (node.level === 1) {
        this.$message({ type: 'warning', message: '根节点不可删除' })
        return
      }
      var label = ''
      if (node.level === 2) {
        label = '年份'
      }
      if (node.level === 3) {
        label = '专业'
      }
      if (node.level === 4) {
        label = '班级'
      }
      this.$axios.get('/juxtserver/class/deleteData', { params: { id: data.id, label: label, type: '本科生' } }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    // 尾部追加
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
