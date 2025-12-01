import sys
import os
import backend
import backend.app

with open("debug_import.txt", "w") as f:
    f.write(f"CWD: {os.getcwd()}\n")
    f.write(f"sys.path:\n")
    for p in sys.path:
        f.write(f"  {p}\n")
    
    f.write(f"\nbackend file: {backend.__file__}\n")
    f.write(f"backend.app file: {backend.app.__file__}\n")
