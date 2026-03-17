import os

for root, dirs, files in os.walk('app/admin'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            if '\\"' in content:
                print(f"Fixing {path}")
                content = content.replace('\\"', '"')
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
print("Done!")
