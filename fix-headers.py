import os
import re

files_to_fix = [
    "app/routes/exporter/lot-draft.tsx",
    "app/routes/exporter/scan-qr.tsx",
    "app/routes/exporter/consolidation.tsx",
    "app/routes/exporter/export/draft.tsx",
    "app/routes/exporter/weight.tsx",
    "app/routes/exporter/export/destination.tsx",
    "app/routes/exporter/tress.tsx",
    "app/routes/exporter/dashboard.tsx",
    "app/routes/exporter/products.tsx",
    "app/routes/exporter/storage.tsx",
    "app/routes/exporter/view-operation.tsx",
    "app/routes/exporter/product-pickup.tsx",
    "app/routes/exporter/product-transfer.tsx"
]

import_statement = "import { PageHeader } from '~/components/page-header'\n"

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r') as f:
        content = f.read()
        
    modified = False
    
    # Variant 1: standard chevron/plus
    farmer_regex_1 = re.compile(r'<div className="flex items-center gap-2[^>]*>[\s\S]*?Add Farmer\s*</div>')
    if farmer_regex_1.search(content):
        content = farmer_regex_1.sub('', content)
        modified = True
        
    # Variant 2: the complex one in lot-draft / tress
    farmer_regex_2 = re.compile(r'<div className="flex items-center gap-2 text-\[#1a4332\] text-\[11px\] font-bold uppercase tracking-widest">\s*<div className="size-4 rounded-sm border border-\[#1a4332\] flex items-center justify-center">\s*<Plus className="size-3" />\s*</div>\s*Add Farmer\s*</div>')
    if farmer_regex_2.search(content):
        content = farmer_regex_2.sub('', content)
        modified = True

    if "import { PageHeader }" not in content:
        content = content.replace("import ", import_statement + "import ", 1)
        modified = True
        
    if "<PageHeader" not in content:
        basename = os.path.basename(file_path).replace(".tsx", "")
        title = " ".join([w.capitalize() for w in basename.split('-')])
        
        # Use string concatenation to avoid f-string curly brace hell
        header_component = "<PageHeader\n" + \
        "        items={[\n" + \
        "          { label: 'Dashboard', href: '/exporter' },\n" + \
        "          { label: '" + title + "' },\n" + \
        "        ]}\n" + \
        "      />"
        
        return_regex = re.compile(r'return\s*\(\s*<div[^>]*>')
        match = return_regex.search(content)
        if match:
            insert_pos = match.end()
            content = content[:insert_pos] + "\n      " + header_component + "\n" + content[insert_pos:]
            modified = True
        else:
            fragment_regex = re.compile(r'return\s*\(\s*<>')
            match = fragment_regex.search(content)
            if match:
                insert_pos = match.end()
                content = content[:insert_pos] + "\n      " + header_component + "\n" + content[insert_pos:]
                modified = True
                
    if modified:
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Updated {file_path}")

