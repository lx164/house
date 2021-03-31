# 基于微信小程序云开发-租房微信小程序-带管理员后台

![image](https://img.shields.io/badge/license-MIT-green.svg) ![image](https://img.shields.io/badge/TAG-云开发-blue.svg) ![image](https://img.shields.io/badge/TAG-租房-blue.svg) ![image](https://img.shields.io/badge/TAG-微信小程序-blue.svg) ![image](https://img.shields.io/badge/TAG-带管理后台-blue.svg)

[![image](https://img.shields.io/badge/author-lx164-orange.svg)](https://github.com/lx164/) [![image](https://img.shields.io/badge/CSDN-lx9625_鹤鹤-orange.svg)](https://blog.csdn.net/github_38967228) [![image](https://img.shields.io/badge/博客园-LiangSenCheng小森森-orange.svg)](https://www.cnblogs.com/LiangSenCheng/)


项目地址：https://github.com/lx164/house

***如需小程序定制「包括但不限于课设、毕设等」可联系我，联系方式请点击> [博客园](https://www.cnblogs.com/LiangSenCheng)< 的首页；***

***温馨提醒***

***如需商用升级版，请联系我微信，微信二维码在这里的右上角： https://www.cnblogs.com/LiangSenCheng/p/11083714.html*** 

> 备用联系方式：[点击这里](https://blog-static.cnblogs.com/files/LiangSenCheng/wechat.gif)

> 本项目使用 `MIT License`协议，仅适用于学习交流，并且`不提供无偿的`、 `不提供无偿的`、 `不提供无偿的` 维护修改服务（但可提issue）。***若直接将本项目用于商用，因本项目带来的所有后果由使用者自行承担。***
> 

***在此奉劝某些人，请尊重作者的劳动成果，做人积点德吧！最近发现有人拿我的源码进行二次分发，不但不标注源码出处，甚至以此牟利。如果你花了钱购买本程序，请积极举报！***

> 发现有问题？欢迎加我微信一起探讨，或者直接提Issues
> 无法下载或者下载太慢？可以直接找我要安装包；
> 
> 联系方式在这里的首页：https://www.cnblogs.com/LiangSenCheng/p/11083714.html

[![阿里云优惠活动](https://cdn.jsdelivr.net/gh/LiangSenCheng/blog-img/blog20210228174209.jpg)](https://www.aliyun.com/activity/daily/bestoffer?userCode=sskuuw5n)

- [其他开源项目]

1. 表白墙 https://github.com/lx164/SayLove
2. https://www.cnblogs.com/LiangSenCheng/p/12543230.html

- [2020-10-24] 更新说明：

有反馈说，按照配置无法正常使用管理员，*请注意看配置过程第6步*；
主要问题是由于集合`AdminStator`中管理员信息与集合`UserList`中注册用户的信息不一致造成的*请注意看配置过程第6步*；

- [2020-06-27] 更新说明：

1. 根据反馈，解决了首页公告无法更新的问题。
2. 根据反馈，以下问题可以进行优化:

- [ ] 登录的逻辑可能无法过审核，后面会进行更新。
- [ ] 详情页面的跳转问题


- [2020-06-10] 更新说明:

有反馈说，按照配置无法正常使用，删除了原来我的云环境ID，更改成了自动识别云环境ID。使用时只需修改`app.js`里初始化云环境ID的代码即可，后面的配置过程有说明。

## 项目简介

本项目是2019年12月份左右的产物，花了大概一个月时间做完之后一直遗忘在了硬盘里，这几天才想起来，故顺便整理一下开源了。

> 项目虽然没有做的很完整，但是整体的数据架构还算是可以的，可以很容易进行功能完善和添加新功能。里面还有很多可以完善的地方，比如 `公司资质` 页面可以做的更加精细一些，`房子详情页` 可以添加地图之类的内容等。

原本是别人找我帮一家中介小店些的一个租房小程序，对方没给设计图、也没有提具体需求，只是让我凭感觉来做。由于没有写过这方面的小程序，也没有很好的规划页面布局，所以UI方面稍微差了点。在项目快完成的时候，介绍的那个人跑路了，所以就没有后续了，想着与其直接删除还不如开源分享给大家一起讨论学习。

这个项目的经历也让我明白了一些事情，就是如果别人委托自己帮做项目的时候，不管项目的规模如何，在接受委托前一定要考虑清楚。特别是没有付定金的这种委托，一定要谨慎，不要期望那种说你先做着后面再谈钱，哪怕是跟你认识的人也是一样要谨慎。还有就是不提明确需求的也不要轻易接受，这种人很容易中途变卦的。如果不想清楚的话，机会浪费时间又浪费精力。

> 本程序已经经过测试，拿来按照说明简单配置就可以直接使用,界面可以自己进行修改。本人热爱小程序，目前上线并维护的有两个，后面看情况再找时间进行开源。
由于本人的能力有限，还有很多地方没法完善，望指正！

## 目录结构

```
|--|-- cloudfunctions 云函数
|--|--|--|-- AdminManage
|--|--|--|-- Entrust
|--|--|--|-- HouseInfo
|--|--|--|-- InitInfo
|--|--|--|-- Manager
|--|--|--|-- PublishEntrust
|--|-- miniprogram 小程序页面
|--|--|--Adminpackage 管理员后台（分包）
|--|--|--|--略
|--|--|--CalculatorPackage 房贷计算器（分包）
|--|--|--|--略
|--|--|--Companypackage 主要页面（分包）
|--|--|--|--略
|--|--|--dist 一些用到的组件，只用到了一小部分
|--|--|--pages 主包（主要是底部NaviBar页面）
|--|--|--|--略
|--|--其他页面略
|--README.md
```

## 功能说明

1. 新房、租房、二手房
2. 房贷计算器
3. 公司介绍
4. 公告
5. 管理员

> 1-4 点都没啥好说的，下面主要介绍一下 `管理员后台的实现`

`管理员后台集成在了小程序端`，入口隐藏在 `个人中心` 页面 `连续点击5次` 头像名字那里，就可以进入到管理员后台，进入后台的时候会在 `云函数AdminManage`进行管理员鉴权：

- 如果不是管理员，会跳转到扫码加入管理员；
- 如果是管理员，那就跳转到管理员后台；

> 由于管理员数据库设置了权限为 `所有用户不可读写` ，因此鉴权是只能在云函数里面进行，这是第一道防线；后面在管理员后台的操作都是在云函数完成的，即使是小程序被反编译了，也不可能突破权限，安全性上还是经得住考验的。

## 配置过程

1. 直接下载源码,源码地址：https://github.com/lx164/house
或者clone项目 git clone https://github.com/lx164/house.git

2. 打开微信开发者工具，导入项目（导入的时候请选择 APP 文件夹）；

3. 填写APPID；

4. 开通云开发环境（请参考官方文档）；

5. 新建以下数据库集合,一行为一个集合名（不要写错）：

```
    AdminStator
    Collections
    CompanyInfo
    ContactList
    Entrust
    NewHouse
    Recommend
    RentingHouse
    SecondHouse
    TempCllection
    UserList
```
「注意」： 集合`AdminStator`权限设置为`所有用户不可读写`，其余的集合权限修改为：`所有用户可读，仅创建者可读写`。

6. 设置第一个初始的管理员信息，在 `AdminStator` 新建一条记录，把以下的字段内容添加到该记录中，下面（）里的内容根据你的实际情况填写：

```json
    "level":0,
    "avatarUrl":"(头像)",
    "updatetime":"(2020/06/01 06:01:18)",
    "_openid":"(管理员的openid)",
    "name":"(管理员名字)",
    "phone":"(管理员手机)"
```

> *注意* 这一点必须要格外注意：

1.  `level`字段数据类型为Number，值主要有：0 (代表超级管理员，具有添加管理员的权限)、1 (代表普通管理员，没有添加管理员权限)；
2.  `_openid` 和 `name` 必须要跟 集合`UserList` 里管理员注册的信息一致；
3.  后面如果还要添加其他管理员的话，按以下的步骤添加即可：“个人中心”——>“连续点击5次头像”——>"扫码（管理员进入后台生成的二维码）";

7. 设置公告初始数据，在 `CompanyInfo` 新建一条记录，把以下的字段内容添加到该记录中，下面（）里的内容根据你的实际情况填写：

```json
    "_id":"cb37e58c-f634-49d3-93b9-5aebec00a23a（可以不修改）",
    "introduce":"(平台/公司介绍，根据实际填写)",
    "updatetime":"2020/06/27 14:22:31",
    "editer":"（编辑人，后面会自动修改的）",
    "phone":"（编辑人手机号码，后面会自动修改的）",
    "notice":"（首页滚动公告内容） "
```

8. 上传 `cloudfunctions` 文件夹下所有的云函数，上传时选择 `上传并部署：云端安装依赖`；

9. 修改 `app.js` 大约第8行的代码，如下：

```javascript
    wx.cloud.init({
        env: '(填写你自己云环境的ID)',
        traceUser: true,
    })
```

10. 编译运行。

## 界面预览

<img src="https://s1.ax1x.com/2020/06/03/twik8g.jpg" style="" width = "50%" alt="首页" align=center><img src="https://s1.ax1x.com/2020/06/03/twiZKs.jpg" width = "50%" alt="业主委托" align=center><img src="https://s1.ax1x.com/2020/06/03/twiern.jpg" width = "50%" alt="我的" align=center><img src="https://s1.ax1x.com/2020/06/03/twAA2D.jpg" width = "50%" alt="房子列表" align=center><img src="https://s1.ax1x.com/2020/06/03/twitq1.jpg" width = "50%" alt="房子详情" align=center><img src="https://s1.ax1x.com/2020/06/03/twiaa6.jpg" width = "50%" alt="房子详情-联系中介" align=center>
<img src="https://s1.ax1x.com/2020/06/03/twidIK.png" width = "50%" alt="发布委托" align=center><img src="https://s1.ax1x.com/2020/06/03/twi0PO.jpg" width = "50%" alt="设置首页推荐" align=center><img src="https://s1.ax1x.com/2020/06/03/twi324.jpg" width = "50%" alt="房贷计算器" align=center><img src="https://s1.ax1x.com/2020/06/03/twiDRe.jpg" width = "50%" alt="设置员工信息" align=center><img src="https://s1.ax1x.com/2020/06/04/t0AX40.jpg" width = "50%" alt="添加管理员" align=center><img src="https://s1.ax1x.com/2020/06/03/twiFPS.jpg" width = "50%" alt="添加管理员二维码" align=center><img src="https://s1.ax1x.com/2020/06/03/twihi8.jpg" width = "50%" alt="新管理员扫描二维码" align=center><img src="https://s1.ax1x.com/2020/06/03/twi9VP.jpg" width = "50%" alt="房源管理" align=center><img src="https://s1.ax1x.com/2020/06/03/twPXgH.jpg" width = "50%" alt="发布委托的状态" align=center>

## 结语

欢迎一起探讨，如果你觉得还可以，您可以给我点一个start，或者赞赏我
![zanshang](https://blog-static.cnblogs.com/files/LiangSenCheng/zanshang.gif)

## Strat趋势

[![Stargazers over time](https://starchart.cc/lx164/house.svg)](https://starchart.cc/lx164/house)
