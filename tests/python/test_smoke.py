import unittest

from tests.python.helpers import load_tool

TOOLS = [
    ("ig-reel", "hookscore.py"), ("ig-reel", "beats.py"),
    ("ig-human", "humanize.py"), ("ig-human", "detect.py"),
    ("ig-caption", "caption.py"), ("ig-viral", "swipe.py"),
]


class SmokeTest(unittest.TestCase):
    def test_tools_import(self):
        for agent, script in TOOLS:
            with self.subTest(tool=f"{agent}/{script}"):
                self.assertTrue(hasattr(load_tool(agent, script), "main"))


if __name__ == "__main__":
    unittest.main()
