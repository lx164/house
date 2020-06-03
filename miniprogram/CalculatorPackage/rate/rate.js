const app = getApp();
Page({
  data: {
    rateA: [{
      title: '最新商业贷款基准利率（4.9%）',
      val: 4.9
    }, {
      title: '最新商业贷款利率上浮20%（5.88%）',
      val: 5.88
    }, {
      title: '最新商业贷款利率上浮15%（5.64%）',
      val: 5.64
    }, {
      title: '最新商业贷款利率上浮10%（5.39%）',
      val: 5.39
    }, {
      title: '最新商业贷款利率上浮5%（5.15%）',
      val: 5.15
    }, {
      title: '最新商业贷款利率下浮5%（4.66%）',
      val: 4.66
    }, {
      title: '最新商业贷款利率下浮10%（4.41%）',
      val: 4.41
    }, {
      title: '最新商业贷款利率下浮15%（4.17%）',
      val: 4.17
    }, {
      title: '最新商业贷款利率下浮20%（3.92%）',
      val: 3.92
    }, {
      title: '最新商业贷款利率下浮30%（3.43%）',
      val: 3.43
    }],
    rateB: [{
      title: '最新公积金基准利率（3.25%）',
      val: 3.25
    }, {
      title: '最新公积金利率上浮20%（3.9%）',
      val: 3.9
    }, {
      title: '最新公积金利率上浮10%（3.58%）',
      val: 3.58
    }],
    c: {
      a: {rate: 4.9,rates: 1},
      b: { rate: 3.25, rates: 1}
    }
  },
  onLoad(o) {
    this.setData({
      i: o.i
    })
    let c = wx.getStorageSync('calculate');
    if (c != '') {
      this.setData({
        c
      })
      if (o.i == 0) {
        for (let i in this.data.rateA) {
          if (this.data.rateA[i].val == c.a.rate && c.a.rates == 1) {
            this.setData({
              choose: i
            })
          }
        }
      } else {
        for (let i in this.data.rateB) {
          if (this.data.rateB[i].val == c.b.rate && c.b.rates == 1) {
            this.setData({
              choose: i
            })
          }
        }
      }
    }
  },
  onGetRateTab(e) {
    let idx = e.currentTarget.dataset.idx;
    let cs = this.data.c;
    if (this.data.i == 0) {
      this.setData({
        [`c.a.rate`]: this.data.rateA[idx].val,
        [`c.a.rates`]: 1
      })
    } else {
      this.setData({
        [`c.b.rate`]: this.data.rateB[idx].val,
        [`c.b.rates`]: 1
      })
    }
    wx.setStorageSync('calculate', this.data.c);
    wx.navigateBack({
      delta: 1
    })
  },
  getRateTab(e) {
    let rate = e.detail.value;
    let num = rate - 0;
    if (this.data.i == 0) {
      if (isNaN(num)) {
        this.setData({
          [`c.a.rate`]: this.data.c.a.rate
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
          [`c.a.rate`]: str
        })
      }
    } else {
      if (isNaN(num)) {
        this.setData({
          [`c.b.rate`]: this.data.c.a.rate
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
          [`c.b.rate`]: str
        })
      }
    }
  },
  getRatesTab(e) {
    let rate = e.detail.value;
    let num = rate - 0;
    if (this.data.i == 0) {
      if (isNaN(num)) {
        this.setData({
          [`c.a.rates`]: this.data.c.a.rates
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
          [`c.a.rates`]: str
        })
      }
    } else {
      if (isNaN(num)) {
        this.setData({
          [`c.b.rates`]: this.data.c.b.rates
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
          [`c.b.rates`]: str
        })
      }
    }
  },
  onCheckTab() {
    if (this.data.c.a.rate <= 0 || this.data.c.b.rate <= 0) {
      wx.showToast({
        title: '请输入正确的利率',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (this.data.c.a.rates <= 0 || this.data.c.b.rates <= 0) {
      wx.showToast({
        title: '请输入正确的倍数',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    wx.setStorageSync('calculate', this.data.c);
    wx.navigateBack({
      delta: 1
    })
  }
})