<br />

<p align="center">
  <img src="./src/assets/nologo.png" alt="Logo" width="156" height="156">
  <h3 align="center">没有图标</h3>
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

## setup

```shell
git clone https://github.com/0xaF1c/cloud-music-redux.git

yarn && yarn serve

# using npm

npm install && npm run serve
```

### backend
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
