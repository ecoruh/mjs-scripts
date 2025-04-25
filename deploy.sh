#!/bin/zsh
if [ -n "$1" ] && [ -d "scripts/$1" ] && [ -f "scripts/$1/$1.mjs" ]; then
  echo "RECOGNISED SCRIPT $1"
else
  echo "ERROR: ARGUMENT MUST BE A VALID SCRIPT"
  echo "       scripts/$1/$1.mjs DOES NOT EXIST"
  exit
fi

SCRIPT=$1
SCRIPT_FILE="$SCRIPT.mjs"
SCRIPTS_PATH="${PWD}/scripts"
SCRIPT_FILE_PATH="$SCRIPTS_PATH/$SCRIPT/$SCRIPT_FILE"
TARGET_PATH=~"/Scripts/mjs-scripts"

echo "DEPLOYMENT WILL BEGIN\n"
echo -n "Press any key to continue, CTRL-C to exit now ...\n"
read -n 1

echo "UPDATING TARGET WITH LATEST node_modules ..."

rm -rf $TARGET_PATH/node_modules
mkdir $TARGET_PATH/node_modules
cp -r node_modules/* $TARGET_PATH/node_modules
echo "DONE."

echo "COPYING THE SCRIPT AND MAKING IT EXECUTABLE ..."

cp $SCRIPT_FILE_PATH $TARGET_PATH
chmod +x $TARGET_PATH/$SCRIPT_FILE
echo "DONE."

echo "CREATING A SYMBOLIC LINK ..."

rm -rf /usr/local/bin/$SCRIPT
sudo ln -s "$TARGET_PATH/$SCRIPT_FILE" /usr/local/bin/$SCRIPT
echo "DONE."
