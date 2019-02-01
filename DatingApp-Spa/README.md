Do odpalenia potrzebne są:
 git: https://git-scm.com/download/win 
 .NET Core 2.2: https://dotnet.microsoft.com/download/thank-you/dotnet-sdk-2.2.103-windows-x64-installer
 node: https://nodejs.org/en/
 
po ukończeniu instalacji w dwóch osobnych oknach wiersza poleceń (cmd) trzeba odpalić pniższe komendy:
w pierszym oknie cmd w folderze .\DatingApp.Api\:
dotnet ef database update
dotnet run

w drugim oknie cmd w folderze .\DatingApp-Spa\:
npm install -g @angular/cli
npm install
ng serve