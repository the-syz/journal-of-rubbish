const fs = require('fs');
const path = require('path');

// 读取文章数据
const articlesPath = path.join(__dirname, 'data', 'articles.json');
const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
const articles = articlesData.articles;

// 读取模板文件
const templatePath = path.join(__dirname, 'articles', 'article-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// 生成文章详情页
articles.forEach((article, index) => {
  // 查找上一篇和下一篇文章
  const prevArticle = index > 0 ? articles[index - 1] : null;
  const nextArticle = index < articles.length - 1 ? articles[index + 1] : null;

  // 替换模板中的变量
  let html = template
    .replace(/\{\{id\}\}/g, article.id)
    .replace(/\{\{title\}\}/g, article.title)
    .replace(/\{\{abstract\}\}/g, article.abstract)
    .replace(/\{\{publication_date\}\}/g, article.publication_date)
    .replace(/\{\{doi\}\}/g, article.doi)
    .replace(/\{\{keywords\.join\('\, '\)\}\}/g, article.keywords.join(', '))
    .replace(/\{\{content\}\}/g, article.content || '<p>本文暂无详细内容。</p>');

  // 替换作者信息
  const authorsHtml = article.authors
    .map(author => {
      return `<div class="author">
              <span class="author-name">${author.name}</span>
              <span class="author-affiliation">${author.affiliation}</span>
            </div>`;
    })
    .join('');
  html = html.replace(/\{\{#each authors\}\}[\s\S]*?\{\{\/each\}\}/g, authorsHtml);

  // 替换标签（如果存在）
  let tagsHtml = '';
  if (article.tags) {
    tagsHtml = article.tags
      .map(tag => {
        let tagClass = '';
        switch (tag) {
          case '被打核心':
            tagClass = 'tag-core';
            break;
          case '垃科院一区silence':
            tagClass = 'tag-silence';
            break;
          case 'nothing':
            tagClass = 'tag-nothing';
            break;
          default:
            tagClass = '';
        }
        return `<span class="tag ${tagClass}">${tag}</span>`;
      })
      .join('');
  }
  html = html.replace(/\{\{#each tags\}\}[\s\S]*?\{\{\/each\}\}/g, tagsHtml);

  // 替换参考文献
  const referencesHtml = article.references
    .map(ref => {
      // 格式化参考文献为标准格式
      const refText = `${ref.authors}. (${ref.year}). ${ref.title}. ${ref.journal}, ${ref.volume}, ${ref.pages}.`;
      return `<li>${refText}</li>`;
    })
    .join('');
  html = html.replace(/\{\{#each references\}\}[\s\S]*?\{\{\/each\}\}/g, referencesHtml);

  // 替换导航链接
  let navigationHtml = '';
  if (prevArticle) {
    navigationHtml += `<a href="article-${prevArticle.id}.html" class="nav-link prev">上一篇：${prevArticle.title}</a>`;
  } else {
    navigationHtml += `<span class="nav-link disabled">没有上一篇</span>`;
  }
  if (nextArticle) {
    navigationHtml += `<a href="article-${nextArticle.id}.html" class="nav-link next">下一篇：${nextArticle.title}</a>`;
  } else {
    navigationHtml += `<span class="nav-link disabled">没有下一篇</span>`;
  }
  // 替换整个导航部分
  html = html.replace(
    /\<div class="article-navigation"\>[\s\S]*?\<\/div\>/g,
    `<div class="article-navigation">${navigationHtml}</div>`
  );

  // 生成文件路径
  const outputPath = path.join(__dirname, 'articles', `article-${article.id}.html`);

  // 写入文件
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`生成文章详情页：article-${article.id}.html`);
});

console.log(`\n所有文章详情页生成完成！共生成 ${articles.length} 篇文章。`);
