$tmp = $env:TEMP

Function Reload-Path {
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")
}

Function Download-File($url, $targetFile, $auth) {
   $uri = New-Object "System.Uri" "$url"
   $request = [System.Net.HttpWebRequest]::Create($uri)
   $request.AllowAutoRedirect=$true
   if($auth) {
   }
   $request.set_Timeout(15000) #15 second timeout
   $response = $request.GetResponse()
   $responseContentLength = $response.get_ContentLength()

   if([int]$response.StatusCode -eq 200) {
     if(-not ($responseContentLength -lt 1024) ) {
       $totalLength = [System.Math]::Floor($response.get_ContentLength()/1024)
     } else {
       $totalLength = [System.Math]::Floor(1024/1024)
     }
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
     Write-Progress -completed -activity "Downloading file '$($url.split('/') | Select -Last 1)'" -status "Downloaded ($([System.Math]::Floor($downloadedBytes/1024))K of $($totalLength)K): " -PercentComplete 100
     $targetStream.Flush()
     $targetStream.Close()
     $targetStream.Dispose()
     $responseStream.Dispose()
   }
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
    Download-And-Install "node" "http://nodejs.org/dist/v0.12.4/node-v0.12.4-x86.msi" "$tmp\node.msi"
  }

  if(-not(Get-Command git 2>$null)) {
      echo "Git not installed. Downloading Git..."
      Download-File "https://raw.githubusercontent.com/unumux/ux-cli/master/setup/git.inf" "$tmp\git.inf"
      Download-File "https://github.com/git-for-windows/git/releases/download/v2.5.1.windows.1/Git-2.5.1-32-bit.exe" "$tmp\git-install.exe"
      echo "Installing Git..."
      & "$tmp\git-install.exe" /LOADINF="$tmp\git.inf" /SILENT | Out-Null
      Reload-Path
  }

  git config --global url."https://".insteadOf git://

  npm install -g `@unumux/ux-cli bower
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
