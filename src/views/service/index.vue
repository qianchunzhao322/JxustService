<template>
  <div class="main">
    <div class="left">
      <div class="top out">
        <div class="box in out">
          <div class="img"></div>
          <div class="word out">
            <div class="title">打卡点</div>
            <div class="value">{{photo[0]}}</div>
          </div>
        </div>
        <div class="box in out">
          <div class="img"></div>
          <div class="word out">
            <div class="title">学院楼</div>
            <div class="value">{{photo[1]}}</div>
          </div>
        </div>
        <div class="box in out">
          <div class="img"></div>
          <div class="word out">
            <div class="title">毕业照</div>
            <div class="value">{{photo[2]}}</div>
          </div>
        </div>
        <div class="box in out">
          <div class="img"></div>
          <div class="word out">
            <div class="title">生活照</div>
            <div class="value">{{photo[3]}}</div>
          </div>
        </div>
      </div>
      <div class="middle">
        <div class="left out">
          <div class="inner in" id="chartFrist"></div>
        </div>
        <div class="right out">
          <div class="box in">
            <div class="title">在职教师</div>
            <div class="body">
              <div class="item out">
                <span>教授</span>
                <span>{{teacher[0]}}</span>
              </div>
              <div class="item out">
                <span>副教授</span>
                <span>{{teacher[1]}}</span>
              </div>
              <div class="item out">
                <span>讲师</span>
                <span>{{teacher[2]}}</span>
              </div>
            </div>
          </div>
          <div class="box in"><div class="title">在校学生</div>
            <div class="body">
              <div class="item out">
                <span>本科生</span>
                <span>{{teacher[3]}}</span>
              </div>
              <div class="item out">
                <span>研究生</span>
                <span>{{teacher[4]}}</span>
              </div>
            </div></div>
        </div>
      </div>
      <div class="bottom out">
        <div class="inner in" id="chartSecond"></div>
        <div class="inner in" id="chartThird"></div>
      </div>
    </div>
    <div class="right">
      <div class="top out">
        <div class="inner in">
          <Calendar v-on:choseDay="clickDay"
                    v-on:changeMonth="changeDate"
                    v-on:isToday="clickToday"></Calendar>
        </div>
      </div>
      <div class="bottom out">
        <div class="inner in">
          <div class="title">最新动态</div>
            <div class="body">
              <div class="item out" v-for="item in info" :key="item.index">
                <div>
                  <el-tooltip style="width:100%" :content="item.title" placement="top">
  <div>{{item.title}}</div>
</el-tooltip></div>
                <div class="time">
                  <div>
                  <el-tooltip style="width:100%" :content="item.time" placement="top">
  <div>{{item.time}}</div>
</el-tooltip></div></div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from 'vue-calendar-component'
import { debounce } from 'lodash'
import * as echarts from 'echarts'
export default {
  name: 'index',
  components: {
    Calendar
  },
  data () {
    return {
      myChartsFrist: null,
      myChartsSecond: null,
      myChartsThird: null,
      resize: null, // 防抖函数

      teacher: [],
      photo: [],
      info: [],

      eFristex: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      eFristey: [64, 159, 112, 86, 151, 131, 118],
      eSecondType: ['电信大类', '计算机大类'],
      eSecondData1: [23, 84],
      eSecondData2: [13, 54],
      eThirdYear: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
      eThirdPro: [400, 400, 300, 300, 300, 400, 400, 400, 300],
      eThirdCon: [400, 500, 500, 500, 500, 400, 400, 500, 500],
      eThirdSum: [400, 600, 700, 700, 1000, 400, 400, 600, 700]

    }
  },
  mounted () {
    this.init()
    window.addEventListener('resize', this.resize)
  },
  created () {
    this.initItems()
    this.resize = this.addResize()
  },
  beforeDestoryed () {
    // 组件销毁前移除监听,释放echarts实例,防止内存泄露
    this.myChartsFrist.dispose()
    this.myChartsSecond.dispose()
    this.myChartsThird.dispose()
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    initItems () {
      this.getPhoto()
      this.getTeacher()
      this.getInfo()
      this.getChartFristData()
      this.getChartSecondData()
      this.getChartThirdData()
    },
    async getInfo () {
      await this.$axios.get('/jlclient/news', {
        headers: {
          admin: localStorage.getItem('btapex')
        }
      }).then((res) => {
        if (res.data.status === 200 && res.data.msg === '请求成功') {
          this.info = res.data.data.news
        } else {
          this.$message({ type: 'danger', message: res.data.msg })
        }
      })
    },
    async getPhoto () {
      await this.$axios.get('/juxtserver/count/getImagesCount').then((res) => {
        if (res.data.status === 200 && res.data.msg === '各类照片数量获取成功') {
          this.photo = res.data.data.data
        } else {
          this.$message({ type: 'danger', message: res.data.msg })
        }
      })
    },
    async getTeacher () {
      await this.$axios.get('/juxtserver/count/getAtSchoolCount').then((res) => {
        if (res.data.status === 200 && res.data.msg === '师生数量数据获取成功') {
          this.teacher = res.data.data.data
        } else {
          this.$message({ type: 'danger', message: res.data.msg })
        }
      })
    },
    async getChartFristData () {
      await this.$axios.get('/juxtserver/visit/getData').then((res) => {
        if (res.data.status === 200 && res.data.msg === '近七天的访问量获取成功') {
          this.eFristex = res.data.data.data.eFristex
          this.eFristey = res.data.data.data.eFristey
          this.drawFrist(this.eFristex, this.eFristey)
        } else {
          this.$message({ type: 'danger', message: '折线图表数据获取失败，请刷新' })
        }
      })
    },
    async getChartSecondData () {
      await this.$axios.get('/jlclient/sex').then((res) => {
        if (res.data.status === 200 && res.data.msg === '请求成功') {
          this.eSecondType = res.data.data.major
          this.eSecondData1 = res.data.data.major1
          this.eSecondData2 = res.data.data.major2
          this.drawSecond(this.eSecondType, this.eSecondData1, this.eSecondData2)
        } else {
          this.$message({ type: 'danger', message: '男女图表数据获取失败，请刷新' })
        }
      })
    },
    async getChartThirdData () {
      await this.$axios.get('/jlclient/awards').then((res) => {
        if (res.data.status === 200 && res.data.msg === '请求成功') {
          this.eThirdYear = res.data.data.year
          this.eThirdPro = res.data.data.province
          this.eThirdCon = res.data.data.country
          this.eThirdSum = res.data.data.rewardSum
          this.drawThird(this.eThirdYear, this.eThirdPro, this.eThirdCon, this.eThirdSum)
        } else {
          this.$message({ type: 'danger', message: '柱状图表数据获取失败，请刷新' })
        }
      })
    },
    clickDay (data) {
      console.log(data) // 选中某天
    },
    changeDate (data) {
      console.log(data) // 左右点击切换月份
    },
    clickToday (data) {
      console.log(data) // 跳到了本月
    },
    addResize () {
      return debounce(() => {
        this.myChartsFrist.resize()
        this.myChartsSecond.resize()
        this.myChartsThird.resize()
      }, 500)
    },
    init () {
      // var that = this
      this.myChartsFrist = echarts.init(document.getElementById('chartFrist'))
      this.myChartsSecond = echarts.init(document.getElementById('chartSecond'))
      this.myChartsThird = echarts.init(document.getElementById('chartThird'))
      this.drawFrist(this.eFristex, this.eFristey)
      this.drawSecond(this.eSecondType, this.eSecondData1, this.eSecondData2)
      this.drawThird(this.eThirdYear, this.eThirdPro, this.eThirdCon, this.eThirdSum)
    },
    drawFrist (ex, ey) {
      const xLabel = ex
      const valueData = ey
      if (!this.myChartsFrist) return
      // 绘制图表
      const option = {
        title: [
          {
            left: 'center',
            top: '2%',
            text: '近期客户端使用次数统计',
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              fontSize: '0.105rem'
            }
          },
          {
            top: '8%',
            left: 'center'
          }
        ],
        tooltip: {
          textStyle: {
            color: '#000'
          },
          padding: [10, 10],
          trigger: 'axis',
          backgroundColor: '#fff',
          borderColor: 'rgba(112, 119, 242, 0.8)',
          borderWidth: 1,
          axisPointer: {
            lineStyle: {
              color: 'RGBA(105, 136, 217, 1)'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '14%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          data: xLabel,
          axisLine: {
            lineStyle: {
              color: 'rgba(193, 207, 220, 1)'
            }
          },
          axisLabel: {
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              fontSize: '0.1rem',
              color: 'black'
            }
          }
        },
        yAxis: [{
          type: 'value',
          minInterval: 50,
          axisLabel: {
            textStyle: {
              fontSize: '0.07rem',
              color: 'rgba(0, 0, 0, 1)'
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#cdd5e2'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(193, 207, 220, 1)'
            }
          }
        }
        ],
        series: [
          {
            name: '客户端使用次数',
            type: 'line',
            data: valueData,
            symbolSize: 10,
            symbol: 'circle',
            showSymbol: false,
            smooth: false,
            yAxisIndex: 0,
            lineStyle: {
              width: 2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'RGBA(96, 122, 209, 1)'
              },
              {
                offset: 1,
                color: 'RGBA(96, 122, 209, 1)'
              }
              ]),
              shadowColor: 'RGBA(96, 122, 209, 0.4)',
              shadowBlur: 10,
              shadowOffsetY: 10
            },
            itemStyle: {
              normal: {
                color: 'rgba(167, 181, 230, 1)',
                borderColor: '#fff',
                borderWidth: 3,
                shadowColor: 'rgba(167, 181, 230, 0.7)',
                shadowBlur: 5
              }
            },
            areaStyle: { // 区域填充样式
              normal: {
                // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'RGBA(184, 204, 241, 1)'
                },
                {
                  offset: 0.5,
                  color: 'RGBA(184, 204, 241, 0.5)'
                },
                {
                  offset: 0.7,
                  color: 'RGBA(184, 204, 241, 0)'
                }
                ], false),
                shadowBlur: 0 // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              }
            }
          }
        ]
      }
      option && this.myChartsFrist.setOption(option)
    },
    drawSecond (etype, data11, data22) {
      var type = etype
      var data1 = data11
      var data2 = data22
      if (!this.myChartsSecond) return
      // 绘制图表
      const option = {
        title: [
          {
            top: '2%',
            left: 'center',
            text: '专业男女比例',
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              fontSize: '0.105rem'
            }
          },
          {
            top: '5%',
            left: 'center'
          }
        ],
        legend: {
          top: '10%',
          right: '10%',
          textStyle: {
            fontSize: '0.0843rem',
            color: 'rgba(101, 213, 255, 1)'
          },
          icon:
            'path://M512 881.777778 512 881.777778C716.222629 881.777778 881.777778 716.222629 881.777778 512 881.777778 307.777371 716.222629 142.222222 512 142.222222 307.777373 142.222222 142.222222 307.777371 142.222222 512 142.222222 716.222629 307.777373 881.777778 512 881.777778L512 881.777778ZM512 1024 512 1024C229.230208 1024 0 794.769789 0 512 0 229.230211 229.230208 0 512 0 794.769789 0 1024 229.230211 1024 512 1024 794.769789 794.769789 1024 512 1024L512 1024Z',
          itemWidth: 8, // 设置宽度
          itemHeight: 8, // 设置高度、
          itemGap: 10 // 设置间距
        },
        tooltip: {
          show: true,
          trigger: 'axis', // axis , item
          backgroundColor: 'RGBA(0, 49, 85, 1)',
          borderColor: 'rgba(0, 151, 251, 1)',
          borderWidth: 1,
          borderRadius: 0,
          textStyle: {
            color: 'white',
            fontSize: 16,
            align: 'left'
          }
        },
        grid: {
          right: '5%',
          top: '20%',
          left: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: type,
          axisLabel: {
            // 坐标轴刻度标签的相关设置。
            interval: 0, // 设置为 1，表示『隔一个标签显示一个标签』
            // margin:15,
            textStyle: {
              color: 'black',
              fontStyle: 'normal',
              fontSize: '0.0983rem'
            }
          },
          axisTick: {
            // 坐标轴刻度相关设置。
            show: false
          },
          axisLine: {
            // 坐标轴轴线相关设置
            lineStyle: {
              color: 'rgba(77, 128, 254, 0.2)'
            }
          },
          splitLine: {
            // 坐标轴在 grid 区域中的分隔线。
            show: true,
            lineStyle: {
              color: 'rgba(77, 128, 254, 0.2)'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            splitNumber: 3,
            axisLabel: {
              textStyle: {
                color: 'black',
                fontStyle: 'normal',
                fontSize: '0.0983rem'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(77, 128, 254, 0.2)'
              }
            }
          }
        ],
        series: [
          {
            name: '女',
            type: 'pictorialBar',
            barWidth: '120%',
            stack: '数量',
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#00FFB4' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(255, 255, 255, .1)' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                } // 渐变颜色
              }
            },
            symbol:
              'path://M12.000,-0.000 C12.000,-0.000 16.074,60.121 22.731,60.121 C26.173,60.121 -3.234,60.121 0.511,60.121 C7.072,60.121 12.000,-0.000 12.000,-0.000 Z',

            data: data1
          }, {
            name: '男',
            type: 'pictorialBar',
            barWidth: '120%',
            stack: '数量',
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#C000FF' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(255, 255, 255, .1)' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                } // 渐变颜色
              }
            },
            symbol:
              'path://M12.000,-0.000 C12.000,-0.000 16.074,60.121 22.731,60.121 C26.173,60.121 -3.234,60.121 0.511,60.121 C7.072,60.121 12.000,-0.000 12.000,-0.000 Z',

            data: data2
          }]
      }
      option && this.myChartsSecond.setOption(option)
    },
    drawThird (fyear, fpro, fcon, fsum) {
      var year = fyear
      var pro = fpro
      var con = fcon
      var sum = fsum
      if (!this.myChartsThird) return
      // 绘制图表
      const option = {
        title: [
          {
            top: '2%',
            left: 'center',
            text: '历年获奖对比',
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              fontSize: '0.105rem'
            }
          },
          {
            top: '1%',
            left: 'center'
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '10%',
          bottom: '16%',
          top: '14%',
          containLabel: true
        },
        legend: {
          data: ['国家级', '省级', '总和'],
          right: '6%',
          top: '8%',
          textStyle: {
            color: 'black'
          },
          itemWidth: 14,
          itemHeight: 12
          // itemGap: 35
        },
        xAxis: {
          type: 'category',
          data: year,
          axisLine: {
            lineStyle: {
              color: 'black'

            }
          },
          axisLabel: {
            // interval: 0,
            // rotate: 40,
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              fontSize: '0.105rem'
            }
          }
        },

        yAxis: {
          type: 'value',
          // max: '1200',
          axisLine: {
            show: false,
            lineStyle: {
              color: 'black'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          },
          axisLabel: {
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              fontSize: '0.075rem'
            }
          }
        },
        dataZoom: [{
          show: true,
          height: '12rem',
          xAxisIndex: [
            0
          ],
          bottom: '10%',
          start: 10,
          end: 90,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '100%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: { color: '#219ccc' },
          borderColor: '#90979c'
        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [{
          name: '省级',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#fccb05'
              }, {
                offset: 1,
                color: '#f5804d'
              }]),
              barBorderRadius: 12
            }
          },
          data: pro
        },
        {
          name: '国家级',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#8bd46e'
              }, {
                offset: 1,
                color: '#09bcb7'
              }]),
              barBorderRadius: 11
            }

          },
          data: con
        },
        {
          name: '总和',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#248ff7'
              }, {
                offset: 1,
                color: '#6851f1'
              }]),
              barBorderRadius: 11
            }
          },
          data: sum
        }]
      }
      option && this.myChartsThird.setOption(option)
    }
  }
}
</script>

<style scoped lang="less">
.main {
  height: 100%;
  width: 100%;
  background-color: #e9eef3;
  .out {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .in {
    border-radius: 0.04rem;
    background-color: #fff;
  }
  .left {
    width: 80%;
    height: 100%;
    float: left;
    .top {
      height: 15%;
      width: 100%;
      .box {
        width: 22.9%;
        height: 90%;
        background: linear-gradient(to top right, #42ded6, #219ccc);
        .img {
          height: 80%;
          width: 36%;
          background: url("../../assets/img/index_photo.png") no-repeat;
          background-size: 100% 100%;
        }
        .word {
          height: 80%;
          width: 60%;
          justify-content: space-around;
          flex-direction: column;
          .title {
            height: 30%;
            width: 100%;
            font-size: 0.12rem;
            font-weight: bold;
            color: white;
          }
          .value {
            height: 70%;
            width: 100%;
            font-size: 0.32rem;
            font-weight: bold;
            color: white;
          }
        }
      }
      .box:nth-child(2) {
        background: linear-gradient(to top right, #e25eaf, #8366e8);
      }
      .box:nth-child(3) {
        background: linear-gradient(to top right, #f9c69a, #f7676a);
      }
      .box:nth-child(4) {
        background: linear-gradient(to top right, #0cb6e5, #27f29d);
      }
    }
    .middle {
      height: 45%;
      width: 100%;
      .left {
        height: 100%;
        width: 80%;
        .inner {
          width: 96%;
          height: 97%;
        }
      }
      .right {
        height: 100%;
        width: 20%;
        flex-direction: column;
        .box {
          width: 90%;
          height: 47%;
          overflow: hidden;
          .title{
            height: 20%;
            width: 100%;
            font-size: 0.12rem;
            font-weight: bold;
            color: #fff;
            line-height: 1.7;
            // background-color: rgb(194, 103, 103);
            background: linear-gradient(to top right, #3ed6d5, #8366e8);
          }
          .body{
            height: 80%;
            width: 100%;
            .item{
              height: 26%;
              justify-content: space-between ;
              padding: 0 10%;
              border-bottom: #219ccc 2px dashed;
              span{
                font-size: 0.09rem;
                color: #219ccc;
              }
            }
          }
        }
      }
    }
    .bottom {
      height: 40%;
      width: 100%;
      .inner {
        width: 48%;
        height: 90%;
      }
    }
  }
  .right {
    width: 20%;
    height: 100%;
    float: left;
    .top {
      height: 40%;
      width: 100%;
      .inner {
        width: 90%;
        height: 96%;
        border-radius: 0.09rem;

        /deep/.wh_container {
          font-size: 0.7rem;
          height: 100%;
          border-radius: 0.09rem;
          .wh_top_changge {
            height: 15%;
          }
          .wh_content_item{
            height: 0.21rem;
          }
          .wh_content {
            height: 10%;
          }
          .wh_top_changge li {
            font-size: 0.1rem;
          }
          .wh_top_tag {
            font-size: 0.08rem;
            height: 0.21rem;
            width: 0.21rem;
          }
          .wh_item_date {
            font-size: 0.08rem;
            height: 0.21rem;
            width: 0.21rem;
          }
          .wh_content_all {
            height: 100%;
            background: linear-gradient(to top right, #3ed6d5, #b77ee9);
            border-radius: 0.09rem;

            .wh_isToday {
              background-color: #1cd8bc;
            }
            .wh_chose_day {
              background-color: #f89280;
            }
          }
        }
      }
    }
    .bottom {
      height: 60%;
      width: 100%;
      .inner {
        width: 90%;
        height: 93%;
        overflow: hidden;
          .title{
            height: 8%;
            width: 100%;
            font-size: 0.12rem;
            font-weight: bold;
            color: #fff;
            line-height: 1.7;
            // background-color: rgb(194, 103, 103);
            background: linear-gradient(to top right, #3ed6d5, #8366e8);
          }
          .body{
            height: 80%;
            width: 100%;
            .item{
              height: 10%;
              justify-content: space-between ;
              padding: 0 2%;
              border-bottom: #219ccc 2px dashed;
              div{
                width: 70%;
                height: 100%;
                font-size: 0.09rem;
                color: #219ccc;
                text-align: left;
                line-height: 2.4;
                cursor: default;
                overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
              }
              .time{
                width: 27%;
              }
            }
          }
      }
    }
  }
}
</style>
