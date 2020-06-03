const app = getApp();
Page({
  data: {},
  onLoad(o) {
    let param = JSON.parse(o.param);
    this.setData({
      param
    })
    this.onLoadData();
  },
  onLoadData() {
    if (this.data.param.navChoose == 0) {
      this.calA();
    } else if (this.data.param.navChoose == 1) {
      this.calB();
    } else if (this.data.param.navChoose == 2) {
      this.calA();
    }
  },
  calA() {
    let param = this.data.param;
    let show = {};
    show.year = param.yearA - 0; // 贷款年限
    show.month = show.year * 12; // 还款月数
    if (param.calChoose == 0) {
      show.allMoney = (param.moneyA - 0) * 10000; // 贷款金额
    } else {
      show.allMoney = (param.priceA - 0) * (param.areaA - 0) * (10 - param.downA) / 10; // 贷款金额
    }
    let rate = (param.rateA - 0) / 1200; // 月利率
    let rateb = Math.pow((1 + rate), show.month); // (1+月利率)^还款月数
    show.repayA = (show.allMoney * rate * rateb) / (rateb - 1); // 每月还款（等额本息）
    show.interestA = show.month * show.repayA - show.allMoney; // 利息总额（等额本息）
    show.allA = show.interestA + show.allMoney; // 还款总额（等额本息）

    show.repayB = (show.allMoney / show.month) + (show.allMoney - 0) * rate; // 首月还款（等额本金）
    show.interestB = ((show.allMoney / show.month + show.allMoney * rate) + show.allMoney / show.month * (1 + rate)) / 2 * show.month - show.allMoney; // 利息总额（等额本金）
    show.allB = show.interestB + show.allMoney; //  还款总额（等额本金）
    show.dec = show.allMoney / show.month * rate; // 月供递减额
    show.allMoney = show.allMoney / 10000;
    show.repayA = (show.repayA - 0).toFixed(2);
    show.interestA = ((show.interestA - 0) / 10000).toFixed(2);
    show.allA = ((show.allA - 0) / 10000).toFixed(2);
    show.repayB = (show.repayB - 0).toFixed(2);
    show.interestB = ((show.interestB - 0) / 10000).toFixed(2);
    show.allB = ((show.allB - 0) / 10000).toFixed(2);
    show.dec = (show.dec - 0).toFixed(2);
    if (this.data.param.navChoose == 2) {
      this.setData({
        show1: show
      })
    } else {
      this.setData({
        show
      })
    }
    if (this.data.param.navChoose == 2) {
      this.calB();
    }
  },
  calB() {
    let param = this.data.param;
    let show = {};
    show.year = param.yearB - 0; // 贷款年限
    show.month = show.year * 12; // 还款月数
    if (param.calChoose == 0) {
      show.allMoney = (param.moneyB - 0) * 10000; // 贷款金额
    } else {
      show.allMoney = (param.priceB - 0) * (param.areaB - 0) * (10 - param.downB) / 10; // 贷款金额
    }
    let rate = (param.rateB - 0) / 1200; // 月利率
    let rateb = Math.pow((1 + rate), show.month); // (1+月利率)^还款月数
    show.repayA = (show.allMoney * rate * rateb) / (rateb - 1); // 每月还款（等额本息）
    show.interestA = show.month * show.repayA - show.allMoney; // 利息总额（等额本息）
    show.allA = show.interestA + show.allMoney; // 还款总额（等额本息）

    show.repayB = (show.allMoney / show.month) + (show.allMoney - 0) * rate; // 首月还款（等额本金）
    show.interestB = ((show.allMoney / show.month + show.allMoney * rate) + show.allMoney / show.month * (1 + rate)) / 2 * show.month - show.allMoney; // 利息总额（等额本金）
    show.allB = show.interestB + show.allMoney; //  还款总额（等额本金）
    show.dec = show.allMoney / show.month * rate; // 月供递减额
    show.allMoney = show.allMoney / 10000;
    show.repayA = (show.repayA - 0).toFixed(2);
    show.interestA = ((show.interestA - 0) / 10000).toFixed(2);
    show.allA = ((show.allA - 0) / 10000).toFixed(2);
    show.repayB = (show.repayB - 0).toFixed(2);
    show.interestB = ((show.interestB - 0) / 10000).toFixed(2);
    show.allB = ((show.allB - 0) / 10000).toFixed(2);
    show.dec = (show.dec - 0).toFixed(2);
    if (this.data.param.navChoose == 2) {
      let shows = {
        repayA: (param.moneyA - 0) + (param.moneyB - 0),
        repayB: (param.moneyA - 0) + (param.moneyB - 0),
        interestA: ((this.data.show1.interestA - 0) + (show.interestA - 0)).toFixed(2),
        interestB: ((this.data.show1.interestB - 0) + (show.interestB - 0)).toFixed(2),
        allA: ((this.data.show1.allA - 0) + (show.allA - 0)).toFixed(2),
        allB: ((this.data.show1.allB - 0) + (show.allB - 0)).toFixed(2)
      }
      this.setData({
        show2: show,
        show: shows
      })
    } else {
      this.setData({
        show
      })
    }
  },
  onNavTab(e) {
    let repayChoose = e.currentTarget.dataset.idx - 0;
    this.setData({
      [`param.repayChoose`]: repayChoose
    })
  },

})