import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import autoprefixer from 'autoprefixer'
import postCssPxToRem from 'postcss-pxtorem'
import { createHtmlPlugin } from 'vite-plugin-html';
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ mode}) => {
  const env = loadEnv(mode, __dirname);
  const useMock = env.VITE_USE_MOCK === 'true'
  return {
    root: "./",
    base: env.VITE_MODE === 'production' ? './' : '/',
    plugins: [
      vue(),
      VueDevTools(),
      AutoImport({
        imports: ["vue", "vue-router",
          {
            'echarts/core': [
              ['*', 'echarts']
            ],
            'echarts/charts': [
              'BarChart', 'LineChart', 'PieChart'
            ],
            'echarts/components': [
              'TitleComponent', 'TooltipComponent', 'LegendComponent', 'GridComponent'
            ]
          }
        ],
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dts: "src/Components.d.ts",
        resolvers: [ElementPlusResolver({ importStyle: 'sass'})]
      }),
      createHtmlPlugin({
        minify: true,
        entry: '/src/main.js',
        template: 'public/index.html',
        inject: {
          data: {
            title: env.VITE_BASE_TITLE,
            icon: env.VITE_BASE_ICON,
            env: env.NODE_ENV,
          }
        }
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, 'src/assets/svg')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        mockPath: 'mock',
        enable: useMock,
        watchFiles: true,
        logger: true
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, './src'),
        "@png": path.resolve(__dirname, './src/assets/png'),
        "@image": path.resolve(__dirname, './src/assets/images'),
        "@style": path.resolve(__dirname, './src/assets/styles'),
        "@views": path.resolve(__dirname, './src/views'),
      },
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
    },
    css: {
      devSourcemap: true,
      postcss: {
        plugins:[
          autoprefixer({
            overrideBrowserslist: [ "Android 4.1", "iOS 7.1", "Chrome > 31", "ff > 31", "ie >= 8"],
            grid: true
          }),
          postCssPxToRem({
            rootValue: 192, // 设计稿宽度的 1/10，例如设计稿宽度为 1920px，1rem = 16px
            propList: ['*'], // 需要转换的属性，这里选择全部属性
            selectorBlackList: [], // 忽略的选择器，保留为 px
            replace: true, // 是否直接替换值
            mediaQuery: false, // 是否转换媒体查询中的 px
            minPixelValue: 2, // 最小转换值，小于此值的 px 不转换
          }),
        ],
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@style/_variable" as *;`,
        },
      },
    },
    server: {
      host: 'localhost',
      port: 8080,
      strictPort: false,       // 8080 空闲时使用 8080，被占用时报错提示
      open: true,
      hmr: {
        overlay: true,         // 编译/运行错误直接显示在浏览器页面上
      },
      watch: {
        usePolling: false,     // macOS 原生 FSEvents 足够，无需轮询
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
      },
      proxy: {
        ...(!useMock ? { '/v1': {
          target: env.VITE_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/v1/, ''),
        } } : {}),
        '/socket.io': {
          target: 'ws://localhost:5174',
          ws: true,
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, env.VITE_PACKAGE),
      assetsDir: "assets",
      rollupOptions: {
        input: './public/index.html',
        output: {
          // 分包命名规则
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            // 拆分 element-plus
            if (id.includes('element-plus')) {
              return 'chunk-element-plus'
            }
            // 拆分 echarts
            if (id.includes('echarts')) {
              return 'chunk-echarts'
            }
            // 拆分 logicflow
            if (id.includes('logicflow')) {
              return 'chunk-logicflow'
            }
            // 可选：其余第三方依赖统一打包 chunk-vendor
            if (id.includes('node_modules')) {
              return 'chunk-vendor'
            }
          }
        }
      },
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  }
})
