#!/usr/bin/env python3
# Repères : tools/make_cues_auto.py
import subprocess, sys
subprocess.run([sys.executable, "/home/claude/marcio-mota-tech/autopilot/tools/make_cues_auto.py", sys.argv[1], "s06", "s10", "s11"], check=True)
