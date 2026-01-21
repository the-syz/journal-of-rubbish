class SearchResultsPage {
  constructor() {
    this.pageSize = 10;
    this.currentPage = 1;
    this.searchResults = [];
    this.searchQuery = '';
    
    this.init();
  }
  
  init() {
    this.getSearchQuery();
    this.bindEvents();
  }
  
  getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    this.searchQuery = urlParams.get('q');
    
    if (!this.searchQuery) {
      window.location.href = 'index.html';
      return;
    }
    
    // 更新页面标题和搜索词
    document.title = `搜索: ${this.searchQuery} - Journal of Rubbish`;
    document.getElementById('queryText').textContent = this.searchQuery;
    document.getElementById('noResultsQuery').textContent = this.searchQuery;
    
    // 执行搜索
    this.performSearch();
  }
  
  bindEvents() {
    // 绑定分页事件
    document.getElementById('prevPage')?.addEventListener('click', () => this.prevPage());
    document.getElementById('nextPage')?.addEventListener('click', () => this.nextPage());
  }
  
  async performSearch() {
    const startTime = performance.now();
    
    try {
      // 等待文章数据加载完成
      await this.waitForArticlesLoaded();
      
      const articles = window.articleDataManager.getAllArticles();
      const searchAlgorithm = new SearchAlgorithm();
      
      // 执行搜索
      this.searchResults = searchAlgorithm.search(this.searchQuery, articles);
      
      const endTime = performance.now();
      const searchTime = Math.round(endTime - startTime);
      
      // 更新统计信息
      document.getElementById('totalResults').textContent = this.searchResults.length;
      document.getElementById('searchTime').textContent = searchTime;
      
      // 渲染结果
      this.renderResults();
    } catch (error) {
      console.error('搜索失败:', error);
      this.showNoResults();
    }
  }
  
  waitForArticlesLoaded() {
    return new Promise(resolve => {
      if (window.articleDataManager) {
        resolve();
      } else {
        document.addEventListener('articlesLoaded', resolve);
      }
    });
  }
  
  renderResults() {
    const resultsList = document.getElementById('searchResultsList');
    const noResults = document.getElementById('noResults');
    const pagination = document.getElementById('pagination');
    
    if (this.searchResults.length === 0) {
      this.showNoResults();
      return;
    }
    
    // 计算分页
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageResults = this.searchResults.slice(start, end);
    
    // 渲染结果列表
    resultsList.innerHTML = '';
    
    pageResults.forEach((result, index) => {
      const article = result.article;
      const resultItem = this.createResultItem(article, result.score);
      resultsList.appendChild(resultItem);
    });
    
    // 更新分页
    this.updatePagination();
    
    // 显示结果，隐藏无结果状态
    resultsList.style.display = 'block';
    noResults.style.display = 'none';
    pagination.style.display = 'flex';
  }
  
  createResultItem(article, score) {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item';
    
    // 高亮标题
    const highlightedTitle = this.highlightText(article.title, this.searchQuery);
    
    // 高亮摘要
    let excerpt = article.abstract || '';
    if (excerpt.length > 150) {
      excerpt = excerpt.substring(0, 150) + '...';
    }
    const highlightedExcerpt = this.highlightText(excerpt, this.searchQuery);
    
    // 格式化作者
    const authors = article.authors.map(author => author.name).join(', ');
    
    resultItem.innerHTML = `
      <h2 class="result-title">
        <a href="articles/${article.id}.html">${highlightedTitle}</a>
      </h2>
      <div class="result-meta">
        <div class="result-authors">${authors}</div>
        <div class="result-date">${article.publication_date}</div>
      </div>
      <div class="result-excerpt">${highlightedExcerpt}</div>
      <div class="result-score">匹配度: ${Math.round(score)}</div>
    `;
    
    return resultItem;
  }
  
  showNoResults() {
    const resultsList = document.getElementById('searchResultsList');
    const noResults = document.getElementById('noResults');
    const pagination = document.getElementById('pagination');
    
    resultsList.style.display = 'none';
    noResults.style.display = 'block';
    pagination.style.display = 'none';
  }
  
  updatePagination() {
    const totalPages = Math.ceil(this.searchResults.length / this.pageSize);
    const currentPageEl = document.getElementById('currentPage');
    const totalPagesEl = document.getElementById('totalPages');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    currentPageEl.textContent = this.currentPage;
    totalPagesEl.textContent = totalPages;
    
    prevPageBtn.disabled = this.currentPage === 1;
    nextPageBtn.disabled = this.currentPage === totalPages;
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderResults();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  nextPage() {
    const totalPages = Math.ceil(this.searchResults.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.renderResults();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  highlightText(text, query) {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

// 当DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SearchResultsPage();
  });
} else {
  new SearchResultsPage();
}