# PowerShell script để test API local
# Chạy: .\test-api.ps1

$baseUrl = "http://localhost:3000"

Write-Host "🧪 Testing Backend API Local" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test Save Cookie
Write-Host "2. Testing Save Cookie..." -ForegroundColor Yellow
$body = @{
    groupId = "test-group"
    profileName = "test-profile"
    cookies = @(
        @{
            name = "session"
            value = "abc123"
            domain = ".example.com"
            path = "/"
            secure = $true
            httpOnly = $true
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/groups/save" -Method Post -Body $body -ContentType "application/json"
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test Get Group
Write-Host "3. Testing Get Group..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/groups/test-group" -Method Get
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ Test completed!" -ForegroundColor Green

