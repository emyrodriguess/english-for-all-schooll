# Plano de implementação — sistema interno

Atualizado em 10/09/2026. Este documento registra as tarefas executadas para transformar o PRD em uma aplicação operacional. O detalhamento de regras continua pertencendo a `PRD.md` e `DECISIONS.md`.

## 1. Fundação e segurança — concluído

- Namespace exclusivo `/admin`, com `/admin/login`, `/admin/alterar-senha` e áreas protegidas.
- Redirecionamento de `/admin` conforme sessão e perfil interno ativo.
- Supabase Auth com sessão SSR, renovação de cookies e troca obrigatória da senha temporária.
- `public.profiles` separado de `auth.users`; novos perfis nascem inativos.
- RLS em todas as tabelas privadas, funções transacionais protegidas e buckets privados.
- Datas de negócio, instantes e valores monetários tipados conforme o PRD.

## 2. Dados e persistência — concluído

- Schema versionado em `supabase/migrations/` e aplicado ao projeto remoto.
- Alunos, responsáveis, contratos, cobranças, pagamentos, agenda, turmas, planner, importações e outbox de WhatsApp.
- Restrições para evitar sobreposição de horários, duplicidade de vínculos e pagamentos incompatíveis.
- Operações sensíveis transacionais para criação de aluno, contrato, renovação, cancelamento, baixa, encerramento de turma, agenda e planner.
- Automação financeira agendada no banco para atualizar inadimplência e enfileirar mensagens.

## 3. Experiência administrativa — concluído

- Shell responsivo inspirado no Mockup 1 aprovado e construído com o design system ativo.
- Dashboard com cinco indicadores, gráfico financeiro, agenda do dia, vencimentos e contratos próximos do fim.
- Alunos com busca, filtros, paginação, cadastro, ficha, responsáveis, contrato, financeiro, turma, histórico e cancelamento.
- Agenda com grade recorrente, filtros, criação de horários, atribuição, liberação e desativação com preservação de histórico.
- Turmas com busca, status, cadastro, participantes, movimentações, encerramento e atalho para o planner.
- Financeiro com indicadores, filtros, paginação, baixa, comprovantes privados e execução manual da automação.
- Planner individual e por turma, notas individuais, edição, filtros e histórico relacionado.
- Estados de carregamento, vazio, sucesso e erro nos fluxos concluídos.

## 4. Importações — concluído

- Modelos CSV para alunos, contratos, turmas, agenda, financeiro e planner.
- Upload privado, limite de 10 MB e até 10.000 linhas.
- Preview, validação por linha, detecção de duplicidade, confirmação e resultado persistido.
- Importação de agenda realizada de forma atômica para proteger conflitos de horário.

## 5. Integrações — ambiente concluído

- Outbox e domínio financeiro independentes do fornecedor de mensagens.
- Adapter de WhatsApp e variáveis de ambiente preparados.
- Envio real permanece deliberadamente desativado até a escolha do provedor e do template homologado.

## 6. Validação — concluído

- Testes SQL de RLS, políticas, buckets, vencimentos e cron.
- Testes E2E de autenticação e regressão da landing page.
- Verificação de lint, tipos, build, lock da landing e auditoria de dependências.
- Advisors do Supabase executados após o DDL.
- QA visual do login, dashboard e alunos contra o Mockup 1.

## 7. Única ativação externa pendente

- Criar Emily no Supabase Auth com o e-mail real, ativar somente o perfil correspondente e entregar uma senha temporária. A aplicação exigirá a troca dessa senha no primeiro acesso.
- Esta etapa não altera o produto nem o schema e depende apenas da identificação da conta real.
