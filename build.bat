@echo off

set BUILD_TARGET=WeGoTravel
set BUILD_PATH=D:\workspace\cordova\%BUILD_TARGET%

echo ============================================
echo %DATE% %TIME% Build Cordova APK Started %BUILD_PATH%
echo ============================================
echo Executing User : 
whoami

if exist %BUILD_PATH%\platforms\android\build\outputs\apk\android-debug.apk echo Remove Previous APK 
if exist %BUILD_PATH%\platforms\android\build\outputs\apk\android-debug.apk del %BUILD_PATH%\platforms\android\build\outputs\apk\android-debug.apk

cd /d %BUILD_PATH%

call cordova build

if not exist %BUILD_PATH%\platforms\android\build\outputs\apk\android-debug.apk echo Fail to Build
if not exist %BUILD_PATH%\platforms\android\build\outputs\apk\android-debug.apk exit -1

mkdir D:\workspace\cordova\build\
copy /Y %BUILD_PATH%\platforms\android\build\outputs\apk\android-debug.apk D:\workspace\cordova\build\%BUILD_TARGET%.apk

echo ============================================
echo %DATE% %TIME% Build Cordova APK Completed
echo ============================================

echo ============================================
echo To Start Nanco Server
echo ============================================
echo Run nano-server.cmd D:\workspace\build
echo ============================================