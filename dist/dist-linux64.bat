cd %~dp0
del HIDE-linux64.tar
7za.exe a -ttar -xr!.git -xr!dist -xr!runtime\linux-32 -xr!runtime\windows -x!.gitattributes -x!.travis.yml -x!.travis.yml.template -x!windows.bat -x!README.md HIDE-linux64.tar %~dp0../*
7za.exe a HIDE-linux64.tar.gz HIDE-linux64.tar
del HIDE-linux64.tar