// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules:[
    '@pinia/nuxt',
    'dayjs-nuxt',
    '@sidebase/nuxt-session',
    'nuxt-security',
    'sid-umag-components',
  ],
  plugins: [
    '~/plugins/axios'
  ],
  dayjs: {
    locales: ['es'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'es',
    defaultTimezone: 'America/Punta_Arenas',
  },
  devtools: { enabled: false },
  typescript: {
    strict: false,
    typeCheck: false
  },
  imports: {
    dirs: ['stores'],
  },
  css: [
    'bootstrap/dist/css/bootstrap.css',
    '@/assets/style/style.scss',
    '@fortawesome/fontawesome-free/css/all.css'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/style/variables.scss" as *;'
        }
      }
    }
  },
  components: true,
  build: {
  },
  runtimeConfig: {
    public: {
      backBaseUrl: process.env.NUXT_BACK_URL,
      authBaseUrl: 'http://localhost:8080',
    }
  },
  session: {
		session: {
			expiryInSeconds: 3600,
			cookieSameSite: 'lax',
			cookieSecure: true,
			cookieHttpOnly: true,
			storageOptions: {
				driver: 'memory',
				options: {},
			},
			domain: false,
		},
    api: {
      basePath: '/api/culturales-deportivos/session',
    },
	},
  security: {
		rateLimiter: {
			value: {
				tokensPerInterval: 150,
				interval: 'hour',
				fireImmediately: false,
			},
			route: '/**',
		},
		headers: {
			contentSecurityPolicy: {
        'img-src': ['*', 'data:', 'blob:'],
			},
			crossOriginEmbedderPolicy: {
				value: 'unsafe-none',
				route: '/**',
			},
		},
		allowedMethodsRestricter: {
			value: ['GET', 'POST', 'DELETE'],
			route: '/**',
		},
	},
  $production: {
    app: {
      baseURL: '/culturales-deportivos',
    },
    session: {
      session: {
        expiryInSeconds: 3600,
        cookieSameSite: 'lax',
        cookieSecure: true,
        cookieHttpOnly: true,
        domain: false,
        storageOptions: {
          driver: 'redis',
          options: {
            url: process.env.NUXT_SESSION_SESSION_STORAGE_OPTIONS_OPTIONS_URL,
          },
        },
      },
      api: {
        basePath: '/api/culturales-deportivos/session',
      },
    },
  },
})
