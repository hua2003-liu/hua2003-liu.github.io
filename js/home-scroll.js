// 修复首页滚动条立即显示的问题
(function() {
  'use strict';
  
  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    const home = document.getElementById('home');
    if (!home) return;
    
    // 监听鼠标滚轮事件
    let scrollTimeout;
    home.addEventListener('wheel', function(e) {
      // 第一次滚动时，启用滚动条
      if (!home.classList.contains('scroll-ready')) {
        home.classList.add('scroll-ready');
        home.style.overflow = 'auto';
      }
    }, { passive: true });
    
    // 或者在 3 秒后自动启用滚动（防止用户想滚动但找不到滚动条）
    setTimeout(function() {
      if (!home.classList.contains('scroll-ready')) {
        home.classList.add('scroll-ready');
        home.style.overflow = 'auto';
      }
    }, 3000);
  }
})();
