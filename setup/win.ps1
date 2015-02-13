$tmp = $env:TEMP

Function Reload-Path {
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")
}

Function Download-File($url, $targetFile) {
   $uri = New-Object "System.Uri" "$url"
   $request = [System.Net.HttpWebRequest]::Create($uri)
   $request.set_Timeout(15000) #15 second timeout
   $response = $request.GetResponse()
   $totalLength = [System.Math]::Floor($response.get_ContentLength()/1024)
   $responseStream = $response.GetResponseStream()
   $targetStream = New-Object -TypeName System.IO.FileStream -ArgumentList $targetFile, Create
   $buffer = new-object byte[] 10KB
   $count = $responseStream.Read($buffer,0,$buffer.length)
   $downloadedBytes = $count
   while ($count -gt 0)
   {
       $targetStream.Write($buffer, 0, $count)
       $count = $responseStream.Read($buffer,0,$buffer.length)
       $downloadedBytes = $downloadedBytes + $count
       Write-Progress -activity "Downloading file '$($url.split('/') | Select -Last 1)'" -status "Downloaded ($([System.Math]::Floor($downloadedBytes/1024))K of $($totalLength)K): " -PercentComplete ((([System.Math]::Floor($downloadedBytes/1024)) / $totalLength)  * 100)
   }
   Write-Progress -completed -activity "Downloading file '$($url.split('/') | Select -Last 1)'" -status "Downloaded ($([System.Math]::Floor($downloadedBytes/1024))K of $($totalLength)K): " -PercentComplete ((([System.Math]::Floor($downloadedBytes/1024)) / $totalLength)  * 100)
   $targetStream.Flush()
   $targetStream.Close()
   $targetStream.Dispose()
   $responseStream.Dispose()
}

Function Download-And-Install($name, $url, $file) {
  echo "$name not installed. Downloading $name..."
  Download-File $url $file
  echo "Installing $name..."
  $installStatement = [System.Diagnostics.Process]::Start( "msiexec", "/i $file /quiet" )
  $installStatement.WaitForExit()
  Reload-Path
}

Function Run-Main {
  echo "Checking for dependencies..."


  if(-not (Get-Command node 2>$null)) {
    Download-And-Install "node" "http://nodejs.org/dist/v0.10.36/node-v0.10.36-x86.msi" "$tmp\node.msi"
  }

  if(-not (Get-Command git 2>$null)) {
    echo "git not installed. Downloading git..."
    Download-File "https://7c42ce73f8853826cd1e3a5d47002c7ff693164f:x-oauth-basic@raw.githubusercontent.com/unumux/generator-unumux/master/setup/wingitsetup.inf" "$tmp\wingitsetup.inf"
    Download-File "https://github.com/msysgit/msysgit/releases/download/Git-1.9.5-preview20141217/Git-1.9.5-preview20141217.exe" "$tmp\git.exe"
    echo "Installing git..."
    $installStatement = [System.Diagnostics.Process]::Start( "$tmp\git.exe", "/verysilent /loadinf=`"$tmp\wingitsetup.inf`"" )
    $installStatement.WaitForExit()
    Reload-Path
  }

  git config --global url."https://".insteadOf git://

  npm install -g grunt-cli bower yo
  npm i git+https://7c42ce73f8853826cd1e3a5d47002c7ff693164f:x-oauth-basic@github.com/unumux/generator-unumux.git -g
}


$myWindowsID=[System.Security.Principal.WindowsIdentity]::GetCurrent()
$myWindowsPrincipal=new-object System.Security.Principal.WindowsPrincipal($myWindowsID)

# Get the security principal for the Administrator role
$adminRole=[System.Security.Principal.WindowsBuiltInRole]::Administrator

# Check to see if we are currently running "as Administrator"
if ($myWindowsPrincipal.IsInRole($adminRole))
   {
   # We are running "as Administrator" - so change the title and background color to indicate this
   $Host.UI.RawUI.WindowTitle = $myInvocation.MyCommand.Definition + "(Elevated)"
   $Host.UI.RawUI.BackgroundColor = "DarkBlue"
   clear-host
   }
else
   {
   # We are not running "as Administrator" - so relaunch as administrator

   # Create a new process object that starts PowerShell
   $newProcess = new-object System.Diagnostics.ProcessStartInfo "PowerShell";

   # Specify the current script path and name as a parameter
   $newProcess.Arguments = $myInvocation.MyCommand.Definition;

   # Indicate that the process should be elevated
   $newProcess.Verb = "runas";

   # Start the new process
   [System.Diagnostics.Process]::Start($newProcess);

   # Exit from the current, unelevated, process
   exit
   }

Run-Main

Write-Host -NoNewLine "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
