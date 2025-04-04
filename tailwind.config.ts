
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
        // Custom futuristic theme colors
        futuristic: {
          bg: {
            DEFAULT: '#0c0e2b',
            dark: '#050720',
            light: '#121642'
          },
          accent: {
            DEFAULT: '#6366f1',
            hover: '#818cf8',
          },
          secondary: {
            DEFAULT: '#3b4bcc',
            hover: '#4f5bd5',
          },
          status: {
            pending: '#f59e0b',
            inProgress: '#3b82f6',
            completed: '#10b981',
          },
          text: {
            primary: '#ffffff',
            secondary: '#e2e8f0',
            muted: '#94a3b8',
          }
        }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(99, 102, 241, 0.2), 0 0 20px rgba(99, 102, 241, 0)' 
          },
          '50%': { 
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.4), 0 0 30px rgba(99, 102, 241, 0.2)' 
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'gradient-flow': 'gradient-flow 5s ease infinite'
			},
      backgroundImage: {
        'gradient-futuristic': 'linear-gradient(135deg, #0c0e2b 0%, #0f1235 25%, #121642 50%, #0f1235 75%, #0c0e2b 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(12, 14, 43, 0.8) 0%, rgba(18, 22, 66, 0.95) 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #0c0e2b 0%, #080a1f 100%)',
        'gradient-button': 'linear-gradient(90deg, #3b4bcc 0%, #6366f1 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 5px rgba(99, 102, 241, 0.25)',
        'glow': '0 0 15px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 30px rgba(99, 102, 241, 0.6)',
      }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
