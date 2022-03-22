rmdir /S /Q dist
mkdir dist
xcopy /Y backend\ dist\
mkdir dist\static
cd frontend
npm install | echo
npm run build | echo
xcopy /S /Y build ..\dist\static