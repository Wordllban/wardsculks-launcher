# WardSculks Launcher

---

![TypeScript](https://img.shields.io/badge/TypeScript%204.9.5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node JS](https://img.shields.io/badge/Node%20js%2018.12.1-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Electron](https://img.shields.io/badge/Electron%2023.0.0-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)
![React](https://img.shields.io/badge/React%2018.2.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS%203.2.7-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit%201.9.5-purple?style=for-the-badge&logo=redux&logoColor=white)

## Description

**WardSculks** is a Ukrainian Minecraft project, known for its modded servers. This application enhances the user experience for players on our servers. It is designed to support multiple server systems and integrates a sophisticated anti-cheat system. This ensures that users cannot modify the modpacks, maintaining the integrity and fairness of the gameplay.

### Key Features:

- **Multi-Server Support:** Seamlessly switch between different servers for varied experiences.
- **Built-In Anti-Cheat System:** Prevents unauthorized modpack modifications, ensuring fair play.
- **Multiple Language Support**
- **Cross-platform**
- **Overriding of Minecraft launch arguments through App interface**
- **Discord Rich Presence**
- **Intuitive User Interface:** Powered by React and Tailwind CSS for a smooth, user-friendly experience.
- **Efficient Server Communication:** Leverages Electron for robust and efficient server interactions.
- **State Management:** Utilizes Redux Toolkit for predictable state management across the application.

### There are still much things to do

I used [Obsidian](https://obsidian.md) to take notes and make some plans.
For more information about each page and things to impove see [obsidian folder](https://github.com/Wordllban/wardsculks-launcher/tree/main/obsidian)

## Related to Project

For more insight into the backend infrastructure of the WardSculks Launcher, visit my friend's repository:

🔗 [WardSculks Backend Repository](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

UI/UX Design by Me and [Bohdan Ryshko](https://www.linkedin.com/in/bohdan-ryshko-782330277/)

🔗 [Link to Figma](https://www.figma.com/file/O7dKYt30Zwiaxz30zEfJAJ/WardSculks-Launcher?type=design&node-id=0-1&mode=design&t=IvL2k3Tu7GFTZ9sT-0)

## Commands

Before starting the project in development, you will need to run post-install command to properly install and use native dependencies

```bash
yarn && yarn post-install
```

Start

```bash
yarn start
```

Before commit or build make sure to run linter

```bash
yarn lint
```

Create installation file, also do not forget to update version in `package.json`

Note: check `webpack.config.main.prod.ts`, you must add environment variables here manually to include them in build, otherwise builder don't see them

```bash
yarn package
```

---

> As starter point, we used [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
