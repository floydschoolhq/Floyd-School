# PowerShell script to check .env file content
$envPath = ".\.env"

if (Test-Path $envPath) {
    Write-Host ".env file contents:"
    Write-Host "=================="
    Get-Content $envPath | ForEach-Object { 
        if ($_ -match "^#") {
            Write-Host $_ -ForegroundColor Gray
        } elseif ($_ -match "=") {
            $key, $value = $_.Split("=", 2)
            if ($key -match "SECRET|PASSWORD") {
                Write-Host "$key=***REDACTED***" -ForegroundColor Yellow
            } else {
                Write-Host "$key=$value" -ForegroundColor Green
            }
        } else {
            Write-Host $_ -ForegroundColor White
        }
    }
} else {
    Write-Host ".env file not found!" -ForegroundColor Red
}
