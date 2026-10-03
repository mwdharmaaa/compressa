@echo off
echo ==============================================================
echo   Running Automated Tests: Compressa
echo ==============================================================
npm.cmd run test
if %ERRORLEVEL% equ 0 (
    echo [OK] All test suites passed.
) else (
    echo [x] Tests failed!
)
