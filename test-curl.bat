@echo off
REM test-curl.bat - Test script for API endpoints

set URL=http://localhost:3000/api/register
set BODY={"username":"testuser","password":"password123"}

echo Testing API with curl...
echo URL: %URL%
echo Body: %BODY%
echo.

curl -X POST %URL% ^
  -H "Content-Type: application/json" ^
  -d "%BODY%" ^
  -v

pause
