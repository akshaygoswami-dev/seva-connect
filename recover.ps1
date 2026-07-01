$transcriptPath = "C:\Users\Akshay\.gemini\antigravity\brain\b63ab9ba-08db-4746-a611-6034cbee77bd\.system_generated\logs\transcript_full.jsonl"
$targetDir = "C:\Users\Akshay\.gemini\antigravity\scratch\seva-connect"

Get-Content $transcriptPath | ForEach-Object {
    $line = $_
    if ($line -match '"name":"write_to_file"') {
        try {
            $json = $line | ConvertFrom-Json
            
            if ($json.type -eq "PLANNER_RESPONSE") {
                foreach ($call in $json.tool_calls) {
                    if ($call.name -eq "write_to_file") {
                        $targetFile = $call.args.TargetFile
                        $codeContent = $call.args.CodeContent
                        
                        if ($targetFile -match 'awareness-.*\.html') {
                            # Extract just the filename
                            $fileName = Split-Path $targetFile -Leaf
                            $fullPath = Join-Path $targetDir $fileName
                            
                            [System.IO.File]::WriteAllText($fullPath, $codeContent)
                            Write-Host "Recovered: $fileName"
                        }
                    }
                }
            }
        } catch {
            # Ignore parse errors
        }
    }
}
