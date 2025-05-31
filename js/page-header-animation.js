/* global NexT */

// 页面头部标题字符动画效果
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否为页面类型（非首页和文章页）
  if (document.body.classList.contains('page') && document.body.classList.contains('posts-expand')) {
    const pageTitle = document.querySelector('.page .post-header .post-title');
    
    if (pageTitle && !pageTitle.querySelector('.char')) {
      // 将标题文字分解为字符
      const titleText = pageTitle.textContent;
      pageTitle.innerHTML = '';
      
      // 为每个字符创建span元素
      for (let i = 0; i < titleText.length; i++) {
        const char = titleText[i];
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char; // 保持空格
        span.style.animationDelay = (i * 0.1) + 's';
        pageTitle.appendChild(span);
      }
      
      // 添加入场动画
      pageTitle.classList.add('animated');
      
      // 为字符添加悬停效果
      const chars = pageTitle.querySelectorAll('.char');
      chars.forEach((char, index) => {
        char.addEventListener('mouseenter', function() {
          // 添加波浪效果
          this.style.transform = 'translateY(-5px) scale(1.1)';
          this.style.textShadow = '0 5px 15px rgba(0,0,0,0.5)';
          
          // 影响相邻字符
          const prevChar = chars[index - 1];
          const nextChar = chars[index + 1];
          
          if (prevChar) {
            prevChar.style.transform = 'translateY(-2px) scale(1.05)';
            prevChar.style.textShadow = '0 3px 10px rgba(0,0,0,0.3)';
          }
          
          if (nextChar) {
            nextChar.style.transform = 'translateY(-2px) scale(1.05)';
            nextChar.style.textShadow = '0 3px 10px rgba(0,0,0,0.3)';
          }
        });
        
        char.addEventListener('mouseleave', function() {
          // 重置所有相关字符
          this.style.transform = '';
          this.style.textShadow = '';
          
          const prevChar = chars[index - 1];
          const nextChar = chars[index + 1];
          
          if (prevChar) {
            prevChar.style.transform = '';
            prevChar.style.textShadow = '';
          }
          
          if (nextChar) {
            nextChar.style.transform = '';
            nextChar.style.textShadow = '';
          }
        });
      });
    }
  }
});

// 为页面添加滚动视差效果
document.addEventListener('scroll', function() {
  const pageHeader = document.querySelector('.page .post-header');
  if (pageHeader) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // 背景视差效果
    const bgElement = pageHeader.querySelector('::before');
    if (bgElement) {
      pageHeader.style.transform = `translateY(${rate}px)`;
    }
  }
});

// 页面加载完成后的入场动画
window.addEventListener('load', function() {
  const pageElements = document.querySelectorAll('.page .post-block, .category-all-page, .tag-cloud, .archive.posts-collapse');
  
  pageElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease';
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 200 + 300);
  });
});

// 为分类和标签项目添加交错动画
function addStaggerAnimation(selector, delay = 100) {
  const items = document.querySelectorAll(selector);
  
  items.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.4s ease';
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, index * delay + 500);
  });
}

// 页面加载完成后应用交错动画
document.addEventListener('DOMContentLoaded', function() {
  // 分类页面动画
  if (document.querySelector('.category-all-page')) {
    addStaggerAnimation('.category-list-item', 150);
  }
  
  // 标签页面动画
  if (document.querySelector('.tag-cloud')) {
    addStaggerAnimation('.tag-cloud-tags a', 50);
  }
  
  // 归档页面动画
  if (document.querySelector('.archive.posts-collapse')) {
    addStaggerAnimation('.posts-collapse .post', 100);
  }
});

// 添加页面切换时的淡出效果
document.addEventListener('beforeunload', function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
});
