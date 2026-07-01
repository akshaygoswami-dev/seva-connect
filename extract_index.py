import json
import re

transcript_path = r"C:\Users\Akshay\.gemini\antigravity\brain\b63ab9ba-08db-4746-a611-6034cbee77bd\.system_generated\logs\transcript_full.jsonl"
target_path = r"C:\Users\Akshay\.gemini\antigravity\scratch\seva-connect\index.html"

index_content = None

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'TOOL_RESPONSE' or data.get('type') == 'RUN_COMMAND':
                # Sometimes view_file outputs as TOOL_RESPONSE or RUN_COMMAND content
                content = data.get('content', '') or data.get('output', '')
                if 'File Path: `file:///C:/Users/Akshay/.gemini/antigravity/scratch/seva-connect/index.html`' in content:
                    # Found a view_file output for index.html!
                    # Let's extract the actual code
                    if not index_content: # only grab the first one (oldest, most pristine)
                        index_content = content
                        break
        except Exception as e:
            pass

if index_content:
    # clean up the view_file line numbers
    lines = index_content.split('\n')
    cleaned_lines = []
    is_code = False
    for line in lines:
        if line.startswith('1: '):
            is_code = True
        
        if is_code:
            match = re.match(r'^\d+: (.*)$', line)
            if match:
                cleaned_lines.append(match.group(1))
            elif line.startswith('The above content does NOT show'):
                break
            else:
                cleaned_lines.append(line)
    
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(cleaned_lines))
    print("Successfully restored index.html!")
else:
    print("Could not find index.html in transcript.")
