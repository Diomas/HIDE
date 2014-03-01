cd %~dp0
del HIDE-windows.zip
7za.exe a -tzip -xr!.git -xr!dist -xr!runtime\linux-* -x!.gitattributes -x!.travis.yml -x!.travis.yml.template -x!linux.run -x!README.md HIDE-windows.zip %~dp0../*