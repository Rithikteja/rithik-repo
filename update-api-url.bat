@echo off
REM Update Frontend API URL for Deployment
REM Usage: update-api-url.bat https://your-backend-url.onrender.com

if "%1"=="" (
    echo Usage: update-api-url.bat https://your-api-url.onrender.com
    echo Example: update-api-url.bat https://smartparking-api.onrender.com
    exit /b 1
)

set API_URL=%1
echo Updating frontend API URLs to: %API_URL%

REM Update all HTML files
for %%f in (src\main\resources\static\*.html) do (
    echo Processing: %%f
    setlocal enabledelayedexpansion
    (
        for /f "delims=" %%a in (%%f) do (
            set line=%%a
            set line=!line:http://localhost:8080=%API_URL%!
            echo !line!
        )
    ) > %%f.tmp
    move /y %%f.tmp %%f
    endlocal
)

echo Done! API URLs updated to %API_URL%
echo Run: git commit -am "Update API URL to %API_URL%"
