class SearchHistory {
  constructor() {
    this.key = 'jor_search_history';
    this.maxItems = 5;
  }

  add(query) {
    let history = this.get();
    // 移除重复项并添加到开头
    history = [query, ...history.filter(item => item !== query)].slice(0, this.maxItems);
    localStorage.setItem(this.key, JSON.stringify(history));
  }

  get() {
    const history = localStorage.getItem(this.key);
    return history ? JSON.parse(history) : [];
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}

class SearchSuggestions {
  constructor(inputId, suggestionsId, listId) {
    this.input = document.getElementById(inputId);
    this.suggestionsContainer = document.getElementById(suggestionsId);
    this.suggestionsList = document.getElementById(listId);
    this.searchHistory = new SearchHistory();
    this.currentSuggestionIndex = -1;
    this.articles = [];

    this.init();
  }

  init() {
    if (!this.input || !this.suggestionsContainer || !this.suggestionsList) return;

    // 绑定事件
    this.input.addEventListener('focus', () => this.showSuggestions());
    this.input.addEventListener('input', () => this.handleInput());
    this.input.addEventListener('keydown', e => this.handleKeydown(e));
    this.input.addEventListener('blur', () => setTimeout(() => this.hideSuggestions(), 200));

    // 绑定搜索按钮
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.performSearch());
    }

    // 绑定清除历史按钮
    const clearBtn = this.suggestionsContainer.querySelector('.clear-history');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.searchHistory.clear();
        this.renderSuggestions();
      });
    }

    // 加载文章数据
    this.loadArticles();
  }

  async loadArticles() {
    try {
      // 等待文章数据加载完成
      await new Promise(resolve => {
        if (window.articleDataManager) {
          resolve();
        } else {
          document.addEventListener('articlesLoaded', resolve);
        }
      });

      this.articles = window.articleDataManager.getAllArticles();
    } catch (error) {
      console.error('加载文章数据失败:', error);
    }
  }

  handleInput() {
    const query = this.input.value.trim();
    if (query) {
      this.renderSuggestions(query);
      this.showSuggestions();
    } else {
      this.renderSuggestions();
      this.showSuggestions();
    }
  }

  handleKeydown(e) {
    const suggestions = this.suggestionsList.children;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.currentSuggestionIndex = (this.currentSuggestionIndex + 1) % suggestions.length;
        this.highlightSuggestion();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.currentSuggestionIndex =
          (this.currentSuggestionIndex - 1 + suggestions.length) % suggestions.length;
        this.highlightSuggestion();
        break;
      case 'Enter':
        e.preventDefault();
        if (this.currentSuggestionIndex >= 0 && suggestions[this.currentSuggestionIndex]) {
          this.input.value = suggestions[this.currentSuggestionIndex].textContent;
          this.performSearch();
        } else if (this.input.value.trim()) {
          this.performSearch();
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  renderSuggestions(query = '') {
    this.suggestionsList.innerHTML = '';

    if (query) {
      // 显示搜索建议
      const suggestions = this.getSuggestions(query);
      suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        li.addEventListener('click', () => {
          this.input.value = suggestion;
          this.performSearch();
        });
        this.suggestionsList.appendChild(li);
      });
    } else {
      // 显示搜索历史
      const history = this.searchHistory.get();
      history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.addEventListener('click', () => {
          this.input.value = item;
          this.performSearch();
        });
        this.suggestionsList.appendChild(li);
      });
    }

    this.currentSuggestionIndex = -1;
  }

  getSuggestions(query) {
    const normalizedQuery = query.toLowerCase();
    const suggestions = new Set();

    // 从文章标题和作者中获取建议
    this.articles.forEach(article => {
      if (article.title.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(article.title);
      }

      article.authors.forEach(author => {
        if (author.name.toLowerCase().includes(normalizedQuery)) {
          suggestions.add(author.name);
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }

  highlightSuggestion() {
    const suggestions = this.suggestionsList.children;

    // 移除所有高亮
    for (let i = 0; i < suggestions.length; i++) {
      suggestions[i].classList.remove('active');
    }

    // 高亮当前项
    if (this.currentSuggestionIndex >= 0 && suggestions[this.currentSuggestionIndex]) {
      suggestions[this.currentSuggestionIndex].classList.add('active');
      // 滚动到可见区域
      suggestions[this.currentSuggestionIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }

  showSuggestions() {
    if (this.suggestionsList.children.length > 0) {
      this.suggestionsContainer.style.display = 'block';
    }
  }

  hideSuggestions() {
    this.suggestionsContainer.style.display = 'none';
  }

  performSearch() {
    const query = this.input.value.trim();
    if (!query) return;

    // 添加到搜索历史
    this.searchHistory.add(query);

    // 隐藏建议
    this.hideSuggestions();

    // 跳转到搜索结果页面
    window.location.href = `/search-results.html?q=${encodeURIComponent(query)}`;
  }
}

class SearchAlgorithm {
  constructor() {
    this.weights = {
      title: 10,
      authors: 5,
      abstract: 2,
    };
  }

  search(query, articles) {
    if (!query || !articles || articles.length === 0) {
      return [];
    }

    const normalizedQuery = query.toLowerCase();
    const results = [];

    // 遍历所有文章，计算匹配得分
    articles.forEach(article => {
      const score = this.calculateScore(article, normalizedQuery);
      if (score > 0) {
        results.push({
          article,
          score,
          matchPositions: this.getMatchPositions(article, normalizedQuery),
        });
      }
    });

    // 按得分排序
    results.sort((a, b) => b.score - a.score);

    return results;
  }

  calculateScore(article, query) {
    let score = 0;

    // 标题匹配
    if (article.title.toLowerCase().includes(query)) {
      const titleMatchCount = this.countMatches(article.title.toLowerCase(), query);
      score += titleMatchCount * this.weights.title;
    }

    // 作者匹配
    article.authors.forEach(author => {
      if (author.name.toLowerCase().includes(query)) {
        const authorMatchCount = this.countMatches(author.name.toLowerCase(), query);
        score += authorMatchCount * this.weights.authors;
      }
    });

    // 摘要匹配
    if (article.abstract && article.abstract.toLowerCase().includes(query)) {
      const abstractMatchCount = this.countMatches(article.abstract.toLowerCase(), query);
      score += abstractMatchCount * this.weights.abstract;
    }

    return score;
  }

  countMatches(text, query) {
    let count = 0;
    let startIndex = 0;

    while (true) {
      const index = text.indexOf(query, startIndex);
      if (index === -1) break;
      count++;
      startIndex = index + query.length;
    }

    return count;
  }

  getMatchPositions(article, query) {
    const positions = {};

    // 标题匹配位置
    if (article.title.toLowerCase().includes(query)) {
      positions.title = this.findMatchIndices(article.title.toLowerCase(), query);
    }

    // 作者匹配位置
    article.authors.forEach((author, index) => {
      if (author.name.toLowerCase().includes(query)) {
        if (!positions.authors) positions.authors = [];
        positions.authors.push({
          index,
          positions: this.findMatchIndices(author.name.toLowerCase(), query),
        });
      }
    });

    // 摘要匹配位置
    if (article.abstract && article.abstract.toLowerCase().includes(query)) {
      positions.abstract = this.findMatchIndices(article.abstract.toLowerCase(), query);
    }

    return positions;
  }

  findMatchIndices(text, query) {
    const indices = [];
    let startIndex = 0;

    while (true) {
      const index = text.indexOf(query, startIndex);
      if (index === -1) break;
      indices.push({
        start: index,
        end: index + query.length,
      });
      startIndex = index + query.length;
    }

    return indices;
  }

  // 防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// 当DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearch);
} else {
  initSearch();
}

function initSearch() {
  try {
    const searchSuggestions = new SearchSuggestions(
      'searchInput',
      'searchSuggestions',
      'suggestionsList'
    );
    window.searchSuggestions = searchSuggestions;
  } catch (error) {
    console.error('初始化搜索功能失败:', error);
  }
}
