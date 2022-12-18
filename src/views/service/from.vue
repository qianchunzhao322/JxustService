<template>
  <div class="main">
    <el-tree
      :data="data"
      node-key="id"
      accordion
      :default-expanded-keys="[0]"
      highlight-current
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
        <el-form-item v-if="year" label="新增年级"
                      :label-width="formLabelWidth">
          <el-input v-model="form.year"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="level" label="新增生源地"
                      :label-width="formLabelWidth">
                      <el-input v-model="form.label"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="level" label="新增生源数"
                      :label-width="formLabelWidth">
                      <el-input v-model="form.num"
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
  name: 'from',
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
        label: '',
        num: null
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
      this.$axios.get('/juxtserver/province/getData').then((res) => {
        if (res.data.status === 200 && res.data.msg === '所有本科生源数据获取成功') {
          this.data = res.data.data
          this.id = res.data.data[0].maxId
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    // 增数据
    append (node, data) {
      this.form.label = ''
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
      console.log(node, data)
      // const newChild = { id: this.id++, value: '', label: 'testNode', children: [] }
      // if (!data.children) {
      //   this.$set(data, 'children', [])
      // }
      // data.children.push(newChild)
      const formData = new FormData()
      var that = this
      formData.append('id', this.id++)
      if (data.level === 1) {
        formData.append('label', '年级')
        formData.append('value', that.form.year)
      }
      if (data.level === 2) {
        formData.append('label', that.form.label)
        formData.append('value', that.form.num)
        formData.append('grade', node.label)
      }
      that.$axios.post('/juxtserver/province/pushData', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.data.status === 200) {
          that.$message({ type: 'success', message: res.data.msg })
          that.getData()
          that.form.num = ''
        } else {
          that.$message({ type: 'error', message: res.data.msg })
        }
      })
      this.dialogFormVisible = false
    },
    // 改数据
    reset (node, data) {
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
      if (data.level === 2) {
        formData.append('label', '年级')
      }
      if (data.level === 3) {
        formData.append('label', node.label)
      }
      that.$axios.post('/juxtserver/province/resetData', formData, {
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
    // 删数据
    remove (node, data) {
      if (node.level === 1) {
        this.$message({ type: 'warning', message: '根节点不可删除' })
        return
      }
      this.$axios.get('/juxtserver/province/deleteData', { params: { id: data.id } }).then((res) => {
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
