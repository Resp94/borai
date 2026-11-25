import json
import re
import unittest

from tests.python.helpers import load_tool, run_tool, tool_path

hookscore = load_tool("ig-reel", "hookscore.py")
beats = load_tool("ig-reel", "beats.py")
FORTE = "Perdi R$ 18 mil por causa de uma cláusula."


class HookscoreTest(unittest.TestCase):
    def test_palavras_acentuadas(self):
        self.assertEqual(hookscore.words("Ação é você"), ["Ação", "é", "você"])

    def test_dinheiro_e_uma_palavra(self):
        self.assertIn("R$18.000", hookscore.words("Perdi R$ 18.000 ontem"))

    def test_gancho_fraco_ptbr(self):
        _, fraco, _, flags = hookscore.run("Oi gente, neste vídeo eu vou te mostrar uma coisa")
        _, forte, _, _ = hookscore.run(FORTE)
        self.assertGreaterEqual(len(flags), 1)
        self.assertLess(fraco, forte)

    def test_para_de_rolar(self):
        _, _, _, flags = hookscore.run("Para de rolar o feed agora")
        self.assertTrue(flags)

    def test_gancho_forte_tem_concretude_e_tensao(self):
        results, _, _, _ = hookscore.run(FORTE)
        self.assertGreaterEqual(results["CONCRETUDE"][0], 70)
        self.assertGreaterEqual(results["TENSÃO"][0], 70)

    def test_numero_falado_por_extenso(self):
        results, _, _, _ = hookscore.run("Vinte mil reais jogados fora numa tarde")
        self.assertGreaterEqual(results["CONCRETUDE"][0], 70)

    def test_fala_com_voce(self):
        results, _, _, _ = hookscore.run("Você está escrevendo legenda errado")
        self.assertEqual(results["DESTINATÁRIO"][0], 100.0)


class HooksJsonTest(unittest.TestCase):
    def setUp(self):
        with open(tool_path("ig-reel", "hooks.json"), encoding="utf-8") as fh:
            self.data = json.load(fh)

    def test_hooks_json_ptbr(self):
        hooks = self.data["hooks"]
        self.assertEqual(len(hooks), 26)
        self.assertEqual(sorted(self.data["classify_order"]), list(range(1, 27)))
        for h in hooks:
            for campo in ("name", "template", "example", "on_screen", "best_for", "trap"):
                self.assertNotRegex(h[campo], r"(?i)\b(?:the|you|and|with)\b", f"{h['id']} {campo}")
            re.compile(h["match"])

    def test_cada_exemplo_casa_com_a_propria_formula(self):
        for h in self.data["hooks"]:
            with self.subTest(formula=h["id"]):
                self.assertRegex(h["example"], re.compile(h["match"], re.IGNORECASE))


class BeatsTest(unittest.TestCase):
    def test_beats_padrao_150(self):
        a = beats.analyse("palavra " * 150)
        self.assertAlmostEqual(a["total_seconds"], 60, delta=1)
        self.assertEqual(a["wpm"], 150)

    def test_beats_loop_com_acento(self):
        a = beats.analyse("A cláusula me custou caro.\nLeia a cláusula.")
        self.assertTrue(any("cláusula" in n for n in a["notes"]), a["notes"])


class CliTest(unittest.TestCase):
    def test_cli_saida_ptbr(self):
        r = run_tool("ig-reel", "hookscore.py", ["--hook", FORTE])
        self.assertIn("NOTA DO GANCHO", r.stdout)

    def test_cli_beats_ptbr(self):
        r = run_tool("ig-reel", "beats.py", ["-"], stdin="Perdi R$ 18 mil.\nNunca mais.")
        self.assertIn("FICHA DE TEMPO", r.stdout)


if __name__ == "__main__":
    unittest.main()
