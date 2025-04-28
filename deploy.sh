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
SCRIPT_FILE_PATH=$SCRIPTS_PATH/$SCRIPT
TARGET_SCRIPTS_ROOT=~"/scripts"
TARGET_MJS_SCRIPTS=$TARGET_SCRIPTS_ROOT/mjs-scripts


echo "DEPLOYMENT WILL BEGIN\n"
echo -n "Press any key to continue, CTRL-C to exit now ...\n"
read -n 1


if [ ! -d "$TARGET_MJS_SCRIPTS" ]; then
  echo "CREATING TARGET FOLDER STRUCTURE"
  mkdir -p $TARGET_MJS_SCRIPTS/node_modules
  mkdir -p $TARGET_MJS_SCRIPTS/scripts/mjs-lib
  mkdir -p $TARGET_MJS_SCRIPTS/scripts/.mjs-config
  echo "DONE."
fi

if [ ! -d "$TARGET_MJS_SCRIPTS/scripts/$SCRIPT" ]; then
  mkdir -p $TARGET_MJS_SCRIPTS/scripts/$SCRIPT
fi

echo "UPDATING TARGET WITH LATEST node_modules ..."

cp -r node_modules/* $TARGET_MJS_SCRIPTS/node_modules
echo "DONE."

echo "COPYING THE SCRIPT AND MAKING IT EXECUTABLE ..."

# copy all files except tests
rm -rf $TARGET_MJS_SCRIPTS/scripts/$SCRIPT/*
find $SCRIPT_FILE_PATH -maxdepth 1 -type f ! -name '*.test.mjs' -exec cp {} $TARGET_MJS_SCRIPTS/scripts/$SCRIPT/ \;
rm -rf $TARGET_MJS_SCRIPTS/scripts/$SCRIPT/package.json

chmod +x $TARGET_MJS_SCRIPTS/scripts/$SCRIPT/$SCRIPT_FILE
echo "DONE."

echo "COPYING LIBRARY"

cp -r $SCRIPTS_PATH/mjs-lib/* $TARGET_MJS_SCRIPTS/scripts/mjs-lib
echo "DONE."

echo "COPYING CONFIGURATIONS"

cp -r $SCRIPTS_PATH/.mjs-config/* $TARGET_MJS_SCRIPTS/scripts/.mjs-config
echo "DONE."

echo "CREATING A SYMBOLIC LINK ..."

rm -rf /usr/local/bin/$SCRIPT
sudo ln -s "$TARGET_MJS_SCRIPTS/scripts/$SCRIPT/$SCRIPT_FILE" /usr/local/bin/$SCRIPT
echo "DONE."
