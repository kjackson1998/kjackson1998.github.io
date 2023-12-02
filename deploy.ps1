Remove-Item .\SpaceTraders -Recurse -Force
mkdir .\SpaceTraders

mkdir -Force .\data
Copy-Item -Path ..\ShinySpaceTraders\dist\data\systems.json.gz -Destination .\data\

mkdir -Force .\SpaceTraders\game
Copy-Item -Path ..\ShinySpaceTraders\dist\web\prod\game*.* -Destination .\SpaceTraders\game\ -Recurse
Remove-Item -Force .\SpaceTraders\game\*.map
Move-Item .\SpaceTraders\game\gameApp.html .\SpaceTraders\game\index.html

mkdir -Force .\SpaceTraders\terminal
Copy-Item -Path ..\ShinySpaceTraders\dist\web\prod\terminal*.* -Destination .\SpaceTraders\terminal\ -Recurse
Remove-Item -Force .\SpaceTraders\terminal\*.map
Move-Item .\SpaceTraders\terminal\terminalApp.html .\SpaceTraders\terminal\index.html
