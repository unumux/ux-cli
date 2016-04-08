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
  curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
  source ~/.profile
  echo "Nvm installed!"
}

installNode() {
  echo "Installing node..."
  nvm install v4.4
  nvm alias default v4.4
  nvm use default
  echo "Node installed!"
}

installNpm() {
  echo "Installing $1..."
  npm install $1 -g
  echo "$1 installed!"
}

clear
echo "Preparing to install ux-cli and it's dependencies..."

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


if ! checkCmd bower ; then
  installNpm bower
fi

installNpm @unumux/ux-cli

echo "Finished! You may need to close this window and open a new terminal window before you can use the tool"
