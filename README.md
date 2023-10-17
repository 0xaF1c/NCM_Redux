<br />

<p align="center">
  <img src="./public/cloud_music.svg" alt="Logo" width="256" height="256">
  <h3 align="center">NCM_Redux</h3>
  <div>
    <span>Logo图标来自</span>
    <a href="https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.19af3a81ZCE8Pt&cid=30608">扁平手机图标</a>
  </div>
</p>

## Project introduce

一个基于 [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)的播放器

#### ✨特性
- ⭐ 使用了尤大推荐的 [naive-ui](https://github.com/tusen-ai/naive-ui) 组件库
- 🔍 支持搜索
- 📃 支持歌词滚动
- 🎵 网易云账号登录 
- 🎧 支持私人FM和每日推荐
- 🌙/☀️ Light / Dark 模式切换 or 自动切换
- 🖥️ 有electron桌面端 [NCM_Redux_Client](https://github.com/0xaF1c/NCM_Redux_Client)
- 📱 移动端适配 (还没做)


#### 🌟1.0 更新
- 重构了myAudio 增强了可靠性
- 歌单管理使用localstorage 从而实现了 关闭/刷新 后记忆歌单以及播放位置
- 修复了部分bug

## 📦 setup

```shell
git clone https://github.com/0xaF1c/cloud-music-redux.git

yarn && yarn serve

# using npm

npm install && npm run serve
```

### backend installing
```shell
git clone https://github.com/Binaryify/NeteaseCloudMusicApi

yarn && yarn start

# using npm

npm install && npm run start
```

### 编译和部署
#### 如需自定义api地址
需要更改 `/src/utils/request.ts` 里 axios 里的 proxy 改成自己的api地址
```shell
yarn build

# using npm
npm run build
```
