# 舆情获取及分析系统

## 提前看

舆情获取及分析系统所需功能需求包括：（1）服务端系统在云端自动化地 爬取舆情热点信息，网络数据通过数据清洗及预处理后存入数据库；（2）后台 数据管理系统的后台登录后需要划分权限，包括我在功能上设置了一般管理员权 限，以及在后台设置了超级管理员权限等权限，这也对整个系统的权限功能上进 行了划分。管理员需要对注册用户信息进行管理，需要能够对数据库所爬取数据 进行编辑更新等操作；（3）前端部分需要在 App 上对舆情列表及舆情分析结果 进行展示。用户可以在分析结果页面看到网友对该条舆情的摘要，评论的词云图、 情感分析、性别比例、舆情受关注趋势等信息。并且用户可在 App 进行注册登 录，包含、评论、点赞、分享等功能。包含 App 升级推送功能。

## 一、调试启动

> 1. 试用 HbuilderX 进行网页调试，调试进行apk云打包
>
> 2. 根据uni-clould目录的配置对应创建云函数服务

## 二、demo展示

[App下载地址](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-30331736-ca44-457d-9711-10cf04b51729/a8333895-b52b-41a1-b48e-f40382fc1b26.apk)

1. App展示动图

![App展示动图](https://image.hansking.cn/uPic/202207/Kapture%202022-07-14%20at%2023.54.02-VtsHvP.gif)

2. App展示图片

![App展示图片](https://image.hansking.cn/uPic/202207/%E6%88%AA%E5%B1%8F2022-07-14%2023.57.55-ZqPrap.png)

3. admin后台

   ![截屏2022-07-14 23.07.50](https://image.hansking.cn/uPic/202207/%E6%88%AA%E5%B1%8F2022-07-14%2023.07.50-VFTE8h.png)

   ![截屏2022-07-14 23.08.33](https://image.hansking.cn/uPic/202207/%E6%88%AA%E5%B1%8F2022-07-14%2023.08.33-w8hWCC.png)

4. 应用推送和ota升级
