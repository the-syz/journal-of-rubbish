class ArticleDataManager {
  constructor() {
    this.articles = [];
    this.cacheKey = 'jor_articles_cache';
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24小时
  }

  async loadArticles() {
    // 1. 检查缓存
    const cached = this.getCachedArticles();
    if (cached) {
      this.articles = cached;
      return this.articles;
    }

    // 2. 从JSON文件加载
    try {
      const response = await fetch('/data/articles.json');
      if (!response.ok) throw new Error('Failed to load articles');

      const data = await response.json();
      this.articles = data.articles;

      // 3. 缓存数据
      this.cacheArticles(data.articles);

      return this.articles;
    } catch (error) {
      console.error('Error loading articles:', error);
      // 4. 降级：使用内置默认数据
      this.articles = this.getDefaultArticles();
      return this.articles;
    }
  }

  cacheArticles(articles) {
    const cacheData = {
      timestamp: Date.now(),
      data: articles,
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
  }

  getCachedArticles() {
    const cached = localStorage.getItem(this.cacheKey);
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    const isExpired = Date.now() - cacheData.timestamp > this.cacheExpiry;

    return isExpired ? null : cacheData.data;
  }

  getDefaultArticles() {
    // 返回少量内置文章数据
    return [
      {
        id: 1,
        title: '默认文章：基于深度学习的垃圾文本分类方法研究',
        authors: [
          {
            name: '张三',
            affiliation: '虚构大学计算机科学与技术学院',
            email: 'zhangsan@example.com',
            orcid: '0000-0001-2345-6789',
          },
        ],
        abstract:
          '随着互联网的快速发展，垃圾文本的数量呈现爆炸式增长，给信息处理带来了巨大挑战。本文提出了一种基于深度学习的垃圾文本分类方法，通过构建多层神经网络模型，结合词嵌入技术和注意力机制，实现了对垃圾文本的高效准确分类。',
        keywords: ['文本分类', '深度学习', '自然语言处理'],
        publication_date: '2025-01-01',
        tags: ['被打核心'],
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        references: [
          {
            authors: 'Johnson, A. B.',
            year: 2024,
            title: 'Deep Learning for Text Classification',
            journal: 'Journal of AI Research',
          },
        ],
        doi: '10.1234/jor.2025.001',
      },
    ];
  }

  // API方法
  getAllArticles() {
    return this.articles;
  }
  getArticleById(id) {
    return this.articles.find(a => a.id === id);
  }
  filterByTag(tag) {
    return this.articles.filter(a => a.tags.includes(tag));
  }
}

// 导出单例实例
const articleDataManager = new ArticleDataManager();
export default articleDataManager;
