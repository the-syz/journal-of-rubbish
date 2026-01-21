// 弹窗系统类
class ModalSystem {
  constructor() {
    this.modal = document.getElementById('modalOverlay');
    this.modalContent = document.getElementById('modalContent');
    this.modalTitle = document.getElementById('modalTitle');
    this.isOpen = false;

    this.init();
  }

  init() {
    // 绑定关闭事件
    const closeButton = this.modal.querySelector('.modal-close');
    const confirmButton = this.modal.querySelector('.btn-confirm');

    if (closeButton) {
      closeButton.addEventListener('click', () => this.hide());
    }

    if (confirmButton) {
      confirmButton.addEventListener('click', () => this.hide());
    }

    // 点击遮罩层关闭
    this.modal.addEventListener('click', e => {
      if (e.target === this.modal) this.hide();
    });

    // ESC键关闭
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) {
        this.hide();
      }
    });

    // 防止背景滚动
    this.modal.addEventListener(
      'wheel',
      e => {
        if (this.isOpen) e.preventDefault();
      },
      { passive: false }
    );
  }

  show(title = '系统提示', content = '不给进') {
    this.modalTitle.textContent = title;
    this.modalContent.innerHTML = `<p>${content}</p>`;

    this.modal.style.display = 'flex';
    this.isOpen = true;

    // 防止背景滚动
    document.body.style.overflow = 'hidden';

    // 聚焦到确定按钮
    setTimeout(() => {
      const confirmButton = this.modal.querySelector('.btn-confirm');
      if (confirmButton) {
        confirmButton.focus();
      }
    }, 100);
  }

  hide() {
    this.modal.style.display = 'none';
    this.isOpen = false;
    document.body.style.overflow = 'auto';
  }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
  // 初始化导航功能
  initNavigation();
  // 初始化作者入口
  initAuthorAccess();
  // 初始化功能入口
  initFunctionEntries();
  // 加载文章数据
  initArticleData();
});

// 初始化导航功能
function initNavigation() {
  // 移动端菜单切换
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // 导航链接点击高亮
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      // 移除所有链接的active类
      navLinks.forEach(item => item.classList.remove('active'));
      // 为当前点击的链接添加active类
      this.classList.add('active');

      // 关闭移动端菜单（如果打开）
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
  });

  // 平滑滚动（锚点链接）
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // 搜索按钮点击事件
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          // 这里可以添加搜索功能的实现
          console.log('搜索:', searchTerm);
          // 暂时只是打印搜索词
        }
      }
    });
  }

  // 为了演示，添加一个简单的页面加载动画
  setTimeout(function () {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }, 1000);
}

// 模拟文章数据加载
function loadArticles() {
  // 这里将在后续任务中实现
  console.log('加载文章数据...');
}

// 模拟作者入口点击事件
function initAuthorAccess() {
  const authorAccessBtn = document.getElementById('authorAccessBtn');
  if (authorAccessBtn) {
    authorAccessBtn.addEventListener('click', function () {
      alert('本网站仅供娱乐，不接收真实投稿');
    });
  }
}

// 初始化功能入口
function initFunctionEntries() {
  // 初始化弹窗系统
  const modal = new ModalSystem();

  // 绑定作者入口点击事件
  const authorEntry = document.getElementById('authorEntry');
  if (authorEntry) {
    authorEntry.addEventListener('click', () => {
      modal.show('访问限制', '不给进');
    });
  }

  // 绑定编辑入口点击事件
  const editorEntry = document.getElementById('editorEntry');
  if (editorEntry) {
    editorEntry.addEventListener('click', () => {
      modal.show('访问限制', '不给进');
    });
  }

  // 绑定专家入口点击事件
  const expertEntry = document.getElementById('expertEntry');
  if (expertEntry) {
    expertEntry.addEventListener('click', () => {
      modal.show('访问限制', '不给进');
    });
  }

  // 绑定下载中心点击事件
  const downloadCenter = document.getElementById('downloadCenter');
  if (downloadCenter) {
    downloadCenter.addEventListener('click', () => {
      modal.show('下载中心', '不给下载');
    });
  }
}

// 页面滚动时的导航栏效果
window.addEventListener('scroll', function () {
  const mainNav = document.querySelector('.main-nav');
  if (mainNav) {
    if (window.scrollY > 50) {
      mainNav.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    } else {
      mainNav.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
  }
});

// 初始化文章数据加载
async function initArticleData() {
  try {
    // 动态导入数据管理器
    const { default: articleDataManager } = await import('./data-loader.js');

    // 显示加载状态
    showLoadingState();

    // 加载文章数据
    const articles = await articleDataManager.loadArticles();

    // 隐藏加载状态，显示加载完成
    showLoadingComplete();

    console.log('文章数据加载成功:', articles.length, '篇文章');

    // 存储数据管理器到全局对象，供其他模块使用
    window.articleDataManager = articleDataManager;

    // 触发文章数据加载完成事件
    document.dispatchEvent(new CustomEvent('articlesLoaded', { detail: { articles } }));
  } catch (error) {
    console.error('文章数据加载失败:', error);
    // 显示加载失败状态
    showLoadingError();
  }
}

// 显示加载状态
function showLoadingState() {
  let loadingElement = document.querySelector('.loading');
  if (!loadingElement) {
    loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 10000;
    `;
    loadingElement.textContent = '加载文章数据...';
    document.body.appendChild(loadingElement);
  } else {
    loadingElement.style.display = 'block';
  }
}

// 显示加载完成状态
function showLoadingComplete() {
  const loadingElement = document.querySelector('.loading');
  if (loadingElement) {
    loadingElement.textContent = '文章数据加载完成';
    setTimeout(() => {
      loadingElement.style.display = 'none';
    }, 1000);
  }
}

// 显示加载错误状态
function showLoadingError() {
  const loadingElement = document.querySelector('.loading');
  if (loadingElement) {
    loadingElement.textContent = '文章数据加载失败，使用默认数据';
    loadingElement.style.color = '#ff4d4f';
    setTimeout(() => {
      loadingElement.style.display = 'none';
    }, 2000);
  }
}

// 导出数据管理器访问方法
window.getArticleDataManager = async function () {
  if (window.articleDataManager) {
    return window.articleDataManager;
  }
  // 如果数据管理器还未初始化，初始化它
  await initArticleData();
  return window.articleDataManager;
};
