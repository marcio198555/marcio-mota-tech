#!/usr/bin/env python3
import subprocess, sys
subprocess.run([sys.executable, "/home/claude/marcio-mota-tech/autopilot/tools/make_cues_auto.py", sys.argv[1], "s04", "s08", "s11"], check=True)
