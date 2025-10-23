<template>
  <div class="theme-demo">
    <!-- 主题切换控制面板 -->
    <div class="control-panel">
      <h1>🎨 Template 主题系统演示</h1>
      
      <div class="controls">
        <div class="control-group">
          <label>主题模式：</label>
          <div class="button-group">
            <button
              :class="{ active: mode === 'light' }"
              @click="setMode('light')"
            >
              ☀️ 浅色
            </button>
            <button
              :class="{ active: mode === 'dark' }"
              @click="setMode('dark')"
            >
              🌙 深色
            </button>
            <button
              :class="{ active: mode === 'auto' }"
              @click="setMode('auto')"
            >
              🔄 跟随系统
            </button>
          </div>
        </div>

        <div class="control-group">
          <label>快速切换：</label>
          <button class="toggle-btn" @click="toggle">
            切换主题 (当前: {{ actualMode }})
          </button>
        </div>

        <div class="control-group">
          <label>自定义主色：</label>
          <div class="color-picker-group">
            <input
              v-model="customPrimary"
              type="color"
              @change="applyCustomColor"
            >
            <span>{{ customPrimary }}</span>
            <button @click="resetColor">重置</button>
          </div>
        </div>
      </div>

      <div class="info-panel">
        <div class="info-item">
          <strong>当前模式：</strong> {{ mode }}
        </div>
        <div class="info-item">
          <strong>实际应用：</strong> {{ actualMode }}
        </div>
        <div class="info-item">
          <strong>是否深色：</strong> {{ isDark ? '是' : '否' }}
        </div>
      </div>
    </div>

    <!-- 样式预览区域 -->
    <div class="preview-section">
      <h2>CSS 变量效果预览</h2>
      
      <!-- 颜色预览 -->
      <div class="preview-group">
        <h3>颜色变量</h3>
        <div class="color-samples">
          <div class="color-sample">
            <div class="sample-box" style="background: var(--template-primary)"></div>
            <span>Primary</span>
          </div>
          <div class="color-sample">
            <div class="sample-box" style="background: var(--template-success)"></div>
            <span>Success</span>
          </div>
          <div class="color-sample">
            <div class="sample-box" style="background: var(--template-warning)"></div>
            <span>Warning</span>
          </div>
          <div class="color-sample">
            <div class="sample-box" style="background: var(--template-error)"></div>
            <span>Error</span>
          </div>
          <div class="color-sample">
            <div class="sample-box" style="background: var(--template-info)"></div>
            <span>Info</span>
          </div>
        </div>
      </div>

      <!-- 背景颜色预览 -->
      <div class="preview-group">
        <h3>背景颜色</h3>
        <div class="bg-samples">
          <div class="bg-sample" style="background: var(--template-bg-page)">
            Page Background
          </div>
          <div class="bg-sample" style="background: var(--template-bg-container)">
            Container
          </div>
          <div class="bg-sample" style="background: var(--template-bg-component)">
            Component
          </div>
        </div>
      </div>

      <!-- 文本颜色预览 -->
      <div class="preview-group">
        <h3>文本颜色</h3>
        <div class="text-samples">
          <p style="color: var(--template-text-primary)">Primary Text</p>
          <p style="color: var(--template-text-secondary)">Secondary Text</p>
          <p style="color: var(--template-text-tertiary)">Tertiary Text</p>
          <a href="#" style="color: var(--template-text-link)">Link Text</a>
        </div>
      </div>

      <!-- 按钮预览 -->
      <div class="preview-group">
        <h3>按钮样式</h3>
        <div class="button-samples">
          <button class="sample-btn primary">Primary Button</button>
          <button class="sample-btn secondary">Secondary Button</button>
          <button class="sample-btn outline">Outline Button</button>
          <button class="sample-btn" disabled>Disabled Button</button>
        </div>
      </div>

      <!-- 输入框预览 -->
      <div class="preview-group">
        <h3>输入框样式</h3>
        <div class="input-samples">
          <input type="text" placeholder="默认输入框" class="sample-input">
          <input type="text" placeholder="聚焦后查看效果" class="sample-input">
          <textarea placeholder="文本域" class="sample-input"></textarea>
        </div>
      </div>

      <!-- 卡片预览 -->
      <div class="preview-group">
        <h3>卡片样式</h3>
        <div class="card-samples">
          <div class="sample-card">
            <h4>卡片标题</h4>
            <p>这是一个使用 CSS 变量的卡片示例。背景、阴影、圆角都会随主题变化。</p>
          </div>
          <div class="sample-card">
            <h4>统计卡片</h4>
            <p class="stat-number">12,345</p>
            <p class="stat-label">总访问量</p>
          </div>
        </div>
      </div>

      <!-- 间距和尺寸预览 -->
      <div class="preview-group">
        <h3>间距系统</h3>
        <div class="spacing-samples">
          <div class="spacing-item" style="padding: var(--template-spacing-xs)">XS Spacing</div>
          <div class="spacing-item" style="padding: var(--template-spacing-sm)">SM Spacing</div>
          <div class="spacing-item" style="padding: var(--template-spacing-md)">MD Spacing</div>
          <div class="spacing-item" style="padding: var(--template-spacing-lg)">LG Spacing</div>
          <div class="spacing-item" style="padding: var(--template-spacing-xl)">XL Spacing</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTemplateTheme, injectCSSVariables } from '../src/theme'

// 使用主题 Composable
const { mode, actualMode, isDark, setMode, toggle } = useTemplateTheme()

// 自定义颜色
const customPrimary = ref('#0079eb')

const applyCustomColor = () => {
  injectCSSVariables({
    '--template-primary': customPrimary.value,
    '--template-login-bg-gradient-start': customPrimary.value,
  })
}

const resetColor = () => {
  customPrimary.value = '#0079eb'
  applyCustomColor()
}
</script>

<style scoped>
.theme-demo {
  min-height: 100vh;
  background: var(--template-bg-page);
  padding: var(--template-spacing-2xl);
  color: var(--template-text-primary);
}

/* 控制面板 */
.control-panel {
  max-width: 800px;
  margin: 0 auto var(--template-spacing-4xl);
  padding: var(--template-spacing-3xl);
  background: var(--template-bg-container);
  border-radius: var(--template-radius-xl);
  box-shadow: var(--template-shadow-lg);
}

.control-panel h1 {
  margin: 0 0 var(--template-spacing-2xl);
  font-size: var(--template-font-3xl);
  font-weight: var(--template-font-weight-bold);
  color: var(--template-text-primary);
}

.controls {
  display: flex;
  flex-direction: column;
  gap: var(--template-spacing-2xl);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--template-spacing-md);
}

.control-group label {
  font-size: var(--template-font-base);
  font-weight: var(--template-font-weight-medium);
  color: var(--template-text-secondary);
}

.button-group {
  display: flex;
  gap: var(--template-spacing-lg);
}

.button-group button {
  flex: 1;
  padding: var(--template-spacing-lg);
  border: var(--template-border-width-medium) solid var(--template-border);
  border-radius: var(--template-radius-md);
  background: var(--template-bg-container);
  color: var(--template-text-primary);
  font-size: var(--template-font-base);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.button-group button:hover {
  border-color: var(--template-primary);
  color: var(--template-primary);
}

.button-group button.active {
  background: var(--template-primary);
  border-color: var(--template-primary);
  color: var(--template-text-inverse);
}

.toggle-btn {
  padding: var(--template-spacing-lg);
  background: var(--template-primary);
  color: var(--template-text-inverse);
  border: none;
  border-radius: var(--template-radius-md);
  font-size: var(--template-font-base);
  font-weight: var(--template-font-weight-medium);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.toggle-btn:hover {
  background: var(--template-primary-hover);
}

.color-picker-group {
  display: flex;
  align-items: center;
  gap: var(--template-spacing-lg);
}

.color-picker-group input[type="color"] {
  width: 60px;
  height: 40px;
  border: var(--template-border-width-thin) solid var(--template-border);
  border-radius: var(--template-radius-md);
  cursor: pointer;
}

.color-picker-group button {
  padding: var(--template-spacing-md) var(--template-spacing-lg);
  border: var(--template-border-width-thin) solid var(--template-border);
  border-radius: var(--template-radius-md);
  background: var(--template-bg-container);
  color: var(--template-text-primary);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.color-picker-group button:hover {
  background: var(--template-bg-component-hover);
}

.info-panel {
  margin-top: var(--template-spacing-2xl);
  padding: var(--template-spacing-xl);
  background: var(--template-bg-component);
  border-radius: var(--template-radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--template-spacing-sm);
}

.info-item {
  font-size: var(--template-font-sm);
  color: var(--template-text-secondary);
}

/* 预览区域 */
.preview-section {
  max-width: 1200px;
  margin: 0 auto;
}

.preview-section h2 {
  margin: 0 0 var(--template-spacing-3xl);
  font-size: var(--template-font-2xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
  text-align: center;
}

.preview-group {
  margin-bottom: var(--template-spacing-4xl);
  padding: var(--template-spacing-2xl);
  background: var(--template-bg-container);
  border-radius: var(--template-radius-lg);
  box-shadow: var(--template-shadow-md);
}

.preview-group h3 {
  margin: 0 0 var(--template-spacing-xl);
  font-size: var(--template-font-xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
}

/* 颜色样本 */
.color-samples {
  display: flex;
  gap: var(--template-spacing-xl);
  flex-wrap: wrap;
}

.color-sample {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--template-spacing-md);
}

.sample-box {
  width: 80px;
  height: 80px;
  border-radius: var(--template-radius-md);
  box-shadow: var(--template-shadow-sm);
}

.color-sample span {
  font-size: var(--template-font-sm);
  color: var(--template-text-secondary);
}

/* 背景样本 */
.bg-samples {
  display: flex;
  gap: var(--template-spacing-lg);
  flex-wrap: wrap;
}

.bg-sample {
  flex: 1;
  min-width: 150px;
  padding: var(--template-spacing-2xl);
  border-radius: var(--template-radius-md);
  border: var(--template-border-width-thin) solid var(--template-border);
  text-align: center;
  font-size: var(--template-font-base);
  color: var(--template-text-primary);
}

/* 文本样本 */
.text-samples {
  display: flex;
  flex-direction: column;
  gap: var(--template-spacing-md);
}

.text-samples p,
.text-samples a {
  margin: 0;
  font-size: var(--template-font-base);
}

.text-samples a {
  text-decoration: none;
}

.text-samples a:hover {
  text-decoration: underline;
}

/* 按钮样本 */
.button-samples {
  display: flex;
  gap: var(--template-spacing-lg);
  flex-wrap: wrap;
}

.sample-btn {
  padding: var(--template-spacing-md) var(--template-spacing-xl);
  border-radius: var(--template-radius-md);
  font-size: var(--template-font-base);
  font-weight: var(--template-font-weight-medium);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.sample-btn.primary {
  background: var(--template-primary);
  color: var(--template-text-inverse);
  border: none;
}

.sample-btn.primary:hover:not(:disabled) {
  background: var(--template-primary-hover);
}

.sample-btn.secondary {
  background: var(--template-bg-component);
  color: var(--template-text-primary);
  border: none;
}

.sample-btn.secondary:hover:not(:disabled) {
  background: var(--template-bg-component-hover);
}

.sample-btn.outline {
  background: transparent;
  color: var(--template-primary);
  border: var(--template-border-width-thin) solid var(--template-primary);
}

.sample-btn.outline:hover:not(:disabled) {
  background: var(--template-primary-lighter);
}

.sample-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 输入框样本 */
.input-samples {
  display: flex;
  flex-direction: column;
  gap: var(--template-spacing-lg);
}

.sample-input {
  padding: var(--template-spacing-md) var(--template-spacing-lg);
  border: var(--template-border-width-thin) solid var(--template-border-input);
  border-radius: var(--template-form-input-radius);
  font-size: var(--template-font-base);
  color: var(--template-text-primary);
  background: var(--template-bg-container);
  transition: var(--template-transition-all);
}

.sample-input::placeholder {
  color: var(--template-text-placeholder);
}

.sample-input:focus {
  outline: none;
  border-color: var(--template-border-input-focus);
  box-shadow: 0 0 0 3px var(--template-primary-lighter);
}

textarea.sample-input {
  min-height: 80px;
  resize: vertical;
}

/* 卡片样本 */
.card-samples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--template-spacing-xl);
}

.sample-card {
  padding: var(--template-spacing-xl);
  background: var(--template-bg-container);
  border-radius: var(--template-radius-lg);
  box-shadow: var(--template-shadow-sm);
  border: var(--template-border-width-thin) solid var(--template-border-light);
}

.sample-card h4 {
  margin: 0 0 var(--template-spacing-md);
  font-size: var(--template-font-lg);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
}

.sample-card p {
  margin: 0;
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
  line-height: var(--template-line-normal);
}

.stat-number {
  font-size: var(--template-font-3xl);
  font-weight: var(--template-font-weight-bold);
  color: var(--template-primary);
  margin: var(--template-spacing-lg) 0 var(--template-spacing-xs);
}

.stat-label {
  font-size: var(--template-font-sm);
  color: var(--template-text-tertiary);
}

/* 间距样本 */
.spacing-samples {
  display: flex;
  flex-direction: column;
  gap: var(--template-spacing-md);
}

.spacing-item {
  background: var(--template-primary-lighter);
  border: var(--template-border-width-thin) solid var(--template-primary);
  border-radius: var(--template-radius-sm);
  color: var(--template-primary);
  font-size: var(--template-font-sm);
  text-align: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .theme-demo {
    padding: var(--template-spacing-xl);
  }

  .control-panel {
    padding: var(--template-spacing-xl);
  }

  .button-group {
    flex-direction: column;
  }

  .color-samples,
  .bg-samples,
  .button-samples {
    justify-content: center;
  }
}
</style>

