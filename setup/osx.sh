#!/bin/bash

# Detect profile code borrowed from nvm (https://github.com/creationix/nvm/)
detect_profile() {
  if [ -n "${PROFILE}" ] && [ -f "${PROFILE}" ]; then
    echo "${PROFILE}"
    return
  fi

  local DETECTED_PROFILE
  DETECTED_PROFILE=''
  local SHELLTYPE
  SHELLTYPE="$(basename "/$SHELL")"

  if [ "$SHELLTYPE" = "bash" ]; then
    if [ -f "$HOME/.bashrc" ]; then
      DETECTED_PROFILE="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
      DETECTED_PROFILE="$HOME/.bash_profile"
    fi
  elif [ "$SHELLTYPE" = "zsh" ]; then
    DETECTED_PROFILE="$HOME/.zshrc"
  fi

  if [ -z "$DETECTED_PROFILE" ]; then
    if [ -f "$HOME/.profile" ]; then
      DETECTED_PROFILE="$HOME/.profile"
    elif [ -f "$HOME/.bashrc" ]; then
      DETECTED_PROFILE="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
      DETECTED_PROFILE="$HOME/.bash_profile"
    elif [ -f "$HOME/.zshrc" ]; then
      DETECTED_PROFILE="$HOME/.zshrc"
    fi
  fi

  if [ ! -z "$DETECTED_PROFILE" ]; then
    echo "$DETECTED_PROFILE"
  fi
}

UX_USER_PROFILE=$(detect_profile)

reload_profile() {
    source $UX_USER_PROFILE
}

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
  touch $UX_USER_PROFILE
  curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
  reload_profile
  echo "Nvm installed!"
}

installNode() {
  echo "Installing node..."
  nvm install v6.6
  nvm alias default v6.6
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
echo "Finished! Restart your terminal application to begin using ux"
