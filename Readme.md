# 基于微信小程序云开发-租房微信小程序-带管理员后台

![image](https://img.shields.io/badge/TAG-云开发-blue.svg) ![image](https://img.shields.io/badge/TAG-租房-blue.svg) ![image](https://img.shields.io/badge/TAG-微信小程序-blue.svg) ![image](https://img.shields.io/badge/TAG-带管理后台-blue.svg)

[![image](https://img.shields.io/badge/author-lx164-orange.svg)](https://github.com/lx164/) [![image](https://img.shields.io/badge/CSDN-lx9625_鹤鹤-orange.svg)](https://blog.csdn.net/github_38967228) [![image](https://img.shields.io/badge/博客园-LiangSenCheng小森森-orange.svg)](https://www.cnblogs.com/LiangSenCheng/)


项目地址：https://github.com/lx164/house

***如需小程序定制「包括但不限于课设、毕设等」可联系我，联系方式请点击> [博客园](https://www.cnblogs.com/LiangSenCheng)< 的首页；***

***温馨提醒***

> 本项目`已经申请软件著作权登记，我们拥有完整的版权`，请勿商用(请使用商用版)、请勿售卖、请勿售卖、请勿售卖，开源版 不提供无偿的 部署指导、维护修改服务。

***如需商用升级版，请联系我微信，微信二维码在这里的右上角： https://www.cnblogs.com/LiangSenCheng/p/11083714.html*** 

> 备用联系方式：[点击这里](https://blog-static.cnblogs.com/files/LiangSenCheng/wechat.gif)

1. 本项目使用 `LGPL-3.0`协议，***请勿商用、请勿售卖、请勿售卖、请勿售卖***，仅适用于学习交流，并且`不提供无偿的`、 `不提供无偿的`、 `不提供无偿的` 维护修改服务（但可提issue）。***若直接将本项目用于商用，因本项目带来的所有后果由使用者自行承担。***

2. ***本项目不在任何平台出售,各个平台出售的均为盗版,如有发现请积极举报！***

***在此奉劝某些人，请尊重作者的劳动成果，做人积点德吧！最近发现有人拿我的源码进行二次分发，不但不标注源码出处，甚至以此牟利。如果你花了钱购买本程序，请积极举报！***

***不要只是白嫖 ,如果帮到你了麻烦点个Start (不管github[点这里](https://github.com/lx164/house), 还是gitee[点这里](https://gitee.com/LiangSenCheng/house)都可以)***

> 发现有问题？欢迎加我微信一起探讨，或者直接提Issues
> 无法下载或者下载太慢？可以直接找我要安装包；
> 
> 联系方式在这里的首页：https://www.cnblogs.com/LiangSenCheng/p/11083714.html

- [其他开源项目]

1. 表白墙 https://github.com/lx164/SayLove
2. https://www.cnblogs.com/LiangSenCheng/p/12543230.html

## 项目简介

本项目是我花了大概一个月时间做完之后一直遗忘在了硬盘里，这几天才想起来，故顺便整理一下开源了。

> 项目虽然没有做的很完整，但是整体的数据架构还算是可以的，可以很容易进行功能完善和添加新功能。里面还有很多可以完善的地方，比如 `公司资质` 页面可以做的更加精细一些，`房子详情页` 可以添加地图之类的内容等。

原本是别人找我帮一家中介小店些的一个租房小程序，对方没给设计图、也没有提具体需求，只是让我凭感觉来做。由于没有写过这方面的小程序，也没有很好的规划页面布局，所以UI方面稍微差了点。在项目快完成的时候，介绍的那个人跑路了，所以就没有后续了，想着与其直接删除还不如开源分享给大家一起讨论学习。

这个项目的经历也让我明白了一些事情，就是如果别人委托自己帮做项目的时候，不管项目的规模如何，在接受委托前一定要考虑清楚。特别是没有付定金的这种委托，一定要谨慎，不要期望那种说你先做着后面再谈钱，哪怕是跟你认识的人也是一样要谨慎。还有就是不提明确需求的也不要轻易接受，这种人很容易中途变卦的。如果不想清楚的话，机会浪费时间又浪费精力。

> 本程序已经经过测试，拿来按照说明简单配置就可以直接使用,界面可以自己进行修改。本人热爱小程序，目前上线并维护的有两个，后面看情况再找时间进行开源。
由于本人的能力有限，还有很多地方没法完善，望指正！

## 软著证书

本项目`已经申请软件著作权登记，我们拥有完整的版权`，请勿商用(请使用商用版)、请勿售卖、请勿售卖、请勿售卖，开源版 不提供无偿的 部署指导、维护修改服务。

![](https://img2024.cnblogs.com/blog/1697917/202401/1697917-20240105141506802-1828502164.png)

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

具体配置过程请参考：https://www.cnblogs.com/LiangSenCheng/p/13040899.html

## 界面预览

![water-01](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/b8f176576e685518616c7a786131d3e6.png)
![water-02](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/6fc3206ed4d52914179ec43694ba0d62.png)
![water-03](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/064e416adbee8b7382442187c6833dfb.png)
![water-04](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/5477a22d419e0ff770be60823ae7e1fa.png)
![water-05](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/df0c12df7528c2adef3d702397671124.png)
![water-06](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/de534a06e30eabc874fe3d6f109de46e.png)
![water-07](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/01e8f63ea6f4bba88f63a46412202afa.png)
![water-08](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/1248bdcde60192b2df17332e9273db90.png)
![water-09](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/878fd18bda8ae3fb49c3341d3fbb95e8.png)
![water-10](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/762b67c8776c15222ba4a3035eee5e0b.png)
![water-11](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/91fec8f301452eaf896bc09f712eab75.png)
![water-12](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/f7ffd1a950e9a7ac98b8dad7d795bef4.png)
![water-13](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/eafd1ef698647f696273da77c139a036.png)
![water-14](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/c8d724db4867eea7f99fb80a3f33d4b2.png)
![water-15](https://img-hello-world.oss-cn-beijing.aliyuncs.com/imgs/37a32b9c658d16fdee444d4891e758ec.png)

## 结语

欢迎一起探讨，如果你觉得还可以，您可以给我点一个start，或者赞赏我
![zanshang](https://cdn.jsdelivr.net/gh/LiangSenCheng/blog-img/app/rent-house/zanshang.png)

## Strat趋势

[![Stargazers over time](https://starchart.cc/lx164/house.svg)](https://starchart.cc/lx164/house)
