import unittest

from tests.python.helpers import load_tool, run_tool

humanize = load_tool("ig-human", "humanize.py")
detect = load_tool("ig-human", "detect.py")
LEX = humanize.load_lexicon()

IA = ("Neste cenário em constante evolução, é fundamental mergulhar fundo e potencializar resultados. "
      "Vale ressaltar que a jornada do cliente é crucial. Além disso, é importante destacar que a "
      "transformação digital alavanca soluções inovadoras. Em suma, o sucesso depende de estratégias robustas.")
HUMANO = ("Perdi R$ 18 mil num contrato sem uma cláusula. Uma. Hoje eu leio tudo, até o rodapé, "
          "e você devia fazer o mesmo antes de assinar qualquer coisa com a Prefeitura de Campinas. "
          "Foi em março de 2024, com um cliente que eu achava que conhecia há anos. Não conhecia. "
          "Tá aí a lição: pra quem tem agência pequena, um papel mal lido custa o mês inteiro.")


class HumanizeTest(unittest.TestCase):
    def test_lexico_ptbr(self):
        out, _ = humanize.humanize(
            "Vale ressaltar que, no cenário atual, precisamos potencializar a jornada.", LEX)
        low = out.lower()
        for termo in ("vale ressaltar", "no cenário atual", "potencializar", "jornada"):
            self.assertNotIn(termo, low)

    def test_preserva_acentos(self):
        out, _ = humanize.humanize("Ação rápida: você não vai errar.", LEX)
        self.assertEqual(out.strip(), "Ação rápida: você não vai errar.")

    def test_remove_invisiveis_e_travessao(self):
        out, _ = humanize.humanize("Isso​ funciona — de verdade.", LEX)
        self.assertNotIn("​", out)
        self.assertNotIn("—", out)

    def test_maiuscula_acentuada_restaurada(self):
        out, _ = humanize.humanize("Vale ressaltar que é simples. Vale ressaltar que ótimo.", LEX)
        for frase in out.split(". "):
            self.assertTrue(frase[:1].isupper(), out)

    def test_estrutura_ptbr_sinalizada(self):
        _, report = humanize.humanize("Não é só sobre dinheiro, é sobre liberdade.", LEX)
        self.assertTrue(report["structures"], report)

    def test_troca_mantem_genero(self):
        out, _ = humanize.humanize("A jornada do cliente começa aqui.", LEX)
        self.assertNotIn("A caminho", out)

    def test_pontuacao_apos_apagar_abertura(self):
        out, _ = humanize.humanize("Foi bom. Em suma, o resto deu certo.", LEX)
        self.assertNotIn(".,", out)
        self.assertIn("O resto deu certo", out)

    def test_lexico_tem_tamanho(self):
        self.assertGreaterEqual(len(LEX["words"]) + len(LEX["phrases"]), 120)


class DetectTest(unittest.TestCase):
    def test_detect_ptbr_humano_vs_ia(self):
        _, nota_humano, _ = detect.run(HUMANO, LEX)
        _, nota_ia, _ = detect.run(IA, LEX)
        self.assertGreater(nota_humano, nota_ia)

    def test_palavras_acentuadas(self):
        self.assertEqual(detect.words("Ação é você"), ["Ação", "é", "você"])


class CliTest(unittest.TestCase):
    def test_cli_report_em_ptbr(self):
        r = run_tool("ig-human", "humanize.py", ["-", "--report"],
                     stdin="Vale ressaltar que isso é crucial.")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("substitu", r.stderr.lower())

    def test_cli_detect_em_ptbr(self):
        r = run_tool("ig-human", "detect.py", ["-"], stdin=HUMANO)
        self.assertIn("NOTA HUMANA", r.stdout)


if __name__ == "__main__":
    unittest.main()


class ReviewFixesTest(unittest.TestCase):
    def test_mantem_pedido_de_acao(self):
        out, _ = humanize.humanize("Perdi R$ 18 mil.\n\nSalva esse post pra não esquecer.", LEX)
        self.assertIn("Salva esse post pra não esquecer", out)
        out, _ = humanize.humanize("Me conta nos comentários o que você faria.", LEX)
        self.assertIn("Me conta nos comentários", out)

    def test_e_essencial_no_meio_da_frase_fica(self):
        out, _ = humanize.humanize("Dormir bem é essencial para quem trabalha à noite.", LEX)
        # A palavra pode ser trocada por sinônimo; a locução não pode sumir.
        self.assertRegex(out, r"^Dormir bem é (?:essencial|importante) para quem trabalha à noite\.")

    def test_e_fundamental_abrindo_frase_sai(self):
        out, _ = humanize.humanize("Foi difícil. É fundamental dormir cedo.", LEX)
        self.assertNotIn("fundamental", out)

    def test_emoji_com_zwj_intacto(self):
        texto = "Programador 👨‍💻 e bandeira 🏳️‍🌈 e Escócia 🏴󠁧󠁢󠁳󠁣󠁴󠁿 aqui."
        out, _ = humanize.humanize(texto, LEX)
        self.assertIn("👨‍💻", out)
        self.assertIn("🏳️‍🌈", out)
        self.assertIn("🏴󠁧󠁢󠁳󠁣󠁴󠁿", out)

    def test_zwj_solto_continua_saindo(self):
        out, _ = humanize.humanize("pala‍vra", LEX)
        self.assertNotIn("‍", out)

    def test_emoji_zwj_nao_conta_como_invisivel(self):
        score, _ = detect.check_fingerprint("Bom dia 👨‍💻 time.")
        self.assertEqual(score, 100.0)

    def test_texto_nfd(self):
        import unicodedata
        nfd = unicodedata.normalize("NFD", "Ação é você")
        self.assertEqual(detect.words(detect.nfc(nfd)), ["Ação", "é", "você"])
        out, _ = humanize.humanize(unicodedata.normalize("NFD", "Vale ressaltar que é bom."), LEX)
        self.assertNotIn("ressaltar", out)
