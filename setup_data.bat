@echo off
echo Adding sample data to database...
echo.

cd backend
python add_sample_data.py

echo.
echo ✅ Sample data added successfully!
echo 🌐 Open http://localhost:3000 to view the app
echo.
pause
