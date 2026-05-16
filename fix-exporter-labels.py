import os
import glob

files = glob.glob('app/routes/exporter/**/*.tsx', recursive=True)

for file_path in files:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r') as f:
        content = f.read()
        
    old_label = "{ label: 'Dashboard', href: '/exporter' }"
    new_label = "{ label: 'Exporter', href: '/exporter' }"
    
    if old_label in content:
        content = content.replace(old_label, new_label)
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Updated {file_path}")

