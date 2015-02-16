#!/bin/bash

setGitToHttps() {
  echo "Setting git to use https instead of ssh"
  git config --global url."https://".insteadOf git://
}

checkCmd() {
  echo "Checking if $1 is installed..."
  if hash $1 2>/dev/null; then
    echo "$1 is already installed"
    return 0
  else
    echo "$1 is not installed"
    return 1
  fi
}

installNvm() {
  echo "Installing nvm..."
  touch ~/.profile
  curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
  source ~/.profile
  echo "Nvm installed!"
}

installNode() {
  echo "Installing node..."
  nvm install v0.10
  nvm alias default 0.10
  nvm use default
  echo "Node installed!"
}

installNpm() {
  echo "Installing $1..."
  npm install $1 -g
  echo "$1 installed!"
}

clear
echo "Preparing to install generator-unumux and it's dependencies..."

if ! xcode-select -p 2>/dev/null ; then
  echo "You do not have command line developer tools installed."
  echo "Next, a window is going to open asking to install these tools."
  echo "Press install, and do not continue on until they have finished installing"
  echo "Press any key to install command line developer tools..."
  read
  echo "Installing command line developer tools..."
  xcode-select --install
  echo "Press any key once the installation has finished..."
  read
fi


if ! checkCmd node ; then
  if ! checkCmd nvm; then
    installNvm
  fi
  installNode
fi

if ! checkCmd npm ; then
  echo "Something is wrong with your installation of NodeJS. Please uninstall and run this script again"
  exit 1;
fi

setGitToHttps

if ! checkCmd grunt ; then
  installNpm grunt-cli
fi

if ! checkCmd yo ; then
  installNpm yo
fi

if ! checkCmd bower ; then
  installNpm bower
fi

echo "Installing generator-uxgen..."
npm i git+https://7c42ce73f8853826cd1e3a5d47002c7ff693164f:x-oauth-basic@github.com/unumux/generator-unumux.git -g
echo "generator-uxgen installed!"

echo "Finished! You may need to close this window and open a new terminal window before you can use the tool"
