<template>
  <div class="main">
    <el-tree :data="data"
             node-key="id"
             highlight-current
             default-expand-all
             :expand-on-click-node="false">
      <span class="custom-tree-node"
            slot-scope="{ node, data }">
        <span>{{ node.label }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ data.type }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ data.value }}</span>
        <span>
          <el-button type="text"
                     size="mini"
                     @click="() => append(node,data)">
            <i class="el-icon-plus"></i>新增
          </el-button>
          <el-button type="text"
                     size="mini"
                     @click="() => reset(data,node)">
            <i class="el-icon-edit-outline"></i>编辑
          </el-button>
          <el-button type="text"
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
                      label="学生身份"
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
        <el-form-item v-if="level"
                      label="毕业去向"
                      :label-width="formLabelWidth">
          <el-select v-model="form.type"
                     style="width:100%"
                     placeholder="请选择">
            <el-option v-for="item in optionsToGo"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="level"
                      label="新增数量"
                      :label-width="formLabelWidth">
          <el-input v-model="form.value"
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
  name: 'togo',
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
        type: '',
        value: null
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
      optionsStudent: [{
        value: '研究生',
        label: '研究生'
      }, {
        value: '本科生',
        label: '本科生'
      }],
      optionsToGo: [{
        value: '升学',
        label: '升学'
      }, {
        value: '就业',
        label: '就业'
      }, {
        value: '考公',
        label: '考公'
      }, {
        value: '其他',
        label: '其他'
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
      this.$axios.get('/juxtserver/studentsto/getData').then((res) => {
        if (res.data.status === 200 && res.data.msg === '所有毕业去向数据获取成功') {
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
      if (data.level === 1) {
        formData.append('label', '年份')
        formData.append('value', that.form.year)
      }
      if (data.level === 2) {
        formData.append('label', that.form.label)
        formData.append('type', that.form.type)
        formData.append('value', that.form.value)
        formData.append('year', node.label)
      }
      that.$axios.post('/juxtserver/studentsto/pushData', formData, {
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
      } else {
        this.newDialogFormVisible = true
        this.newForm.node = node
        this.newForm.data = data
      }
    },
    resetData (node, data) {
      const formData = new FormData()
      var that = this
      formData.append('id', data.id)
      formData.append('value', that.newForm.year)
      if (node.level === 2) {
        formData.append('label', '年份')
      }
      if (node.level === 3) {
        formData.append('label', data.label)
        formData.append('type', data.type)
        formData.append('year', node.parent.data.label)
      }
      that.$axios.post('/juxtserver/studentsto/resetData', formData, {
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
      if (node.level === 1) {
        this.$message({ type: 'warning', message: '根节点不可删除' })
        return
      }
      var label = ''
      var year = ''
      var type = ''
      if (node.level === 2) {
        label = '年份'
      }
      if (node.level === 3) {
        label = data.label
        type = data.type
        year = node.parent.data.label
      }
      this.$axios.get('/juxtserver/studentsto/deleteData', { params: { id: data.id, label: label, year: year, type: type } }).then((res) => {
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
            <el-button size="mini" type="text" on-click={() => this.append(data)}><i class="el-icon-plus"></i>新增</el-button>
            <el-button size="mini" type="text" on-click={() => this.reset(data)}><i class="el-icon-edit-outline"></i>编辑</el-button>
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
