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
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.hide();
      }
    });
    
    // 防止背景滚动
    this.modal.addEventListener('wheel', (e) => {
      if (this.isOpen) e.preventDefault();
    }, { passive: false });
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

// 导出ModalSystem类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModalSystem;
} else if (typeof window !== 'undefined') {
  window.ModalSystem = ModalSystem;
}
