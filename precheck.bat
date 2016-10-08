@echo off

cd /d %~dp0

echo Executing Pre Check

call jshint --extract=auto www\index.html
call jshint www\js\index.js
call jshint www\js\file_util.js
call jshint www\js\trip_config.js
