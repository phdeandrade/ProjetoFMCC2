from app.utils import montar_step, unir
from app.tcr_solver import passo1_verificacao, passo2_simplificacao, passos3_4_5_tcr

def resolver_sistema_tcr(dados):
    """Recebe o JSON do frontend e processa as equações separando rigidamente Verificação e Simplificação."""
    equacoes = dados.get('equacoes', [])
    if not equacoes:
        return {"status": "erro", "mensagem": "Nenhuma equação recebida."}

    # ==============================
    # PASSO 1: VERIFICAÇÃO DA SOLUÇÃO
    # ==============================
    resultado_verificacao = passo1_verificacao(equacoes)

    # Se retornou um dict, houve erro e a função já encerrou cedo
    if isinstance(resultado_verificacao, dict):
        return resultado_verificacao

    linhas_p1 = resultado_verificacao

    # ==============================
    # PASSO 2: SIMPLIFICAÇÃO DAS EQUAÇÕES
    # ==============================
    linhas_p2, restos, modulos = passo2_simplificacao(equacoes)

    # ==============================
    # PASSOS 3, 4 e 5: CALCULAR M, INVERSOS E FÓRMULA FINAL
    # ==============================
    linhas_p3, linhas_p4, linhas_p5 = passos3_4_5_tcr(restos, modulos)

    # ==============================
    # CONSTRUÇÃO DAS 5 DIVS EM HTML (SUCESSO TOTAL)
    # ==============================
    explicacao = "".join([
        montar_step("Passo 1: Verificação da solução", unir(linhas_p1)),
        montar_step("Passo 2: Simplificação das equações", unir(linhas_p2)),
        montar_step("Passo 3: Calcular M e n<sub>k</sub>", unir(linhas_p3)),
        montar_step("Passo 4: Calcular inversos", unir(linhas_p4)),
        montar_step("Passo 5: Aplicar na fórmula final", unir(linhas_p5)),
    ])

    return {"status": "sucesso", "mensagem": explicacao}