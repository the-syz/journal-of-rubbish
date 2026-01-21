# Journal of Rubbish

一个虚构的学术期刊投稿网站，仅供娱乐用途。

## 项目介绍

Journal of Rubbish (JOR) 是一个基于静态网页技术构建的虚构学术期刊网站，旨在为用户提供一个模拟的学术期刊浏览和搜索平台。

### 功能特点

- 📚 文章列表展示：支持分页加载和无限滚动
- 🔍 文章搜索：支持标题和作者搜索，带有搜索建议
- 📝 文章详情页：展示文章的详细信息、摘要、参考文献等
- 📱 响应式设计：适配不同屏幕尺寸
- 🎯 期刊标签：包含"被打核心"、"垃科院一区silence"、"nothing"等标签
- 📧 联系表单：支持发送模拟消息
- 👥 编辑团队：展示期刊的编辑团队信息

## 项目结构

```
├── index.html          # 首页
├── about.html          # 关于我们页面
├── contact.html        # 联系我们页面
├── search-results.html # 搜索结果页面
├── 404.html            # 404错误页面
├── docs/               # GitHub Pages部署目录
├── css/                # CSS样式文件
├── js/                 # JavaScript文件
│   ├── main.js         # 主脚本
│   ├── search.js       # 搜索功能
│   ├── article-renderer.js # 文章渲染
│   ├── data-loader.js  # 数据加载
│   └── modal.js        # 弹窗功能
├── data/               # 数据文件
│   └── articles.json   # 文章数据
├── assets/             # 静态资源
├── articles/           # 文章详情页
│   ├── article-template.html # 文章模板
│   └── generate-article-pages.js # 文章页面生成脚本
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 如何本地运行

### 方法一：使用Python内置服务器

```bash
# 在项目根目录执行
python -m http.server 8000

# 然后在浏览器中访问 http://localhost:8000
```

### 方法二：使用其他静态服务器

您也可以使用任何静态文件服务器来运行这个项目，例如：
- Node.js的 `http-server`
- PHP的 `php -S localhost:8000`
- 或者直接在浏览器中打开 `index.html` 文件

## 如何部署到GitHub Pages

1. **准备部署文件**：
   - 所有静态文件都已复制到 `docs` 目录
   - 包含 `.nojekyll` 文件以禁用GitHub Pages的Jekyll处理

2. **推送代码**：
   ```bash
   git add .
   git commit -m "Update for deployment"
   git push
   ```

3. **配置GitHub Pages**：
   - 登录GitHub，进入项目仓库
   - 点击 "Settings" → "Pages"
   - 在 "Source" 选项中选择 "Deploy from a branch"
   - 在 "Branch" 选项中选择 "main" 分支和 "/docs" 目录
   - 点击 "Save" 保存设置

4. **访问网站**：
   - 部署完成后，您可以通过以下URL访问网站：
   - `https://[username].github.io/journal-of-rubbish/`

## 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **数据存储**：JSON文件
- **部署**：GitHub Pages
- **开发工具**：
  - 编辑器：任意文本编辑器
  - 本地服务器：Python `http.server`
  - 版本控制：Git

## 数据管理

### 文章数据

文章数据存储在 `data/articles.json` 文件中，包含以下字段：
- `id`：文章ID
- `title`：文章标题
- `authors`：作者信息（姓名、 affiliation等）
- `abstract`：摘要
- `publication_date`：发表日期
- `doi`：DOI号
- `keywords`：关键词
- `content`：正文内容
- `references`：参考文献
- `tags`：文章标签

### 生成文章详情页

运行以下命令生成文章详情页：

```bash
node articles/generate-article-pages.js
```

这将根据 `articles/article-template.html` 模板为每篇文章生成对应的HTML文件。

## 注意事项

1. **本项目仅供娱乐**：所有内容均为虚构，请勿当真
2. **数据存储**：使用JSON文件存储数据，不支持动态更新
3. **搜索功能**：基于前端实现，搜索范围仅限于本地数据
4. **表单提交**：联系表单仅为模拟功能，不会实际发送邮件
5. **GitHub Pages路径**：确保所有链接使用相对路径，避免404错误

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件

## 免责声明

本网站内容纯属虚构，仅供娱乐用途。任何与真实学术期刊、机构或个人的相似之处均为巧合。

---

© 2025 Journal of Rubbish. All rights reserved.
