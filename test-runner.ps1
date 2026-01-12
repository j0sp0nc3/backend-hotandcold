# TEST RUNNER - Hot and Cold Backend
# Ejecuta el suite de tests contra los servidores

param(
    [string]$Mode = "full",  # full, auth, contact
    [string]$Server = "production", # production, testing
    [switch]$Watch = $false
)

$colors = @{
    Green = [char]27 + "[32m"
    Red = [char]27 + "[31m"
    Yellow = [char]27 + "[33m"
    Cyan = [char]27 + "[36m"
    Reset = [char]27 + "[0m"
    Bold = [char]27 + "[1m"
}

function Log-Title {
    param([string]$Message)
    Write-Host "`n$($colors.Bold)$($colors.Cyan)$Message$($colors.Reset)"
}

function Log-Success {
    param([string]$Message)
    Write-Host "$($colors.Green)✓ $Message$($colors.Reset)"
}

function Log-Error {
    param([string]$Message)
    Write-Host "$($colors.Red)✗ $Message$($colors.Reset)"
}

function Log-Info {
    param([string]$Message)
    Write-Host "$($colors.Yellow)ℹ $Message$($colors.Reset)"
}

# Validar parámetros
if ($Server -notin "production", "testing") {
    Log-Error "Servidor inválido: $Server. Use 'production' o 'testing'"
    exit 1
}

if ($Mode -notin "full", "auth", "contact") {
    Log-Error "Modo inválido: $Mode. Use 'full', 'auth' o 'contact'"
    exit 1
}

$PORT = if ($Server -eq "production") { 3000 } else { 3001 }

Log-Title "TEST RUNNER - Backend Hot and Cold"
Log-Info "Servidor: $Server (puerto $PORT)"
Log-Info "Modo: $Mode"

# Verificar que Node.js esté disponible
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Log-Error "Node.js no está instalado o no está en el PATH"
    exit 1
}

# Ejecutar test-suite
Log-Title "Ejecutando tests..."
Write-Host ""

$testArgs = @($PORT, $Mode)
& node test-suite.js @testArgs

$exitCode = $LASTEXITCODE

if ($exitCode -eq 0) {
    Log-Success "Tests completados exitosamente"
} else {
    Log-Error "Algunos tests fallaron"
}

exit $exitCode
