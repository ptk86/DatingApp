$apiPath = ".\DatingApp.Api"
Start-Process dotnet -ArgumentList "ef database update" -WorkingDirectory $apiPath -Wait
Start-Process dotnet -ArgumentList "run" -WorkingDirectory $apiPath

$spaPath = ".\DatingApp-Spa"
Start-Process npm -ArgumentList "install" -WorkingDirectory $spaPath -Wait
Start-Process npm -ArgumentList "start" -WorkingDirectory $spaPath

exit
