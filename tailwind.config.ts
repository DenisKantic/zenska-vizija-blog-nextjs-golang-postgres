import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xxs: '200px',
      xs: '400px',
      sm: '600px',
      md: '800px',
      lg: '1000px',
      xl: '1300px',
    },
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        lotion: '#FAFAFA', // white
        purplePizzazz: '#f93edf', // pink
        platinum: '#E7E7E7', // light-gray
        magnolia: '#FEF1FD',
        crayola: '#97427B',
        chineseBlack: '#141414', // dark-gray
        chineseBlackLight: '#121212',
        grayy: '#808080',
        brightGray: '#EDF1ED',
        quartz: '#4A4A4A', // black
      },
    },
  },
  plugins: [require('daisyui')],
}
export default config
