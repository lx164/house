// pages/steps/steps.js
const {
  formatTime
} = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    steps: [
      {
        text: '提交委托',
        desc: '已完成'
      },
      {
        text: '等待管理员审核',
        desc: '等待进行...'
      },
      {
        text: '审核完成',
        desc: '等待进行...'
      },
      {
        text: '发布',
        desc: '等待进行...'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e)

    let id = e.id

    // 从发布委托也进来
    if (id == 'entrust') {
      let steps = this.data.steps
      steps[0].desc = `${formatTime(new Date())}您的委托我们已经收到,稍后我们将会联系您，请保持电话畅通！`
      this.setData({
        steps: steps
      })
    }

    // 从个人中心也进来
    if (id == 'myentrust') {
      console.log(JSON.parse(e.data))
      let data = JSON.parse(e.data)
      let active = this.data.active
      let steps = this.data.steps

      steps[0].desc = `委托提交成功 ${data.updateTime}`

      if (data.checkedTime) {
        steps[1].desc = `已处理 （处理人：管理员）`
        steps[2].desc = `已审核 ${data.checkedTime}`
        active = 2
      }

      if (data.publish) {
        steps[3].desc = `已发布 ${data.publishTime}`
        active = 3
      }

      this.setData({
        active:active,
        steps: steps
      })
      // 查询进度
      this.QuerySteps()
    }
  },

  // 查询进度
  QuerySteps() {
    let that = this

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})