// TypeScript declarations for dimensional-ui

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Component prop interfaces (to be expanded in later tasks)
export interface DButtonProps {
  variant?: 'primary' | 'secondary' | 'accent-yellow' | 'accent-pink'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

export interface NavItem {
  label: string
  href?: string
  children?: NavItem[]
  active?: boolean
}

export interface DNavbarProps {
  items: NavItem[]
  logo?: string
  sticky?: boolean
}

// Theme interfaces
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accents: {
      yellow: string
      pink: string
      red: string
    }
    text: string
    border: string
  }
  shadows: {
    small: string
    medium: string
    large: string
    dropdown: string
  }
  borderRadius: {
    small: string
    medium: string
    large: string
    pill: string
  }
  typography: {
    fontFamily: string
    fontWeights: {
      normal: number
      bold: number
    }
  }
}

export interface InteractiveState {
  isHovered: boolean
  isPressed: boolean
  isActive: boolean
  isFocused: boolean
}

export interface ShadowState {
  currentOffset: string
  targetOffset: string
  isAnimating: boolean
}

// Composable interfaces
export interface ThemeComposable {
  getToken: (tokenName: string) => string
  setThemeMode: (mode: 'light' | 'dark') => void
  generateShadowClass: (size: 'sm' | 'md' | 'lg') => string
  generateColorClass: (color: string, variant: 'bg' | 'text' | 'border') => string
}