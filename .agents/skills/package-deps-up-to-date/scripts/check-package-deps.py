#!/usr/bin/env python3
"""Compatibility wrapper for the shared package dependency script."""

from __future__ import annotations

import runpy
from pathlib import Path


CANONICAL_SCRIPT = (
    Path(__file__).resolve().parents[4]
    / ".agent/skills/package-deps-up-to-date/scripts/check-package-deps.py"
)


if __name__ == "__main__":
    runpy.run_path(str(CANONICAL_SCRIPT), run_name="__main__")
