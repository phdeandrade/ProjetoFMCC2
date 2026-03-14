# ============================================================
# FUNÇÕES AUXILIARES
# ============================================================

def montar_step(titulo, conteudo):
    """Gera o HTML de um bloco 'step' com título e conteúdo."""
    return (
        f"<div class='step'>"
        f"<div class='step-title'>{titulo}</div>"
        f"<p>{conteudo}</p>"
        f"</div>"
    )


def unir(linhas):
    """Junta uma lista de strings com <br> para exibição HTML."""
    return "<br>".join(linhas)


def formatar_sinal(b):
    """Formata o termo independente b com seu sinal para uso em strings LaTeX."""
    if b > 0:
        return f"+ {b}"
    if b < 0:
        return f"- {abs(b)}"
    return ""


def erro_precoce(titulo, linhas):
    """Retorna um resultado de sucesso parcial (erro matemático detectado)."""
    return {"status": "sucesso", "mensagem": montar_step(titulo, unir(linhas))}