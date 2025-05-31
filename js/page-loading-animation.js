/**
 * 页面加载动画优化
 * Page Loading Animation Optimization
 */

class PageLoadingAnimation {
  constructor() {
    this.loadingOverlay = null;
    this.progressBar = null;
    this.loadingText = null;
    this.isLoading = true;
    this.progress = 0;
    this.loadingMessages = [
      '正在加载页面内容...',
      '准备精彩内容...',
      '马上就好...',
      '加载中，请稍候...',
      '正在优化体验...'
    ];
    this.currentMessageIndex = 0;
    
    this.init();
  }

  // 初始化
  init() {
    this.preloadCriticalResources();
    this.createLoadingOverlay();
    this.startProgressSimulation();
    this.bindEvents();
    this.startMessageRotation();
    this.optimizeAboveFold();
    this.monitorPerformance();
    this.intelligentPreload();
  }

  // 创建加载遮罩层
  createLoadingOverlay() {
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.className = 'page-loading-overlay';
    
    this.loadingOverlay.innerHTML = `
      <div class="loading-animation">
        <div class="loading-spinner"></div>
        <div class="loading-text">
          <span class="loading-message">${this.loadingMessages[0]}</span>
          <span class="loading-dots"></span>
        </div>
        <div class="loading-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.loadingOverlay);
    
    // 获取元素引用
    this.progressBar = this.loadingOverlay.querySelector('.progress-bar');
    this.loadingText = this.loadingOverlay.querySelector('.loading-message');
  }

  // 开始进度条模拟
  startProgressSimulation() {
    const updateProgress = () => {
      if (this.progress < 90 && this.isLoading) {
        // 模拟加载进度
        const increment = Math.random() * 15 + 5;
        this.progress = Math.min(this.progress + increment, 90);
        this.updateProgress(this.progress);
        
        setTimeout(updateProgress, Math.random() * 300 + 200);
      }
    };
    
    updateProgress();
  }

  // 更新进度条
  updateProgress(progress) {
    if (this.progressBar) {
      this.progressBar.style.width = `${progress}%`;
    }
  }

  // 开始消息轮换
  startMessageRotation() {
    setInterval(() => {
      if (this.isLoading && this.loadingText) {
        this.currentMessageIndex = (this.currentMessageIndex + 1) % this.loadingMessages.length;
        this.loadingText.textContent = this.loadingMessages[this.currentMessageIndex];
      }
    }, 2000);
  }

  // 绑定事件
  bindEvents() {
    // 页面加载完成事件
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.onDOMContentLoaded();
      });
    } else {
      this.onDOMContentLoaded();
    }

    // 所有资源加载完成
    window.addEventListener('load', () => {
      this.onWindowLoad();
    });

    // 页面卸载前
    window.addEventListener('beforeunload', () => {
      this.showPageTransition();
    });
  }

  // DOM内容加载完成
  onDOMContentLoaded() {
    this.progress = Math.max(this.progress, 60);
    this.updateProgress(this.progress);

    // 延迟一点再初始化内容动画，确保DOM完全渲染
    setTimeout(() => {
      this.initContentAnimations();
    }, 100);
  }

  // 窗口加载完成
  onWindowLoad() {
    this.progress = 100;
    this.updateProgress(this.progress);

    // 标记页面加载完成
    document.body.classList.add('loaded');

    // 延迟隐藏加载动画
    setTimeout(() => {
      this.hideLoadingOverlay();
    }, 500);
  }

  // 隐藏加载遮罩层
  hideLoadingOverlay() {
    this.isLoading = false;

    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('loaded');

      // 动画完成后移除元素
      setTimeout(() => {
        if (this.loadingOverlay && this.loadingOverlay.parentNode) {
          this.loadingOverlay.parentNode.removeChild(this.loadingOverlay);
        }
      }, 600);
    }

    // 立即显示关键元素
    this.showCriticalElements();

    // 触发页面进入动画
    this.triggerPageEnterAnimation();
  }

  // 立即显示关键元素
  showCriticalElements() {
    const criticalElements = document.querySelectorAll('.header, .sidebar');
    criticalElements.forEach(el => {
      if (el.classList.contains('slide-in-left') || el.classList.contains('slide-in-right')) {
        el.classList.add('visible');
      }
    });
  }

  // 触发页面进入动画
  triggerPageEnterAnimation() {
    const mainContent = document.querySelector('.main');
    if (mainContent) {
      mainContent.classList.add('page-transition', 'page-enter');
    }
  }

  // 显示页面切换动画
  showPageTransition() {
    const mainContent = document.querySelector('.main');
    if (mainContent) {
      mainContent.classList.add('page-transition', 'page-exit');
    }
  }

  // 初始化内容动画
  initContentAnimations() {
    this.initIntersectionObserver();
    this.initLazyLoading();
    this.addAnimationClasses();
  }

  // 初始化交叉观察器
  initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      // 观察所有需要动画的元素
      const animatedElements = document.querySelectorAll(
        '.content-fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in'
      );

      animatedElements.forEach(el => {
        observer.observe(el);
      });

      // 立即显示关键元素（header, sidebar等）
      const criticalElements = document.querySelectorAll('.header, .sidebar');
      criticalElements.forEach(el => {
        if (el.classList.contains('slide-in-left') || el.classList.contains('slide-in-right')) {
          // 延迟一点显示，让加载动画先完成
          setTimeout(() => {
            el.classList.add('visible');
          }, 100);
        }
      });
    } else {
      // 降级处理：直接显示所有元素
      const animatedElements = document.querySelectorAll(
        '.content-fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in'
      );

      animatedElements.forEach(el => {
        el.classList.add('visible');
      });
    }
  }

  // 初始化懒加载
  initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loading');
            
            const tempImg = new Image();
            tempImg.onload = () => {
              img.src = img.dataset.src;
              img.classList.remove('loading');
              img.classList.add('loaded');
              img.removeAttribute('data-src');
            };
            tempImg.src = img.dataset.src;
            
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => {
        img.classList.add('lazy-image');
        imageObserver.observe(img);
      });
    } else {
      // 降级处理：直接加载所有图片
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
      });
    }
  }

  // 添加动画类名
  addAnimationClasses() {
    // 为文章块添加动画
    const postBlocks = document.querySelectorAll('.post-block');
    postBlocks.forEach((block, index) => {
      block.classList.add('content-fade-in');
      if (index > 0) {
        block.classList.add(`delay-${Math.min(index, 5)}`);
      }
    });

    // 为侧边栏添加动画
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.add('slide-in-right');
    }

    // 为头部添加动画
    const header = document.querySelector('.header');
    if (header) {
      header.classList.add('slide-in-left');
    }

    // 为页脚添加动画
    const footer = document.querySelector('.footer');
    if (footer) {
      footer.classList.add('content-fade-in', 'delay-2');
    }
  }

  // 创建骨架屏
  createSkeletonScreen() {
    const skeletonHTML = `
      <div class="skeleton-screen">
        <div class="skeleton-post">
          <div class="skeleton-title"></div>
          <div class="skeleton-meta"></div>
          <div class="skeleton-content">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
          </div>
          <div class="skeleton-button"></div>
        </div>
      </div>
    `;

    const mainContent = document.querySelector('.main-inner');
    if (mainContent) {
      mainContent.innerHTML = skeletonHTML + mainContent.innerHTML;
    }
  }

  // 移除骨架屏
  removeSkeletonScreen() {
    const skeletonScreen = document.querySelector('.skeleton-screen');
    if (skeletonScreen) {
      skeletonScreen.style.opacity = '0';
      setTimeout(() => {
        if (skeletonScreen.parentNode) {
          skeletonScreen.parentNode.removeChild(skeletonScreen);
        }
      }, 300);
    }
  }

  // 预加载关键资源
  preloadCriticalResources() {
    const criticalResources = [
      // 关键CSS文件
      { href: '/css/main.css', as: 'style' },
      // 关键字体文件
      { href: '/fonts/main.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      // 关键图片
      { href: '/images/cover.png', as: 'image' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  }

  // 优化首屏渲染
  optimizeAboveFold() {
    // 标记首屏内容
    const aboveFoldElements = document.querySelectorAll('.hero, .header, .main-inner > .post-block:first-child');
    aboveFoldElements.forEach(el => {
      el.classList.add('above-fold', 'critical-content');
    });

    // 标记非首屏内容
    const belowFoldElements = document.querySelectorAll('.post-block:not(:first-child), .footer, .sidebar');
    belowFoldElements.forEach(el => {
      el.classList.add('non-critical');
    });
  }

  // 性能监控
  monitorPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          const domContentLoadedTime = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;

          console.log('页面加载性能数据:', {
            '页面加载时间': `${loadTime}ms`,
            'DOM内容加载时间': `${domContentLoadedTime}ms`,
            '首次内容绘制': this.getFirstContentfulPaint(),
            '最大内容绘制': this.getLargestContentfulPaint()
          });
        }, 0);
      });
    }
  }

  // 获取首次内容绘制时间
  getFirstContentfulPaint() {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    return fcpEntry ? `${fcpEntry.startTime.toFixed(2)}ms` : '未测量';
  }

  // 获取最大内容绘制时间
  getLargestContentfulPaint() {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(`${lastEntry.startTime.toFixed(2)}ms`);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // 超时处理
        setTimeout(() => resolve('未测量'), 5000);
      } else {
        resolve('不支持');
      }
    });
  }

  // 智能预加载
  intelligentPreload() {
    // 预加载可能访问的页面
    const links = document.querySelectorAll('a[href^="/"]');
    const preloadedUrls = new Set();

    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const url = link.href;
        if (!preloadedUrls.has(url)) {
          const linkEl = document.createElement('link');
          linkEl.rel = 'prefetch';
          linkEl.href = url;
          document.head.appendChild(linkEl);
          preloadedUrls.add(url);
        }
      });
    });
  }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否禁用动画
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    window.pageLoadingAnimation = new PageLoadingAnimation();
  } else {
    // 如果用户偏好减少动画，直接显示内容
    document.body.style.opacity = '1';
  }
});

// 导出类供其他脚本使用
window.PageLoadingAnimation = PageLoadingAnimation;
