/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 🎨 COLOR SYSTEM
      colors: {
        // Brand Colors (Orange-based)
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Primary brand color
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        
        // Ocean Colors (Blue-based)
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Secondary color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        
        // Nature Colors (Green-based)
        nature: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16', // Accent color
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#365314',
          900: '#1a2e05',
          950: '#0f1a02',
        },
        
        // Warm Neutrals
        warm: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
      },
    fontFamily: {
       sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
       display: ['var(--font-lato)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
       inter: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
       lato: ['var(--font-lato)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
       mono: ['ui-monospace', 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'monospace'],
     },
      
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },

      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },

      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },

      // 📐 SPACING & SIZING
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '10.5': '2.625rem',
        '11.5': '2.875rem',
        '12.5': '3.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '17': '4.25rem',
        '18': '4.5rem',
        '19': '4.75rem',
        '21': '5.25rem',
        '22': '5.5rem',
        '23': '5.75rem',
        '25': '6.25rem',
        '26': '6.5rem',
        '27': '6.75rem',
        '29': '7.25rem',
        '30': '7.5rem',
        '33': '8.25rem',
        '34': '8.5rem',
        '35': '8.75rem',
        '37': '9.25rem',
        '38': '9.5rem',
        '39': '9.75rem',
        '41': '10.25rem',
        '42': '10.5rem',
        '43': '10.75rem',
        '45': '11.25rem',
        '46': '11.5rem',
        '47': '11.75rem',
        '49': '12.25rem',
        '50': '12.5rem',
        '68': '17rem',
        '76': '19rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem',
        '124': '31rem',
        '128': '32rem',
        '132': '33rem',
        '136': '34rem',
        '140': '35rem',
      },

      // 🎯 BORDER RADIUS
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        'full': '9999px',
      },

      // 📦 BOX SHADOW
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        
        // Custom magical shadows
        'magical': '0 10px 40px -10px rgba(249, 115, 22, 0.3), 0 20px 60px -20px rgba(6, 182, 212, 0.2)',
        'glow': '0 0 20px 5px rgba(132, 204, 22, 0.4)',
        'glow-brand': '0 0 30px rgba(249, 115, 22, 0.5)',
        'glow-ocean': '0 0 30px rgba(6, 182, 212, 0.5)',
        'glow-nature': '0 0 30px rgba(132, 204, 22, 0.5)',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'dreamy': '0 8px 30px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08)',
      },

      // 🎨 GRADIENTS & BACKGROUNDS
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-magical': 'linear-gradient(135deg, #f97316, #0ea5e9, #84cc16)',
        'gradient-warm': 'linear-gradient(135deg, #f97316, #fbbf24, #facc15)',
        'gradient-cool': 'linear-gradient(135deg, #3b82f6, #06b6d4, #14b8a6)',
        'gradient-nature': 'linear-gradient(135deg, #22c55e, #10b981, #84cc16)',
        'gradient-sunset': 'linear-gradient(135deg, #f97316, #f472b6, #8b5cf6)',
        'gradient-ocean': 'linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1)',
        'gradient-forest': 'linear-gradient(135deg, #22c55e, #10b981, #059669)',
        'gradient-royal': 'linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6)',
        'gradient-passion': 'linear-gradient(135deg, #f472b6, #ec4899, #ef4444)',
        
        // Mesh gradients
        'mesh-brand': 'radial-gradient(at 40% 20%, #f97316 0px, transparent 50%), radial-gradient(at 80% 0%, #0ea5e9 0px, transparent 50%), radial-gradient(at 0% 50%, #84cc16 0px, transparent 50%)',
        'mesh-warm': 'radial-gradient(at 40% 20%, #f97316 0px, transparent 50%), radial-gradient(at 80% 0%, #fbbf24 0px, transparent 50%), radial-gradient(at 0% 50%, #facc15 0px, transparent 50%)',
        'mesh-cool': 'radial-gradient(at 40% 20%, #3b82f6 0px, transparent 50%), radial-gradient(at 80% 0%, #06b6d4 0px, transparent 50%), radial-gradient(at 0% 50%, #14b8a6 0px, transparent 50%)',
      },

      // 🎭 ANIMATIONS
      animation: {
        // Enhanced built-in animations
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        
        // Custom magical animations
        'float': 'float 6s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'rainbow': 'rainbow 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        
        // Entrance animations
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'slide-left': 'slide-left 0.5s ease-out',
        'slide-right': 'slide-right 0.5s ease-out',
        'scale-up': 'scale-up 0.4s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'zoom-in': 'zoom-in 0.4s ease-out',
        'flip-in': 'flip-in 0.6s ease-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
        
        // Loading animations
        'loading-shimmer': 'loading-shimmer 1.5s ease-in-out infinite',
        'loading-bounce': 'loading-bounce 1.4s ease-in-out infinite both',
        'wave': 'wave 1.2s ease-in-out infinite',
        
        // Special effects
        'confetti-fall': 'confetti-fall 3s linear infinite',
        'sparkle-float': 'sparkle-float 2s ease-in-out infinite',
        'hearts-rise': 'hearts-rise 4s ease-out infinite',
        'gift-bounce': 'gift-bounce 2s ease-in-out infinite',
      },

      keyframes: {
        // Enhanced built-in keyframes
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        
        // Custom magical keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: '0.8', transform: 'scale(1.2) rotate(180deg)' },
        },
        rainbow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(132, 204, 22, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(132, 204, 22, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        
        // Entrance keyframes
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(-20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          from: { transform: 'translateX(20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          from: { transform: 'translateX(-20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-up': {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'zoom-in': {
          from: { transform: 'scale(0)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'flip-in': {
          from: { transform: 'rotateY(-90deg)', opacity: '0' },
          to: { transform: 'rotateY(0)', opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        
        // Loading keyframes
        'loading-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'loading-bounce': {
          '0%, 80%, 100%': {
            transform: 'scale(0.7)',
            opacity: '0.5',
          },
          '40%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        wave: {
          '0%, 40%, 100%': { transform: 'scaleY(0.4)' },
          '20%': { transform: 'scaleY(1)' },
        },
        
        // Special effects keyframes
        'confetti-fall': {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        'sparkle-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translate(5px, -5px) scale(1.2)', opacity: '1' },
        },
        'hearts-rise': {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translateY(-50px) scale(1.2)', opacity: '0' },
        },
        'gift-bounce': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-5px) scale(1.05)' },
        },
      },

      // 🎯 TRANSITIONS
      transitionDuration: {
        '50': '50ms',
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },

      transitionDelay: {
        '50': '50ms',
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },

      // 🎪 Z-INDEX
      zIndex: {
        '-1': '-1',
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'auto': 'auto',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
        'max': '2147483647',
      },

      // 📱 SCREENS (Enhanced responsive breakpoints)
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        
        // Custom breakpoints
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1024px',
        'wide': '1440px',
        'ultrawide': '1920px',
        
        // Max-width breakpoints
        'max-sm': { max: '639px' },
        'max-md': { max: '767px' },
        'max-lg': { max: '1023px' },
        'max-xl': { max: '1279px' },
        'max-2xl': { max: '1535px' },
        
        // Height breakpoints
        'h-sm': { raw: '(min-height: 640px)' },
        'h-md': { raw: '(min-height: 768px)' },
        'h-lg': { raw: '(min-height: 1024px)' },
      },

      // 🎨 ASPECT RATIO
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
        photo: '4 / 3',
        portrait: '3 / 4',
        golden: '1.618 / 1',
        ultrawide: '21 / 9',
        cinema: '2.39 / 1',
      },

      // 📏 MAX-WIDTH
      maxWidth: {
        '0': '0rem',
        'none': 'none',
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        'full': '100%',
        'min': 'min-content',
        'max': 'max-content',
        'fit': 'fit-content',
        'prose': '65ch',
        
        // Container sizes
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1536px',
      },

      // 🎪 BACKDROP BLUR
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // 🌈 TEXT DECORATION THICKNESS
      textDecorationThickness: {
        auto: 'auto',
        'from-font': 'from-font',
        0: '0px',
        1: '1px',
        2: '2px',
        4: '4px',
        8: '8px',
      },

      // 📐 TEXT UNDERLINE OFFSET
      textUnderlineOffset: {
        auto: 'auto',
        0: '0px',
        1: '1px',
        2: '2px',
        4: '4px',
        8: '8px',
      },

      // 🎨 GRADIENT COLOR STOPS
      gradientColorStops: theme => ({
        ...theme('colors'),
        'gradient-magical': '#f97316',
        'gradient-warm': '#fbbf24',
        'gradient-cool': '#06b6d4',
        'gradient-nature': '#84cc16',
      }),

      // 🎯 CONTENT
      content: {
        none: 'none',
        empty: '""',
      },

      // 🎪 CURSOR
      cursor: {
        auto: 'auto',
        default: 'default',
        pointer: 'pointer',
        wait: 'wait',
        text: 'text',
        move: 'move',
        help: 'help',
        'not-allowed': 'not-allowed',
        none: 'none',
        'context-menu': 'context-menu',
        progress: 'progress',
        cell: 'cell',
        crosshair: 'crosshair',
        'vertical-text': 'vertical-text',
        alias: 'alias',
        copy: 'copy',
        'no-drop': 'no-drop',
        grab: 'grab',
        grabbing: 'grabbing',
        'all-scroll': 'all-scroll',
        'col-resize': 'col-resize',
        'row-resize': 'row-resize',
        'n-resize': 'n-resize',
        'e-resize': 'e-resize',
        's-resize': 's-resize',
        'w-resize': 'w-resize',
        'ne-resize': 'ne-resize',
        'nw-resize': 'nw-resize',
        'se-resize': 'se-resize',
        'sw-resize': 'sw-resize',
        'ew-resize': 'ew-resize',
        'ns-resize': 'ns-resize',
        'nesw-resize': 'nesw-resize',
        'nwse-resize': 'nwse-resize',
        zoom: 'zoom-in',
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out',
      },
    },
  },
  plugins: [
    // Custom plugin for additional utilities
    function({ addUtilities, addComponents, theme }) {
      // Custom utilities
      const newUtilities = {
        // Text utilities
        '.text-balance': {
          textWrap: 'balance',
        },
        '.text-pretty': {
          textWrap: 'pretty',
        },
        
        // Glass morphism utilities
        '.glass-morphism': {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        
        // Custom scrollbar utilities
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
        },
        '.scrollbar-none': {
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        
        // Animation utilities
        '.animate-delay-100': {
          animationDelay: '100ms',
        },
        '.animate-delay-200': {
          animationDelay: '200ms',
        },
        '.animate-delay-300': {
          animationDelay: '300ms',
        },
        '.animate-delay-500': {
          animationDelay: '500ms',
        },
        
        // Transform utilities
        '.transform-gpu': {
          transform: 'translateZ(0)',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        
        // Custom focus utilities
        '.focus-ring': {
          '&:focus-visible': {
            outline: '2px solid theme("colors.brand.500")',
            outlineOffset: '2px',
          },
        },
      }
      
      // Custom components
      const newComponents = {
        // Button components
        '.btn-magical': {
          background: 'linear-gradient(135deg, theme("colors.brand.500"), theme("colors.ocean.500"))',
          border: 'none',
          color: 'white',
          fontWeight: theme('fontWeight.semibold'),
          borderRadius: theme('borderRadius.2xl'),
          padding: `${theme('spacing.3')} ${theme('spacing.8')}`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
          
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(249, 115, 22, 0.4)',
          },
          
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        
        // Card components
        '.card-magical': {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: theme('borderRadius.3xl'),
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
          transition: 'all 0.4s ease',
          position: 'relative',
          overflow: 'hidden',
          
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 20px 40px rgba(31, 38, 135, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
          },
        },
        
        // Container components
        '.container-fluid': {
          width: '100%',
          maxWidth: 'none',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
        },
      }
      
      addUtilities(newUtilities)
      addComponents(newComponents)
    },
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
}

export default config