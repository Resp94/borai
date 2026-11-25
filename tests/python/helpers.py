"""Helpers to load and run the bundled agent tools (agents/<agent>/tools/<script>.py)."""
import importlib.util
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AGENTS = ROOT / "agents"


def tool_path(agent, script):
    return AGENTS / agent / "tools" / script


def load_tool(agent, script):
    path = tool_path(agent, script)
    name = f"_tool_{agent}_{path.stem}".replace("-", "_")
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def run_tool(agent, script, args, stdin=""):
    return subprocess.run(
        [sys.executable, str(tool_path(agent, script)), *args],
        input=stdin, capture_output=True, encoding="utf-8",
    )
