const app = getApp();
Page({
  data: {
    repayType: [{
        name: '等额本息',
        value: 0,
        checked: 'true'
      },
      {
        name: '等额本金',
        value: 1
      }
    ],
    calType: [{
        name: '按贷款总额',
        value: 0,
        checked: 'true'
      },
      {
        name: '按单价',
        value: 1
      }
    ],
    param: {
      navChoose: 0,
      repayChoose: 0,
      calChoose: 0,
      yearA: 20,
      downA: 3,
      moneyA: '',
      priceA: '',
      areaA: '',
      rateA: 4.9,
      yearB: 20,
      downB: 3,
      moneyB: '',
      priceB: '',
      areaB: '',
      rateB: 3.25,
    }
  },
  onLoad() {
    this.onloadData();
  },
  onShow() {
    let c = wx.getStorageSync('calculate');
    if (c != '') {
      this.setData({
        [`param.rateA`]: (c.a.rate - 0) * (c.a.rates - 0),
        [`param.rateB`]: (c.b.rate - 0) * (c.b.rates - 0)
      })
    }
  },
  onloadData() {
    
  },
  onNavTab(e) {
    let navChoose = e.currentTarget.dataset.idx - 0;
    this.setData({
      [`param.navChoose`]: navChoose
    })
  },
  getRepayTypeTab(e) {
    let repayChoose = e.detail.value - 0;
    this.setData({
      [`param.repayChoose`]: repayChoose
    })
  },
  getCalTypeTab(e) {
    let calChoose = e.detail.value - 0;
    this.setData({
      [`param.calChoose`]: calChoose
    })
  },
  getYearA(e) {
    let yearA = e.detail.value;
    this.setData({
      [`param.yearA`]: yearA
    })
  },
  getDownA(e) {
    let downA = e.detail.value;
    this.setData({
      [`param.downA`]: downA
    })
  },
  getMoneyATab(e) {
    let rate = e.detail.value;
    let num = rate - 0;
    if (isNaN(num)) {
      this.setData({
        [`param.moneyA`]: this.data.param.moneyA
      })
    } else {
      let str = null;
      if (rate.indexOf(".") == -1) {
        str = rate;
      } else {
        let a = rate.split('.');
        let b = a[1].slice(0, 2);
        str = a[0] + '.' + b;
      }
      this.setData({
        [`param.moneyA`]: str
      })
    }
  },
  getPriceATab(e) {
    let rate = e.detail.value;
    let num = rate - 0;
    if (isNaN(num)) {
      this.setData({
        [`param.priceA`]: this.data.param.priceA
      })
    } else {
      let str = null;
      if (rate.indexOf(".") == -1) {
        str = rate;
      } else {
        let a = rate.split('.');
        let b = a[1].slice(0, 2);
        str = a[0] + '.' + b;
      }
      this.setData({
        [`param.priceA`]: str
      })
    }
  },
  getAreaATab(e) {
    let rate = e.detail.value;
    let num = rate - 0;
    if (isNaN(num)) {
      this.setData({
        [`param.areaA`]: this.data.param.areaA
      })
    } else {
      let str = null;
      if (rate.indexOf(".") == -1) {
        str = rate;
      } else {
        let a = rate.split('.');
        let b = a[1].slice(0, 2);
        str = a[0] + '.' + b;
      }
      this.setData({
        [`param.areaA`]: str
      })
    }
  },
  getRateA(e) {
    let rateA = e.detail.value;
    this.setData({
      [`param.rateA`]: rateA
    })
  },
  getYearB(e) {
    let yearB = e.detail.value;
    this.setData({
      [`param.yearB`]: yearB
    })
  },
  getDownB(e) {
    let downB = e.detail.value;
    this.setData({
      [`param.downB`]: downB
    })
  },
  getMoneyBTab(e) {
    let rate = e.detail.value;
    let num = rate - 0;
    if (isNaN(num)) {
      this.setData({
        [`param.moneyB`]: this.data.param.moneyB
      })
    } else {
      let str = null;
      if (rate.indexOf(".") == -1) {
        str = rate;
      } else {
        let a = rate.split('.');
        let b = a[1].slice(0, 2);
        str = a[0] + '.' + b;
      }
      this.setData({
        [`param.moneyB`]: str
      })
    }
  },
  getPriceBTab(e) {
    let rate = e.detail.value;
    let num = rate - 0;
    if (isNaN(num)) {
      this.setData({
        [`param.priceB`]: this.data.param.priceB
      })
    } else {
      let str = null;
      if (rate.indexOf(".") == -1) {
        str = rate;
      } else {
        let a = rate.split('.');
        let b = a[1].slice(0, 2);
        str = a[0] + '.' + b;
      }
      this.setData({
        [`param.priceB`]: str
      })
    }
  },
  getAreaBTab(e) {
    let rate = e.detail.value;
    let num = rate - 0;
    if (isNaN(num)) {
      this.setData({
        [`param.areaB`]: this.data.param.areaB
      })
    } else {
      let str = null;
      if (rate.indexOf(".") == -1) {
        str = rate;
      } else {
        let a = rate.split('.');
        let b = a[1].slice(0, 2);
        str = a[0] + '.' + b;
      }
      this.setData({
        [`param.areaB`]: str
      })
    }
  },
  getRateB(e) {
    let rateB = e.detail.value;
    this.setData({
      [`param.rateB`]: rateB
    })
  },
  onRateTab(e) {
    let i = e.currentTarget.dataset.idx - 0;
    wx.navigateTo({
      url: '../rate/rate?i=' + i
    })
  },
  onSendTab() {
    if (this.data.param.navChoose == 0 && this.data.param.calChoose == 0) {
      if (this.data.param.moneyA < 0 || this.data.param.moneyA == '') {
        wx.showToast({
          title: '请输入正确的贷款总额！',
          icon: 'none',
          duration: 1000
        })
        return;
      }
    }
    if (this.data.param.navChoose == 0 && this.data.param.calChoose == 1) {
      if (this.data.param.priceA < 0 || this.data.param.priceA == '') {
        wx.showToast({
          title: '请输入正确的单价！',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      if (this.data.param.areaA < 0 || this.data.param.areaA == '') {
        wx.showToast({
          title: '请输入正确的面积！',
          icon: 'none',
          duration: 1000
        })
        return;
      }
    }
    if (this.data.param.navChoose == 1 && this.data.param.calChoose == 0) {
      if (this.data.param.moneyB < 0 || this.data.param.moneyB == '') {
        wx.showToast({
          title: '请输入正确的贷款总额！',
          icon: 'none',
          duration: 1000
        })
        return;
      }
    }
    if (this.data.param.navChoose == 1 && this.data.param.calChoose == 1) {
      if (this.data.param.priceB < 0 || this.data.param.priceB == '') {
        wx.showToast({
          title: '请输入正确的单价！',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      if (this.data.param.areaB < 0 || this.data.param.areaB == '') {
        wx.showToast({
          title: '请输入正确的面积！',
          icon: 'none',
          duration: 1000
        })
        return;
      }
    }
    if (this.data.param.navChoose == 2) {
      if (this.data.param.moneyA < 0 || this.data.param.moneyA == '') {
        wx.showToast({
          title: '请输入正确的商业贷款总额！',
          icon: 'none',
          duration: 1000
        })
        return;
      }
    }
    if (this.data.param.navChoose == 2) {
      if (this.data.param.moneyB < 0 || this.data.param.moneyB == '') {
        wx.showToast({
          title: '请输入正确的公积金贷款总额！',
          icon: 'none',
          duration: 1000
        })
        return;
      }
    }
    let s = JSON.stringify(this.data.param);
    wx.navigateTo({
      url: '../calculatorlast/calculatorlast?param=' + s
    })
  }
})