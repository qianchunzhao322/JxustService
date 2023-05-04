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
        <span>{{ node.label }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ data.value }}</span>
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
        <el-form-item v-if="year" label="新增年份"
                      :label-width="formLabelWidth">
          <el-input v-model="form.year"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="level" label="新增级别"
                      :label-width="formLabelWidth">
                      <el-select v-model="form.label" style="width:100%" placeholder="请选择">
    <el-option
      v-for="item in options"
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
  name: 'awards',
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
      options: [{
        value: '国家级',
        label: '国家级'
      }, {
        value: '省级',
        label: '省级'
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
    // 获取数据
    async getData () {
      await this.$axios.get('/juxtserver/awards/getData').then((res) => {
        if (res.data.status === 200 && res.data.msg === '所有获奖数据获取成功') {
          this.data = res.data.data
          console.log(this.data)
          this.id = res.data.data[0].maxId
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    // 添加数据的弹出层
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
    // 发送添加数据的请求操作
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
        formData.append('label', '年份')
        formData.append('value', that.form.year)
      }
      if (data.level === 2) {
        formData.append('label', that.form.label)
        formData.append('value', 0)
        formData.append('year', node.label)
      }
      that.$axios.post('/juxtserver/awards/pushData', formData, {
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
    // 修改数据
    reset (node, data) {
      if (data.level === 1) {
        this.$message({ type: 'warning', message: '根节点不可修改' })
      } else {
        this.newDialogFormVisible = true
        this.newForm.node = node
        this.newForm.data = data
      }
    },
    // 修改数据的请求
    resetData (node, data) {
      const formData = new FormData()
      var that = this
      formData.append('id', node.id)
      formData.append('value', that.newForm.year)
      if (data.level === 2) {
        formData.append('label', '年份')
      }
      if (data.level === 3) {
        formData.append('label', node.label)
      }
      that.$axios.post('/juxtserver/awards/resetData', formData, {
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
        label = node.label
      }
      this.$axios.get('/juxtserver/awards/deleteData', { params: { id: data.id, label: label } }).then((res) => {
        if (res.data.status === 200) {
          this.$message({ type: 'success', message: res.data.msg })
          this.getData()
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    },
    // 树状节点的尾部添加
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
