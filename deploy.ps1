Remove-Item .\SpaceTraders -Recurse -Force
mkdir .\SpaceTraders

mkdir .\data
Copy-Item -Path ..\ShinySpaceTraders\dist\data\systems.json.gz -Destination .\data\

mkdir .\SpaceTraders\game
Copy-Item -Path ..\ShinySpaceTraders\dist\web\prod\game*.* -Destination .\SpaceTraders\game\ -Recurse
Remove-Item -Force .\SpaceTraders\game\*.map
Move-Item .\SpaceTraders\game\gameApp.html .\SpaceTraders\game\index.html

mkdir .\SpaceTraders\terminal
Copy-Item -Path ..\ShinySpaceTraders\dist\web\prod\terminal*.* -Destination .\SpaceTraders\terminal\ -Recurse
Remove-Item -Force .\SpaceTraders\terminal\*.map
Move-Item .\SpaceTraders\terminal\terminalApp.html .\SpaceTraders\terminal\index.html
