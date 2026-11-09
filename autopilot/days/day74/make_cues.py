#!/usr/bin/env python3
"""Repères sonores du jour 74 (générique : tools/make_cues_auto.py, impacts sur les chiffres forts)."""
import subprocess, sys, pathlib
R = pathlib.Path(__file__).resolve().parents[2]
subprocess.run([sys.executable, str(R / 'tools/make_cues_auto.py'), sys.argv[1], 's02', 's05', 's09', 's10', 's15'], check=True)
