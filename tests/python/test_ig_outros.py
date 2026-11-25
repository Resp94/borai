import json
import os
import unittest

from tests.python.helpers import load_tool, run_tool, tool_path

caption = load_tool("ig-caption", "caption.py")
swipe = load_tool("ig-viral", "swipe.py")


def status(a, nome):
    return next(c for c in a["checks"] if c["check"] == nome)


class CaptionTest(unittest.TestCase):
    def test_caption_conta_ctas_ptbr(self):
        a = caption.analyse("Perdi R$ 18 mil numa cláusula.\n\nComenta EU QUERO que eu te mando.\nE salva esse post.")
        self.assertEqual(len(a["asks"]), 2, a["asks"])
        self.assertEqual(status(a, "UM PEDIDO")["status"], "ATENÇÃO")

    def test_caption_um_pedido_so(self):
        a = caption.analyse("Perdi R$ 18 mil numa cláusula.\n\nLink na bio.")
        self.assertEqual(status(a, "UM PEDIDO")["status"], "OK")

    def test_caption_corte_com_acentos(self):
        texto = "Ação " * 40
        a = caption.analyse(texto)
        self.assertTrue(a["truncated"])
        self.assertEqual(len(a["visible"]), caption.TRUNCATE)

    def test_caption_hashtag_acentuada(self):
        a = caption.analyse("Primeira linha concreta com 3 dicas.\n\n#educação #finanças")
        self.assertEqual(a["hashtags"], ["#educação", "#finanças"])

    def test_caption_cli_ptbr(self):
        r = run_tool("ig-caption", "caption.py", ["-"], stdin="Perdi R$ 18 mil.\n\nLink na bio.")
        self.assertIn("O QUE O FEED MOSTRA", r.stdout)


class SwipeTest(unittest.TestCase):
    def test_swipe_hooks_padrao(self):
        self.assertTrue(os.path.exists(swipe.HOOKS), swipe.HOOKS)
        self.assertEqual(len(swipe.load_formulas(swipe.HOOKS)), 26)

    def test_swipe_classifica_ptbr(self):
        formulas = swipe.load_formulas(swipe.HOOKS)
        fid, _ = swipe.classify("R$ 40 mil foi o que um contrato mal feito me custou", formulas)
        self.assertEqual(fid, 1)

    def test_swipe_pontua_ganchos(self):
        self.assertIsNotNone(swipe.score_hook)

    def test_swipe_cli_ptbr(self):
        tsv = "conta\tseguidores\tmediana\tviews\tgancho\n@alguem\t48000\t11000\t412000\tNinguém te conta que os primeiros 30 reels flopam\n"
        r = run_tool("ig-viral", "swipe.py", ["-"], stdin=tsv)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("Ninguém Te Conta", r.stdout)
        self.assertIn("37.5x", r.stdout)


class RubricTest(unittest.TestCase):
    def test_rubric_ptbr(self):
        with open(tool_path("ig-profile", "rubric.json"), encoding="utf-8") as fh:
            d = json.load(fh)
        self.assertEqual(len(d["items"]), 12)
        self.assertEqual(sum(i["points"] for i in d["items"]), 100)
        for i in d["items"]:
            for campo in ("full_marks", "common_fail"):
                self.assertNotRegex(i[campo], r"(?i)\b(?:the|and|with|your)\b", i["id"])


if __name__ == "__main__":
    unittest.main()


class ReviewFixesTest(unittest.TestCase):
    def test_contagem_abreviada_ptbr(self):
        casos = {"412 mil": 412000, "1,2 mi": 1200000, "12k": 12000, "1.2M": 1200000,
                 "412.000": 412000, "48000": 48000, "3,5 mil": 3500, "2 milhões": 2000000}
        for texto, esperado in casos.items():
            with self.subTest(texto=texto):
                self.assertEqual(swipe.parse_count(texto), esperado)

    def test_swipe_ranqueia_com_mil(self):
        tsv = "conta\tseguidores\tmediana\tviews\tgancho\n@a\t48 mil\t11 mil\t1,2 mi\tNinguém te conta isso\n"
        r = run_tool("ig-viral", "swipe.py", ["-"], stdin=tsv)
        self.assertIn("109.1x", r.stdout)

    def test_caption_nfd(self):
        import unicodedata
        a = caption.analyse(unicodedata.normalize("NFD", "Ação concreta.\n\n#educação"))
        self.assertEqual(a["hashtags"], ["#educação"])
