# 阿里云OSS静态网站托管部署指南

## 📋 项目简介

三年级语文复习应用 - 使用阿里云OSS对象存储部署静态网站,配合CDN加速,实现国内高速访问。

---

## 🎯 方案优势

- ✅ **成本极低**:OSS存储费用约0.12元/GB/月,流量费用按实际使用计费
- ✅ **无需备案**(使用阿里云提供的临时域名)
- ✅ **国内极速**:阿里云CDN覆盖全国,访问速度快
- ✅ **自动HTTPS**:自动配置SSL证书
- ✅ **高可用性**:99.995%的数据可靠性
- ✅ **简单易用**:网页界面操作,也支持命令行工具

---

## 📝 部署步骤

### 第一步:注册阿里云账号

1. 访问 [阿里云官网](https://www.aliyun.com)
2. 点击右上角"免费注册"按钮
3. 使用手机号或淘宝账号完成注册
4. **实名认证**(必须,但不需要备案):
   - 登录后,点击右上角头像 → "实名认证"
   - 选择"个人实名认证"
   - 上传身份证正反面照片
   - 等待审核通过(通常5-30分钟)

---

### 第二步:开通对象存储OSS服务

1. 登录阿里云控制台
2. 搜索并进入 **"对象存储OSS"**
   - 直接访问:https://oss.console.aliyun.com
3. 如果是首次使用,点击 **"立即开通"**
4. 阅读并同意服务协议
5. 开通成功后进入OSS管理控制台

---

### 第三步:创建存储空间(Bucket)

1. 在OSS控制台,点击 **"创建Bucket"** 或 **"Bucket列表"** → **"创建Bucket"**

2. 填写Bucket配置:
   - **Bucket名称**:`grade3-chinese-2024`(全局唯一,如果被占用请换个名称)
   - **地域**:选择离你最近的地域(如"华东1(杭州)"或"华北2(北京)")
   - **存储类型**:选择 **"标准存储"**
   - **读写权限**:选择 **"公共读"**(重要!)
   - **服务端加密**:不开启
   - **实时日志查询**:不开启(节省费用)
   - **定时备份**:不开启

3. 点击 **"确定"** 创建

4. 记住你的Bucket外网访问域名,格式类似:
   ```
   https://grade3-chinese-2024.oss-cn-hangzhou.aliyuncs.com
   ```
   **这就是你的临时访问地址,无需备案!**

---

### 第四步:配置静态网站托管

1. 进入刚创建的Bucket详情页
2. 点击左侧菜单 **"基础设置"** → **"静态页面"**
3. 点击 **"设置"** 按钮
4. 配置静态网站托管:
   - **默认首页**:填写 `index.html`
   - **默认404页**:填写 `index.html`(单页应用推荐)
5. 点击 **"保存"**

---

### 第五步:上传文件

#### 方法A:使用网页控制台上传(适合首次部署)

1. 在Bucket详情页,点击 **"文件管理"**
2. 准备要上传的文件:
   ```
   三年级上学期期末/
   ├── index.html          ← 首页(必须)
   ├── css/                ← 样式文件夹
   ├── js/                 ← JavaScript文件夹
   ├── data/               ← 数据文件夹
   ├── pages/              ← 页面文件夹
   └── assets/             ← 资源文件夹(如果有)
   ```

3. **上传方式1 - 逐个上传**:
   - 点击 **"上传文件"** 按钮
   - 选择 `index.html`,点击"开始上传"
   - 点击 **"新建目录"**,创建 `css` 目录
   - 进入 `css` 目录,上传 `css/` 下的所有文件
   - 重复以上步骤,上传其他文件夹

4. **上传方式2 - 批量上传**(推荐):
   - 安装 [ossbrowser工具](https://github.com/aliyun/oss-browser)
   - 使用工具连接你的Bucket
   - 直接拖拽整个项目文件夹上传

**注意**:
- 必须保持原有的目录结构
- 不要上传 `.git` 文件夹
- 不要上传 `node_modules` 文件夹(如果有)
- 不要上传 `TencentOOS/` 或 `TencentCloudBase/` 这些备份文件夹

---

#### 方法B:使用命令行工具ossutil(推荐,更快)

**1. 安装ossutil工具**

macOS/Linux:
```bash
# 下载ossutil
wget https://gosspublic.alicdn.com/ossutil/1.7.18/ossutil-v1.7.18-mac-arm64.zip
# 或 Intel 芯片 Mac:
# wget https://gosspublic.alicdn.com/ossutil/1.7.18/ossutil-v1.7.18-mac-amd64.zip

# 解压
unzip ossutil-v1.7.18-mac-arm64.zip

# 移动到系统路径
sudo mv ossutil64 /usr/local/bin/ossutil
sudo chmod +x /usr/local/bin/ossutil
```

Windows:
- 下载 [ossutil64.exe](https://gosspublic.alicdn.com/ossutil/1.7.18/ossutil-v1.7.18-windows-amd64.zip)
- 解压后将 `ossutil64.exe` 放到任意目录
- 将该目录添加到系统环境变量PATH

**2. 配置ossutil**

```bash
# 运行配置命令
ossutil config

# 按提示输入以下信息:
# - Endpoint: oss-cn-hangzhou.aliyuncs.com (根据你的地域选择)
# - AccessKeyId: 你的AccessKey ID
# - AccessKeySecret: 你的AccessKey Secret
```

**获取AccessKey**:
1. 登录阿里云控制台
2. 鼠标悬停在右上角头像 → **"AccessKey管理"**
3. 如果没有,点击 **"创建AccessKey"**
4. 复制 `AccessKey ID` 和 `AccessKey Secret`(注意保密!)

**3. 上传项目文件**

```bash
# 进入项目目录
cd "/Users/duoji/Documents/GitClone_Projects/三年级上学期期末"

# 上传所有文件到Bucket
ossutil cp -r . oss://grade3-chinese-2024/ \
  --exclude ".git/*" \
  --exclude "TencentOOS/*" \
  --exclude "TencentCloudBase/*" \
  --exclude "*.md"

# 等待上传完成(约1-3分钟,取决于网速)
```

**4. 设置文件访问权限**

```bash
# 将所有文件设置为公共读
ossutil set-acl oss://grade3-chinese-2024/ public-read -r
```

---

### 第六步:访问你的网站

1. 使用Bucket的外网访问域名:
   ```
   https://grade3-chinese-2024.oss-cn-hangzhou.aliyuncs.com/index.html
   ```

2. 或者使用静态网站域名(如果开启了静态网站功能):
   ```
   https://grade3-chinese-2024.oss-cn-hangzhou.aliyuncs.com
   ```

3. 在浏览器中打开,你应该能看到项目首页!

---

## 🚀 开启CDN加速(可选但推荐)

CDN可以大幅提升访问速度,特别是全国各地的用户。

### 第一步:开通CDN服务

1. 搜索并进入 **"CDN"** 控制台
   - 直接访问:https://cdn.console.aliyun.com
2. 如果首次使用,点击 **"立即开通"**
3. 选择 **"按使用流量计费"**(推荐)
4. 开通成功

###第二步:添加加速域名

**注意**:这里有两个选择:

**选项1:使用阿里云提供的测试域名(无需备案)**
- 仅用于测试,有访问限制
- 不推荐生产环境使用

**选项2:使用自己的域名(需要备案)**
- 如果你有已备案的域名,可以配置CDN加速
- 步骤:
  1. 在CDN控制台添加域名
  2. 选择加速区域:"仅中国大陆"
  3. 业务类型:"图片小文件"
  4. 源站信息:选择"OSS域名",选择你的Bucket
  5. 端口:HTTPS
  6. 完成后,按提示配置域名CNAME解析

**选项3:直接使用OSS域名(推荐,无需备案)**
- 最简单的方式
- 使用Bucket的外网访问域名即可
- 访问速度已经很快,对于小型应用足够

---

## 🔧 配置CORS(如果需要跨域)

如果你的应用需要从其他域名访问OSS资源,需要配置CORS:

1. 进入Bucket详情页
2. 点击 **"权限管理"** → **"跨域设置"**
3. 点击 **"创建规则"**
4. 配置CORS规则:
   - **来源**:`*`(允许所有来源)
   - **允许Methods**:勾选 `GET`、`POST`、`HEAD`
   - **允许Headers**:`*`
   - **暴露Headers**:`ETag`、`x-oss-request-id`
5. 点击 **"确定"**

---

## 🔄 如何更新网站

### 方法A:使用网页控制台

1. 进入Bucket的"文件管理"
2. 找到要更新的文件,点击"删除"
3. 重新上传新文件

### 方法B:使用命令行(推荐)

每次修改代码后,执行:

```bash
cd "/Users/duoji/Documents/GitClone_Projects/三年级上学期期末"

# 同步更新(会覆盖同名文件,不删除额外文件)
ossutil sync . oss://grade3-chinese-2024/ \
  --exclude ".git/*" \
  --exclude "TencentOOS/*" \
  --exclude "TencentCloudBase/*" \
  --exclude "*.md" \
  --delete

# --delete 参数会删除OSS上多余的文件,保持同步
```

**增量更新单个文件**:
```bash
# 只更新某个文件
ossutil cp ./pages/idiom-complete.html oss://grade3-chinese-2024/pages/idiom-complete.html

# 只更新某个文件夹
ossutil cp -r ./js/ oss://grade3-chinese-2024/js/ --update
```

---

## 📊 查看使用情况和费用

1. 进入OSS控制台
2. 点击左侧 **"费用中心"**
3. 可以查看:
   - 存储空间使用量
   - 流量使用情况
   - 请求次数
   - 费用明细

**费用预估**(以华东1为例):
- **存储费用**:约0.12元/GB/月
  - 项目大小约10MB,每月约0.001元
- **流量费用**:
  - 外网流出流量:约0.5元/GB
  - 单次访问约3MB,1000次访问约1.5元
- **请求费用**:
  - GET请求:0.01元/万次
  - PUT请求:0.1元/万次
  - 基本可以忽略不计

**总计**:月访问1000次约1.5元,非常便宜!

---

## 🔒 安全建议

### 1. AccessKey安全

- ❌ 不要将AccessKey提交到Git仓库
- ✅ 使用子账号RAM,不要使用主账号AccessKey
- ✅ 定期更换AccessKey

**创建RAM子账号**:
1. 进入 **"RAM访问控制"** 控制台
2. 创建用户,勾选"编程访问"
3. 授予权限:`AliyunOSSFullAccess`
4. 保存AccessKey ID和Secret
5. 使用RAM子账号的AccessKey配置ossutil

### 2. Bucket权限

- ✅ 只将需要公开访问的Bucket设置为"公共读"
- ✅ 敏感数据使用"私有"权限
- ✅ 使用防盗链功能(在"权限管理"中配置)

### 3. 防盗刷

1. 进入Bucket详情 → **"权限管理"** → **"防盗链"**
2. 开启防盗链
3. 添加白名单域名(允许访问的网站)
4. 开启"允许空Referer"(用户直接访问)

---

## ⚠️ 常见问题

### 1. 上传后访问显示403 Forbidden

**原因**:Bucket权限未设置为"公共读"

**解决**:
1. 进入Bucket详情 → "权限管理" → "读写权限"
2. 设置为"公共读"
3. 或使用命令:`ossutil set-acl oss://bucket-name public-read -r`

### 2. 上传后访问显示404 Not Found

**原因**:文件路径不对或未配置静态网站托管

**解决**:
- 确保根目录有 `index.html` 文件
- 确保在"基础设置"→"静态页面"中设置了默认首页
- 使用完整路径访问:`https://bucket.oss-region.aliyuncs.com/index.html`

### 3. CSS/JS文件加载失败

**原因**:文件路径不对或CORS配置问题

**解决**:
- 确保所有文件夹结构与本地一致
- 检查HTML中的文件引用路径
- 配置CORS规则(见上方"配置CORS"部分)
- 打开浏览器开发者工具(F12),查看Network标签

### 4. 访问速度慢

**原因**:未开启CDN或地域选择不当

**解决**:
- 选择离用户最近的OSS地域
- 开启CDN加速(需要备案域名)
- 或使用阿里云全球加速产品

### 5. 移动端显示异常

**原因**:可能是缓存问题

**解决**:
- 在Bucket详情 → "基础设置" → "生命周期" 中配置缓存规则
- 或在上传文件时设置 `Cache-Control` 头:
  ```bash
  ossutil cp index.html oss://bucket/index.html \
    --meta Cache-Control:no-cache
  ```

---

## 🎉 部署成功检查清单

部署完成后,请测试以下功能:

- [ ] 首页可以正常访问
- [ ] 所有题型按钮可以点击
- [ ] 题目页面可以正常显示
- [ ] 填空占位符显示为问号(?)
- [ ] 答题功能正常
- [ ] 朗读功能正常(如果浏览器支持)
- [ ] 移动端访问正常
- [ ] 完成练习后显示"✓ 已完成"标记
- [ ] 返回主页时保持滚动位置

---

## 📱 分享给学生使用

部署成功后,你可以:

1. **直接分享OSS域名**:
   ```
   https://grade3-chinese-2024.oss-cn-hangzhou.aliyuncs.com
   ```

2. **生成二维码**:
   - 使用在线工具:https://cli.im/
   - 输入你的OSS域名
   - 生成二维码并下载
   - 打印出来或发送给学生

3. **添加到手机主屏幕**:
   - iOS:Safari打开网站 → 点击分享按钮 → "添加到主屏幕"
   - Android:Chrome打开网站 → 菜单 → "添加到主屏幕"

4. **短链接服务**(可选):
   - 使用短链接服务(如新浪短链、百度短链)
   - 将长长的OSS域名转换为短链接
   - 更方便分享

---

## 🔗 相关链接

- 阿里云官网:https://www.aliyun.com
- OSS控制台:https://oss.console.aliyun.com
- OSS文档:https://help.aliyun.com/product/31815.html
- ossutil工具:https://help.aliyun.com/document_detail/120075.html
- ossbrowser工具:https://github.com/aliyun/oss-browser

---

## 💡 高级技巧

### 1. 自定义域名(需要备案)

如果你有已备案的域名,可以绑定到OSS:

1. 进入Bucket详情 → "传输管理" → "域名管理"
2. 点击"绑定域名"
3. 输入你的域名(如`study.example.com`)
4. 选择"自动添加CNAME记录"(如果域名在阿里云)
5. 完成后,使用你的域名访问网站

### 2. 启用HTTPS

1. 进入Bucket详情 → "传输管理" → "域名管理"
2. 点击已绑定域名后的"证书托管"
3. 上传SSL证书或申请免费证书
4. 开启"强制跳转HTTPS"

### 3. 图片处理

OSS支持图片在线处理(缩放、裁剪、水印等):

```
https://bucket.oss-region.aliyuncs.com/image.jpg?x-oss-process=image/resize,w_200
```

### 4. 设置防盗链

防止别人盗链你的资源:

1. 进入Bucket详情 → "权限管理" → "防盗链"
2. 添加允许访问的域名白名单
3. 开启后,只有白名单域名可以访问资源

### 5. 生命周期管理

自动清理过期文件,节省成本:

1. 进入Bucket详情 → "基础设置" → "生命周期"
2. 创建规则,设置文件过期时间
3. 可以设置自动删除或转换为低频存储

---

## 🆚 阿里云OSS vs 腾讯云CloudBase

| 对比项 | 阿里云OSS | 腾讯云CloudBase |
|--------|-----------|-----------------|
| 存储费用 | 0.12元/GB/月 | 免费5GB |
| 流量费用 | 0.5元/GB | 免费5GB/月 |
| 操作便捷性 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 国内速度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 免费额度 | 无 | 有(5GB) |
| 需要备案 | 否(使用OSS域名) | 否(使用临时域名) |
| 适用场景 | 长期使用、高流量 | 个人学习、小流量 |

**建议**:
- 个人学习、月访问<1000次:选择腾讯云CloudBase(免费)
- 长期使用、月访问>5000次:选择阿里云OSS(更稳定)
- 企业级应用:选择阿里云OSS + CDN

---

## 📞 遇到问题?

如果遇到任何问题:

1. 查看阿里云官方文档:https://help.aliyun.com/product/31815.html
2. 访问阿里云开发者社区:https://developer.aliyun.com/
3. 联系阿里云客服(控制台右下角)
4. 使用工单系统(控制台 → "工单" → "提交工单")

---

## 🎓 学习资源

- [OSS快速入门视频教程](https://help.aliyun.com/document_detail/31883.html)
- [OSS最佳实践](https://help.aliyun.com/document_detail/31860.html)
- [静态网站托管教程](https://help.aliyun.com/document_detail/31872.html)

---

**祝你部署顺利!🎉**

部署完成后,你的三年级语文复习应用就可以在全国范围内高速访问了!
