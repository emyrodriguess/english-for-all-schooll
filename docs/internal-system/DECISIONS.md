# Decisões do sistema interno

Este documento complementa o PRD e registra decisões vinculantes do MVP. Em caso de conflito, a decisão mais recente registrada aqui prevalece sobre exemplos anteriores do PRD.

## DEC-001 — Proporcionalidade

O MVP não calcula proporcionalidade automaticamente. O contrato define `billing_start_date`, que determina a primeira competência. Se a primeira cobrança tiver valor diferente da mensalidade padrão, `first_invoice_amount` poderá ser informado. O sistema nunca deve adivinhar a regra comercial.

## DEC-002 — Cancelamento

O cancelamento registra `cancelled_at` e `cancellation_effective_date`. Cobranças pagas, vencidas e a competência corrente já gerada e válida permanecem. Cobranças de competências posteriores à data efetiva são canceladas. A operação deve ser transacional e preservar todo o histórico.

## DEC-003 — Contato financeiro

Um aluno pode ter vários responsáveis. Quando o contato financeiro for um responsável, `students.financial_guardian_id` deve apontar para um responsável ativo do próprio aluno. Quando for o aluno, esse campo deve ser nulo.

## DEC-004 — Pagamentos

Pagamentos parciais não existem no MVP. Cada cobrança aceita no máximo um pagamento e `payments.amount` deve ser igual a `invoices.amount`. `payments.payment_date` é a fonte de verdade; `invoices` não duplica a data do pagamento.

## DEC-005 — Agenda de turmas

Turmas não possuem dia e horário como fonte de verdade. A grade é formada por `weekly_slots` e seu histórico por `schedule_assignments`. Alterar o horário encerra o assignment anterior e cria outro.

## DEC-006 — Planner e auditoria

O MVP não versiona integralmente o texto de registros pedagógicos. Entidades sensíveis registram `created_at`, `updated_at`, `created_by` e `updated_by`. Versionamento completo poderá ser introduzido posteriormente.

## DEC-007 — WhatsApp

O domínio é independente de provedor. Uma transição para inadimplência cria, de forma idempotente, um item de outbox. Um adapter de provedor realiza o envio e registra tentativas e resultado. A escolha do provedor não bloqueia os demais fluxos do MVP.

## DEC-008 — Autenticação e autorização

Supabase Auth é a fonte de identidade. `public.profiles` guarda somente metadados do usuário interno. Todas as tabelas do backoffice usam RLS e só permitem acesso a perfis internos ativos. O MVP não oferece cadastro público.

## DEC-009 — Arquivos

Contratos e comprovantes ficam em buckets privados separados, com limite de 10 MB e tipos PDF, JPG, JPEG e PNG. O banco guarda a chave do objeto, não URL pública permanente.

## DEC-010 — Datas e dinheiro

Datas operacionais são interpretadas em `America/Sao_Paulo`. Competências, vencimentos e datas comerciais usam `date`; instantes de auditoria usam `timestamptz`. Valores usam `numeric(12,2)` e devem ser não negativos.

## DEC-011 — Fonte do schema

As migrations versionadas em `supabase/migrations/` são a fonte de verdade. Mudanças feitas com MCP também devem existir como migration no repositório. Produção não recebe DDL não revisado.

## DEC-012 — Namespace administrativo

Todo o sistema interno pertence ao namespace `/admin`. `/admin/login` é a única tela pública do backoffice. `/admin` redireciona para `/admin/login` quando não existe sessão válida e para `/admin/dashboard` quando existe um perfil interno ativo. As demais áreas usam `/admin/dashboard`, `/admin/alunos`, `/admin/agenda`, `/admin/turmas`, `/admin/financeiro` e `/admin/planner`. Rotas internas antigas sem o prefixo não recebem aliases.

## DEC-013 — Referência visual aprovada

O Mockup 1 aprovado em 10/09/2026 é a referência de composição do backoffice: sidebar azul-marinho, canvas claro, cabeçalho compacto, indicadores em faixa, cards operacionais e tabelas densas. O mockup orienta apresentação; este PRD e as decisões vinculantes prevalecem para rótulos, dados e regras de negócio. Os tokens e componentes ativos do design system prevalecem sobre cores aproximadas da imagem.

## Questões deliberadamente adiadas

- provedor concreto e template homologado do WhatsApp;
- política de retry após falha de envio;
- versionamento completo do Planner;
- pagamentos parciais e gateways;
- RBAC além do perfil administrativo.
