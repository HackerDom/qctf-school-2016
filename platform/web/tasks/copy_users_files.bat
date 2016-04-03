for /d %%i in (../../../tasks/*) do (
    echo %%i
    rm -f %%i\user\*
    rmdir  %%i\user
    mkdir %%i\user
    xcopy ..\..\..\tasks\%%i\user\* %%i\user\
)