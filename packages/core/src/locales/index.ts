/**
 * Template 包内置国际化
 *
 * 提供模板选择器、加载状态等文本的多语言支持
 *
 * @module locales
 */

/**
 * 模板翻译接口
 */
export interface TemplateTranslation {
  /** 显示名称 */
  displayName: string
  /** 描述 */
  description: string
}

/**
 * 模板语言包接口
 */
export interface TemplateLocale {
  /** 模板选择器相关文本 */
  selector: {
    loading: string
    empty: string
    selectTemplate: string
    currentTemplate: string
    switchTemplate: string
    preview: string
    apply: string
    cancel: string
  }
  /** 设备相关文本 */
  device: {
    desktop: string
    tablet: string
    mobile: string
    notSupported: string
  }
  /** 模板分类 */
  categories: {
    layout: string
    login: string
    dashboard: string
    form: string
    list: string
    detail: string
  }
  /** 模板翻译（按模板名称索引） */
  templates: Record<string, TemplateTranslation>
}

/** 中文语言包 */
export const zhCN: TemplateLocale = {
  selector: {
    loading: '加载中...',
    empty: '暂无模板',
    selectTemplate: '选择模板',
    currentTemplate: '当前模板',
    switchTemplate: '切换模板',
    preview: '预览',
    apply: '应用',
    cancel: '取消',
  },
  device: {
    desktop: '桌面端',
    tablet: '平板端',
    mobile: '移动端',
    notSupported: '当前设备不支持此功能',
  },
  categories: {
    layout: '布局',
    login: '登录',
    dashboard: '仪表盘',
    form: '表单',
    list: '列表',
    detail: '详情',
  },
  templates: {
    // Layout templates - 布局模板
    'sidebar': {
      displayName: '经典侧边栏布局',
      description: '左侧边栏 + 顶栏 + 内容区，适合大多数后台管理系统',
    },
    'mix': {
      displayName: '混合布局',
      description: '顶部一级导航 + 左侧二级导航，适合大型后台系统',
    },
    'dual-column': {
      displayName: '双栏布局',
      description: '图标栏 + 菜单栏 + 内容区，VS Code 风格',
    },
    'top-menu': {
      displayName: '顶部菜单布局',
      description: '顶部水平导航 + 内容区，适合菜单项较少的系统',
    },
    'drawer': {
      displayName: '抽屉式布局',
      description: '抽屉式侧边栏 + 顶栏，点击触发滑出',
    },
    'tab-bar': {
      displayName: '底部导航布局',
      description: '顶栏 + 内容区 + 底部 Tab 栏，iOS/Android 风格',
    },
    // Login templates - 登录模板
    'default': {
      displayName: '经典卡片',
      description: '居中卡片式布局，紫色渐变背景',
    },
    'minimal': {
      displayName: '简约分栏',
      description: '左右分栏布局，暗色品牌展示区',
    },
  },
}

/** 英文语言包 */
export const enUS: TemplateLocale = {
  selector: {
    loading: 'Loading...',
    empty: 'No templates available',
    selectTemplate: 'Select Template',
    currentTemplate: 'Current Template',
    switchTemplate: 'Switch Template',
    preview: 'Preview',
    apply: 'Apply',
    cancel: 'Cancel',
  },
  device: {
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile',
    notSupported: 'This feature is not supported on current device',
  },
  categories: {
    layout: 'Layout',
    login: 'Login',
    dashboard: 'Dashboard',
    form: 'Form',
    list: 'List',
    detail: 'Detail',
  },
  templates: {
    // Layout templates
    'sidebar': {
      displayName: 'Classic Sidebar Layout',
      description: 'Left sidebar + top bar + content area, suitable for most admin systems',
    },
    'mix': {
      displayName: 'Mix Layout',
      description: 'Top primary nav + left secondary nav, suitable for large admin systems',
    },
    'dual-column': {
      displayName: 'Dual Column Layout',
      description: 'Icon bar + menu bar + content area, VS Code style',
    },
    'top-menu': {
      displayName: 'Top Menu Layout',
      description: 'Top horizontal nav + content area, suitable for systems with fewer menu items',
    },
    'drawer': {
      displayName: 'Drawer Layout',
      description: 'Drawer sidebar + top bar, slide out on click',
    },
    'tab-bar': {
      displayName: 'Tab Bar Layout',
      description: 'Top bar + content area + bottom tab bar, iOS/Android style',
    },
    // Login templates
    'default': {
      displayName: 'Classic Card',
      description: 'Centered card layout with gradient background',
    },
    'minimal': {
      displayName: 'Minimal Split',
      description: 'Left-right split layout with dark brand showcase',
    },
  },
}

/** 日文语言包 */
export const jaJP: TemplateLocale = {
  selector: {
    loading: '読み込み中...',
    empty: 'テンプレートがありません',
    selectTemplate: 'テンプレートを選択',
    currentTemplate: '現在のテンプレート',
    switchTemplate: 'テンプレートを切り替え',
    preview: 'プレビュー',
    apply: '適用',
    cancel: 'キャンセル',
  },
  device: {
    desktop: 'デスクトップ',
    tablet: 'タブレット',
    mobile: 'モバイル',
    notSupported: 'この機能は現在のデバイスではサポートされていません',
  },
  categories: {
    layout: 'レイアウト',
    login: 'ログイン',
    dashboard: 'ダッシュボード',
    form: 'フォーム',
    list: 'リスト',
    detail: '詳細',
  },
  templates: {
    'sidebar': { displayName: 'クラシックサイドバー', description: '左サイドバー + トップバー + コンテンツエリア' },
    'mix': { displayName: 'ミックスレイアウト', description: 'トップ一次ナビ + 左二次ナビ' },
    'dual-column': { displayName: 'デュアルカラム', description: 'アイコンバー + メニューバー + コンテンツエリア' },
    'top-menu': { displayName: 'トップメニュー', description: 'トップ水平ナビ + コンテンツエリア' },
  },
}

/** 韩文语言包 */
export const koKR: TemplateLocale = {
  selector: {
    loading: '로딩 중...',
    empty: '템플릿이 없습니다',
    selectTemplate: '템플릿 선택',
    currentTemplate: '현재 템플릿',
    switchTemplate: '템플릿 전환',
    preview: '미리보기',
    apply: '적용',
    cancel: '취소',
  },
  device: {
    desktop: '데스크톱',
    tablet: '태블릿',
    mobile: '모바일',
    notSupported: '현재 기기에서는 이 기능을 지원하지 않습니다',
  },
  categories: {
    layout: '레이아웃',
    login: '로그인',
    dashboard: '대시보드',
    form: '양식',
    list: '목록',
    detail: '상세',
  },
  templates: {
    'sidebar': { displayName: '클래식 사이드바', description: '왼쪽 사이드바 + 상단 바 + 콘텐츠 영역' },
    'mix': { displayName: '믹스 레이아웃', description: '상단 1차 네비 + 왼쪽 2차 네비' },
    'dual-column': { displayName: '듀얼 컬럼', description: '아이콘 바 + 메뉴 바 + 콘텐츠 영역' },
    'top-menu': { displayName: '상단 메뉴', description: '상단 수평 네비 + 콘텐츠 영역' },
  },
}


/** 德文语言包 */
export const deDE: TemplateLocale = {
  selector: {
    loading: 'Laden...',
    empty: 'Keine Vorlagen verfügbar',
    selectTemplate: 'Vorlage auswählen',
    currentTemplate: 'Aktuelle Vorlage',
    switchTemplate: 'Vorlage wechseln',
    preview: 'Vorschau',
    apply: 'Anwenden',
    cancel: 'Abbrechen',
  },
  device: {
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobil',
    notSupported: 'Diese Funktion wird auf dem aktuellen Gerät nicht unterstützt',
  },
  categories: {
    layout: 'Layout',
    login: 'Anmeldung',
    dashboard: 'Dashboard',
    form: 'Formular',
    list: 'Liste',
    detail: 'Detail',
  },
  templates: {
    'sidebar': { displayName: 'Klassisches Sidebar-Layout', description: 'Linke Seitenleiste + Kopfzeile + Inhaltsbereich' },
    'mix': { displayName: 'Mix-Layout', description: 'Obere Primärnavigation + Linke Sekundärnavigation' },
    'dual-column': { displayName: 'Zwei-Spalten-Layout', description: 'Symbolleiste + Menüleiste + Inhaltsbereich' },
    'top-menu': { displayName: 'Oberes Menü-Layout', description: 'Horizontale Navigation oben + Inhaltsbereich' },
  },
}

/** 法文语言包 */
export const frFR: TemplateLocale = {
  selector: {
    loading: 'Chargement...',
    empty: 'Aucun modèle disponible',
    selectTemplate: 'Sélectionner un modèle',
    currentTemplate: 'Modèle actuel',
    switchTemplate: 'Changer de modèle',
    preview: 'Aperçu',
    apply: 'Appliquer',
    cancel: 'Annuler',
  },
  device: {
    desktop: 'Bureau',
    tablet: 'Tablette',
    mobile: 'Mobile',
    notSupported: 'Cette fonctionnalité n\'est pas prise en charge sur cet appareil',
  },
  categories: {
    layout: 'Mise en page',
    login: 'Connexion',
    dashboard: 'Tableau de bord',
    form: 'Formulaire',
    list: 'Liste',
    detail: 'Détail',
  },
  templates: {
    'sidebar': { displayName: 'Mise en page classique', description: 'Barre latérale gauche + barre supérieure + zone de contenu' },
    'mix': { displayName: 'Mise en page mixte', description: 'Navigation primaire en haut + navigation secondaire à gauche' },
    'dual-column': { displayName: 'Mise en page à deux colonnes', description: 'Barre d\'icônes + barre de menu + zone de contenu' },
    'top-menu': { displayName: 'Menu supérieur', description: 'Navigation horizontale en haut + zone de contenu' },
  },
}

/** 西班牙文语言包 */
export const esES: TemplateLocale = {
  selector: {
    loading: 'Cargando...',
    empty: 'No hay plantillas disponibles',
    selectTemplate: 'Seleccionar plantilla',
    currentTemplate: 'Plantilla actual',
    switchTemplate: 'Cambiar plantilla',
    preview: 'Vista previa',
    apply: 'Aplicar',
    cancel: 'Cancelar',
  },
  device: {
    desktop: 'Escritorio',
    tablet: 'Tableta',
    mobile: 'Móvil',
    notSupported: 'Esta función no es compatible con el dispositivo actual',
  },
  categories: {
    layout: 'Diseño',
    login: 'Inicio de sesión',
    dashboard: 'Panel de control',
    form: 'Formulario',
    list: 'Lista',
    detail: 'Detalle',
  },
  templates: {
    'sidebar': { displayName: 'Diseño de barra lateral', description: 'Barra lateral izquierda + barra superior + área de contenido' },
    'mix': { displayName: 'Diseño mixto', description: 'Navegación primaria superior + navegación secundaria izquierda' },
    'dual-column': { displayName: 'Diseño de dos columnas', description: 'Barra de iconos + barra de menú + área de contenido' },
    'top-menu': { displayName: 'Menú superior', description: 'Navegación horizontal superior + área de contenido' },
  },
}

/** 所有语言包映射 */
export const locales = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'de-DE': deDE,
  'fr-FR': frFR,
  'es-ES': esES,
  // 简写别名
  'zh': zhCN,
  'en': enUS,
  'ja': jaJP,
  'ko': koKR,
  'de': deDE,
  'fr': frFR,
  'es': esES,
}

/** 语言代码类型 */
export type LocaleKey = keyof typeof locales

/**
 * 获取指定语言的语言包
 * @param locale - 语言代码
 * @returns 语言包对象
 */
export function getLocale(locale: LocaleKey | string): TemplateLocale {
  return locales[locale as LocaleKey] || enUS
}

