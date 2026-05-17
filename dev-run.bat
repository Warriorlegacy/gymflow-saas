@echo off
title GymFlow Auto Dev Script 🚀

echo ===============================
echo Starting GymFlow Setup...
echo ===============================

cd /d D:\GymFlow

echo.
echo 🔹 Installing dependencies...
call npm install

echo.
echo 🔹 Setting up Supabase (if needed)...
cd supabase
if exist "config.toml" (
    echo Supabase already initialized
) else (
    supabase init
)
cd ..

echo.
echo 🔹 Running database migrations...
supabase db push

echo.
echo 🔹 Building app...
call npm run build

echo.
echo 🔹 Starting dev server...
start cmd /k "npm run dev"

echo.
echo 🔹 Deploying to Vercel...
call npx vercel --prod

echo.
echo ===============================
echo ✅ GymFlow is LIVE 🚀
echo ===============================

pause