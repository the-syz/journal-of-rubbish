class ArticleRenderer {
  constructor(containerId, dataManager) {
    this.container = document.getElementById(containerId);
    this.dataManager = dataManager;
    this.currentPage = 1;
    this.pageSize = 6;
    this.allArticles = [];
  }

  async init() {
    // 加载文章数据
    await this.loadArticles();
    // 初始化加载更多按钮
    this.initLoadMore();
    // 首次渲染文章
    this.renderArticles();
  }

  async loadArticles() {
    try {
      // 从数据管理器获取所有文章
      this.allArticles = await this.dataManager.getAllArticles();
      console.log('文章数据加载完成:', this.allArticles.length, '篇文章');
    } catch (error) {
      console.error('加载文章数据失败:', error);
    }
  }

  initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.currentPage++;
        this.renderArticles();
      });
    }
  }

  renderArticles() {
    if (!this.container) return;

    // 计算当前页的文章
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageArticles = this.allArticles.slice(start, end);

    // 如果是第一页，清空容器
    if (this.currentPage === 1) {
      this.container.innerHTML = '';
    }

    // 如果没有文章，显示提示
    if (this.allArticles.length === 0) {
      this.container.innerHTML = '<div class="no-articles">没有找到相关文章</div>';
      this.updateLoadMoreButton(false);
      return;
    }

    // 渲染文章卡片
    const html = pageArticles.map(article => this.createArticleCard(article)).join('');
    this.container.innerHTML += html;

    // 更新加载更多按钮状态
    this.updateLoadMoreButton(end < this.allArticles.length);
  }

  createArticleCard(article) {
    // 生成虚拟指标数据
    const views = Math.floor(Math.random() * 1000) + 100;
    const citations = Math.floor(Math.random() * 100) + 10;
    const downloads = Math.floor(Math.random() * 500) + 50;

    return `
      <article class="article-card" data-id="${article.id}">
        <h3 class="article-title">${article.title}</h3>
        <div class="article-meta">
          <span class="authors">${article.authors.map(a => a.name).join(', ')}</span>
          <span class="date">${this.formatDate(article.publication_date)}</span>
        </div>
        <p class="article-abstract">${article.abstract.substring(0, 150)}...</p>

        <div class="article-stats">
          <span class="stat">
            <i class="icon-eye"></i>
            <span class="count">${views}</span>
            <span class="label">阅读</span>
          </span>
          <span class="stat">
            <i class="icon-citation"></i>
            <span class="count">${citations}</span>
            <span class="label">引用</span>
          </span>
          <span class="stat">
            <i class="icon-download"></i>
            <span class="count">${downloads}</span>
            <span class="label">下载</span>
          </span>
        </div>

        <div class="article-actions">
          <a href="/articles/article-${article.id}.html" class="btn-read-more">阅读全文</a>
          <button class="btn-action btn-favorite" title="收藏文章">
            <i class="icon-favorite"></i>
          </button>
          <button class="btn-action btn-share" title="分享文章">
            <i class="icon-share"></i>
          </button>
        </div>
      </article>
    `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  updateLoadMoreButton(hasMore) {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      if (hasMore) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = '加载更多';
      } else {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = '没有更多文章';
      }
    }
  }
}

// 当DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticleRenderer);
} else {
  initArticleRenderer();
}

async function initArticleRenderer() {
  try {
    // 等待数据加载完成
    await new Promise(resolve => {
      if (window.articleDataManager) {
        resolve();
      } else {
        document.addEventListener('articlesLoaded', resolve);
        // 尝试获取数据管理器
        if (window.getArticleDataManager) {
          window.getArticleDataManager();
        }
      }
    });

    // 初始化文章渲染器
    const renderer = new ArticleRenderer('articlesGrid', window.articleDataManager);
    await renderer.init();

    // 存储渲染器到全局对象
    window.articleRenderer = renderer;
  } catch (error) {
    console.error('初始化文章渲染器失败:', error);
    // 显示错误信息
    const container = document.getElementById('articlesGrid');
    if (container) {
      container.innerHTML = '<div class="error">文章加载失败，请刷新页面重试</div>';
    }
  }
}
