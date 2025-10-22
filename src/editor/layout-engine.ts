/**
 * 布局引擎
 * 处理元素布局、对齐和响应式
 */

export interface LayoutConfig {
  type: 'flex' | 'grid' | 'absolute'
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  gap?: number
  columns?: number
  rows?: number
  responsive?: {
    [breakpoint: string]: Partial<LayoutConfig>
  }
}

export interface LayoutConstraint {
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  aspectRatio?: string
}

/**
 * 布局引擎
 */
export class LayoutEngine {
  /**
   * 生成布局样式
   */
  generateStyle(config: LayoutConfig): Record<string, string> {
    const style: Record<string, string> = {}

    switch (config.type) {
      case 'flex':
        style.display = 'flex'
        style.flexDirection = config.direction || 'row'

        if (config.align) {
          style.alignItems = config.align
        }

        if (config.justify) {
          style.justifyContent = config.justify
        }

        if (config.gap) {
          style.gap = `${config.gap}px`
        }
        break

      case 'grid':
        style.display = 'grid'

        if (config.columns) {
          style.gridTemplateColumns = `repeat(${config.columns}, 1fr)`
        }

        if (config.rows) {
          style.gridTemplateRows = `repeat(${config.rows}, auto)`
        }

        if (config.gap) {
          style.gap = `${config.gap}px`
        }
        break

      case 'absolute':
        style.position = 'absolute'
        break
    }

    return style
  }

  /**
   * 应用约束
   */
  applyConstraints(
    style: Record<string, string>,
    constraints: LayoutConstraint
  ): Record<string, string> {
    const result = { ...style }

    if (constraints.minWidth) {
      result.minWidth = `${constraints.minWidth}px`
    }

    if (constraints.maxWidth) {
      result.maxWidth = `${constraints.maxWidth}px`
    }

    if (constraints.minHeight) {
      result.minHeight = `${constraints.minHeight}px`
    }

    if (constraints.maxHeight) {
      result.maxHeight = `${constraints.maxHeight}px`
    }

    if (constraints.aspectRatio) {
      result.aspectRatio = constraints.aspectRatio
    }

    return result
  }

  /**
   * 生成响应式样式
   */
  generateResponsiveCSS(config: LayoutConfig): string {
    let css = ''

    if (config.responsive) {
      Object.entries(config.responsive).forEach(([breakpoint, responsiveConfig]) => {
        const mediaQuery = `@media (max-width: ${breakpoint}px)`
        const style = this.generateStyle({ ...config, ...responsiveConfig })

        css += `${mediaQuery} {\n`
        Object.entries(style).forEach(([prop, value]) => {
          const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase()
          css += `  ${cssProp}: ${value};\n`
        })
        css += '}\n'
      })
    }

    return css
  }
}

/**
 * 创建布局引擎
 */
export function createLayoutEngine(): LayoutEngine {
  return new LayoutEngine()
}



