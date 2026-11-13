#!/usr/bin/env python3
# Repères : tools/make_cues_auto.py
import subprocess, sys
subprocess.run([sys.executable, "/home/claude/marcio-mota-tech/autopilot/tools/make_cues_auto.py", sys.argv[1], "s04", "s07", "s09"], check=True)
