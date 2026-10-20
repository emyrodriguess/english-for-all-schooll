# Design QA — sistema interno

Data: 10/09/2026  
Referência: Mockup 1 registrado em `docs/internal-system/DESIGN.md`

## Escopo verificado

- Login em viewport de 858 × 690 px.
- Dashboard e Alunos em comparação lado a lado com a referência, renderizados em viewport desktop de 1440 × 1000 px e reduzidos na mesma prancha.
- Dashboard e Alunos na largura compacta disponível no navegador do Codex.
- Interação de mostrar e ocultar senha.
- Console do navegador durante os fluxos inspecionados.

## Resultado

- A hierarquia visual corresponde à direção aprovada: sidebar azul-marinho, item ativo com trilho vermelho, canvas frio, cabeçalho compacto, cards claros e tabelas densas.
- Dashboard preserva a sequência de indicadores, gráfico, agenda e listas operacionais definida pelo PRD.
- Alunos preserva ações, busca, filtros, status, paginação e tabela com rolagem horizontal segura em larguras menores.
- Login mantém foco claro, legibilidade, contraste e controle acessível para exibir a senha.
- Não foram encontrados cortes críticos, sobreposição de controles, conteúdo ilegível ou erros de console.

## Decisões conscientes

- Os números e rótulos obedecem ao PRD, mesmo quando diferem dos dados ilustrativos do mockup.
- Em tablet, a sidebar vira menu e os indicadores reduzem colunas; em mobile, ações e campos se empilham.
- A tabela não foi convertida em cards genéricos, preservando densidade e comparação entre colunas.

Status final: aprovado para implementação e uso operacional.
