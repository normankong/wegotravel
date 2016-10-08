@echo off

cd /d %~dp0

echo Executing Pre Check

call jshint --extract=auto www\index.html
call jshint www\js\
