#!/usr/bin/env python3
# Repères : tools/make_cues_auto.py (impacts : calcul en francs, surprise durée de vie, × 12)
import subprocess, sys
subprocess.run([sys.executable, "/home/claude/marcio-mota-tech/autopilot/tools/make_cues_auto.py", sys.argv[1], "s06", "s09", "s11"], check=True)
