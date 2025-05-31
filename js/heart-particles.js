/**
 * 鼠标跟随爱心粒子效果
 * Mouse Follow Heart Particles Effect
 */

class HeartParticles {
  constructor() {
    this.container = null;
    this.toggleButton = null;
    this.particles = [];
    this.maxParticles = 50; // 最大粒子数量
    this.isEnabled = this.loadSettings(); // 从本地存储加载设置
    this.lastMouseMove = 0;
    this.throttleDelay = 50; // 节流延迟（毫秒）

    this.init();
  }

  // 初始化
  init() {
    this.createContainer();
    this.createToggleButton();
    this.bindEvents();
    this.startCleanup();
    this.updateButtonState();
  }

  // 创建粒子容器
  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'heart-particles-container';
    document.body.appendChild(this.container);
  }

  // 创建控制按钮
  createToggleButton() {
    this.toggleButton = document.createElement('div');
    this.toggleButton.className = 'heart-particles-toggle';
    this.toggleButton.title = '切换爱心粒子效果';

    // 添加点击事件
    this.toggleButton.addEventListener('click', () => {
      this.toggle(!this.isEnabled);
    });

    document.body.appendChild(this.toggleButton);
  }

  // 绑定事件
  bindEvents() {
    // 鼠标移动事件（节流处理）
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - this.lastMouseMove > this.throttleDelay) {
        this.createParticle(e.clientX, e.clientY);
        this.lastMouseMove = now;
      }
    });

    // 点击事件（创建更多粒子）
    document.addEventListener('click', (e) => {
      if (this.isEnabled) {
        this.createBurst(e.clientX, e.clientY);
      }
    });

    // 页面可见性变化事件
    document.addEventListener('visibilitychange', () => {
      this.isEnabled = !document.hidden;
    });

    // 移动端触摸事件
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const now = Date.now();
        if (now - this.lastMouseMove > this.throttleDelay) {
          this.createParticle(touch.clientX, touch.clientY);
          this.lastMouseMove = now;
        }
      }
    }, { passive: true });
  }

  // 创建单个粒子
  createParticle(x, y) {
    if (!this.isEnabled || this.particles.length >= this.maxParticles) {
      return;
    }

    const particle = document.createElement('div');
    particle.className = this.getRandomParticleClass();
    
    // 设置初始位置
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    // 添加到容器
    this.container.appendChild(particle);
    this.particles.push(particle);

    // 添加随机偏移
    this.addRandomOffset(particle);

    // 设置自动清理
    setTimeout(() => {
      this.removeParticle(particle);
    }, 3500);
  }

  // 创建爆发效果（点击时）
  createBurst(x, y) {
    const burstCount = Math.random() * 5 + 3; // 3-8个粒子
    
    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        this.createParticle(x + offsetX, y + offsetY);
      }, i * 50);
    }
  }

  // 获取随机粒子类名
  getRandomParticleClass() {
    const sizes = ['small', 'medium', 'large'];
    const colors = ['pink', 'red', 'purple', 'blue'];
    const animations = ['anim1', 'anim2', 'anim3'];
    
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const animation = animations[Math.floor(Math.random() * animations.length)];
    
    return `heart-particle ${size} ${color} ${animation}`;
  }

  // 添加随机偏移
  addRandomOffset(particle) {
    const randomX = (Math.random() - 0.5) * 20;
    const randomY = (Math.random() - 0.5) * 20;
    
    particle.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

  // 移除粒子
  removeParticle(particle) {
    if (particle && particle.parentNode) {
      particle.parentNode.removeChild(particle);
      const index = this.particles.indexOf(particle);
      if (index > -1) {
        this.particles.splice(index, 1);
      }
    }
  }

  // 启动清理任务
  startCleanup() {
    setInterval(() => {
      // 清理过期的粒子
      this.particles = this.particles.filter(particle => {
        if (!particle.parentNode) {
          return false;
        }
        return true;
      });
      
      // 如果粒子过多，清理最老的
      while (this.particles.length > this.maxParticles) {
        const oldestParticle = this.particles.shift();
        this.removeParticle(oldestParticle);
      }
    }, 1000);
  }

  // 启用/禁用粒子效果
  toggle(enabled) {
    this.isEnabled = enabled;
    this.saveSettings();
    this.updateButtonState();

    if (!enabled) {
      this.clearAllParticles();
    }
  }

  // 更新按钮状态
  updateButtonState() {
    if (this.toggleButton) {
      if (this.isEnabled) {
        this.toggleButton.classList.remove('disabled');
        this.toggleButton.title = '关闭爱心粒子效果';
      } else {
        this.toggleButton.classList.add('disabled');
        this.toggleButton.title = '开启爱心粒子效果';
      }
    }
  }

  // 保存设置到本地存储
  saveSettings() {
    try {
      localStorage.setItem('heartParticlesEnabled', JSON.stringify(this.isEnabled));
    } catch (e) {
      console.warn('无法保存爱心粒子设置:', e);
    }
  }

  // 从本地存储加载设置
  loadSettings() {
    try {
      const saved = localStorage.getItem('heartParticlesEnabled');
      return saved !== null ? JSON.parse(saved) : true; // 默认开启
    } catch (e) {
      console.warn('无法加载爱心粒子设置:', e);
      return true; // 默认开启
    }
  }

  // 清理所有粒子
  clearAllParticles() {
    this.particles.forEach(particle => {
      this.removeParticle(particle);
    });
    this.particles = [];
  }

  // 销毁实例
  destroy() {
    this.clearAllParticles();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    if (this.toggleButton && this.toggleButton.parentNode) {
      this.toggleButton.parentNode.removeChild(this.toggleButton);
    }
  }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否在移动设备上（可选择性禁用以提高性能）
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // 创建全局实例
  window.heartParticles = new HeartParticles();
  
  // 在移动设备上可以选择降低粒子数量
  if (isMobile) {
    window.heartParticles.maxParticles = 25;
    window.heartParticles.throttleDelay = 100;
  }
});

// 提供全局控制方法
window.toggleHeartParticles = function(enabled) {
  if (window.heartParticles) {
    window.heartParticles.toggle(enabled);
  }
};

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  if (window.heartParticles) {
    window.heartParticles.destroy();
  }
});
