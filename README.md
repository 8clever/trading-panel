# Trading Panel

![image](https://github.com/8clever/trading-panel/assets/10035481/3c3ca578-c5f6-4762-b535-15b01bf574f8)

## Why?
In main case not all exchanges have required functionality, for example we can't simply filter OrderBook, or simply place TP and SL in percents.
Also many exchanges are very slow, and not allow do trading fast when it is needed.
Target of this project - make trading fast and profitable

## Development
An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ yarn
```

### Development

```bash
$ yarn dev
```

### Build

```bash
# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```

### POSTINSTALL
```
sudo apt -y install xvfb libnss3-dev libatk1.0-0 libatk-bridge2.0-0 libcups2 libgtk-3-0 libgbm-dev
```


add in .bashrc
```
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):0
export LIBGL_ALWAYS_INDIRECT=true
```
