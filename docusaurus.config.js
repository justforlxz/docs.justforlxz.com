// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '爱折腾的小竹同学',
  tagline: '',
  url: 'https://docs.justforlxz.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'justforlxz', // Usually your GitHub org/user name.
  projectName: 'docs.justforlxz.com', // Usually your repo name.
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/justforlxz/docs.justforlxz.com/tree/master/docs/dev',
          path: 'docs/dev',
          routeBasePath: 'dev',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'qt',
        path: 'docs/qt',
        routeBasePath: 'qt',
        sidebarPath: require.resolve('./sidebars.js'),
        editUrl: 'https://github.com/justforlxz/docs.justforlxz.com/tree/master/docs/qt',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '爱折腾的小竹同学',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'dev',
            position: 'left',
            label: '项目分享'
          },
          {
            docsPluginId:'qt',
            type: 'doc',
            docId: 'index',
            position: 'left',
            label: 'Qt 入门'
          },
          {
            href: 'https://github.com/justforlxz/docs.justforlxz.com',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Qt 学习',
                to: '/qt',
              },
              {
                label: '项目分享',
                to: '/dev'
              }
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/justforlxz',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                href: 'https://blog.justforlxz.com'
              },
              {
                label: 'GitHub',
                href: 'https://github.com/justforlxz/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} lxz, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
