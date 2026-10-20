# PRD - Sistema Interno English For All

**Versão:** 1.1  
**Status:** MVP aprovado para implementação  
**Produto:** Sistema Interno English For All  
**Tipo:** Backoffice administrativo  
**Usuária principal do MVP:** Emily Rodrigues Ferreira  
**Idioma da interface:** Português (Brasil)

**Documentos vinculantes:** este PRD deve ser lido junto de `DECISIONS.md`. A versão 1.1 incorpora as decisões de faturamento, cancelamento, responsáveis, autenticação, agenda, pagamentos, auditoria e integração WhatsApp fechadas no Sprint 0.

---

# 1. Introdução

Este projeto visa criar o sistema administrativo interno da English For All, direcionado inicialmente exclusivamente para Emily, responsável pela administração e operação da escola.

Atualmente, grande parte da operação da English For All é controlada através de planilhas independentes para agenda, financeiro, alunos e acompanhamento pedagógico.

O sistema deverá substituir progressivamente essas planilhas por uma aplicação centralizada, rápida, simples e confiável.

O sistema NÃO é uma plataforma de ensino e NÃO é um portal do aluno.

Alunos não terão autenticação e não acessarão nenhuma área da aplicação no MVP.

O sistema funcionará como o backoffice operacional da English For All.

## 1.1 Objetivo do MVP

O objetivo do MVP é permitir que Emily controle em um único sistema:

1. alunos;
2. contratos;
3. turmas;
4. agenda semanal;
5. financeiro;
6. pagamentos e inadimplência;
7. comprovantes;
8. histórico pedagógico dos alunos;
9. importação dos dados existentes nas planilhas;
10. indicadores básicos da operação.

O produto deve reduzir trabalho manual e não simplesmente reproduzir as planilhas em formato web.

## 1.2 Princípio central de produto

> O sistema deve exigir menos trabalho operacional da Emily do que as planilhas que ele substitui.

Sempre que uma informação puder ser derivada de dados já existentes no sistema, ela não deverá precisar ser cadastrada novamente.

Exemplo:

Contrato:

- valor mensal: R$ 424,00;
- vencimento: dia 10;
- início: 01/09/2026;
- término: 31/08/2027.

A partir dessas informações, o sistema deverá conseguir determinar:

- valor esperado mensal;
- próximo vencimento;
- mensalidades futuras;
- mensalidades vencidas;
- receita prevista;
- receita recebida;
- inadimplência.

Emily não deverá cadastrar essas informações novamente no módulo financeiro.

## 1.3 Escalabilidade futura

No MVP haverá apenas uma administradora.

Entretanto, a arquitetura não deverá assumir tecnicamente que sempre existirá apenas uma pessoa utilizando o sistema.

No futuro poderão existir:

- professores;
- funcionários administrativos;
- gestores;
- outros perfis internos.

RBAC, permissões específicas e múltiplos perfis NÃO fazem parte deste MVP.

---

# 2. Declaração do Problema

A English For All controla atualmente informações essenciais da escola através de planilhas independentes.

Isso cria problemas como:

- informações espalhadas;
- necessidade de atualização manual;
- dificuldade de acompanhar inadimplência;
- dificuldade de consultar rapidamente horários disponíveis;
- dificuldade de visualizar contratos;
- dificuldade de relacionar aluno, contrato, financeiro e agenda;
- histórico pedagógico pouco estruturado;
- baixa capacidade de gerar indicadores;
- crescimento do trabalho administrativo conforme aumenta o número de alunos;
- risco de inconsistência entre planilhas.

Este MVP resolve o problema através de um sistema administrativo centralizado no qual os diferentes módulos compartilham a mesma base de dados.

---

# 3. Visão Geral da Solução

O produto funcionará como um backoffice administrativo da English For All.

A aplicação deverá possuir navegação principal contendo:

1. Dashboard
2. Alunos
3. Agenda
4. Turmas
5. Financeiro
6. Planner

Contratos estarão relacionados principalmente à ficha do aluno e não precisam obrigatoriamente existir como item independente da navegação principal.

Importações CSV deverão existir dentro dos respectivos módulos.

## 3.1 Relação conceitual entre os módulos

A estrutura principal deverá seguir aproximadamente:

Aluno
→ possui contratos

Aluno
→ possui registros financeiros

Aluno
→ possui registros pedagógicos

Aluno
→ pode participar de uma turma

Aluno ou Turma
→ pode ocupar um horário da agenda

Contrato
→ determina valor mensal e vigência

Contrato
→ gera obrigações financeiras

Pagamento
→ quita uma obrigação financeira

Registro de aula
→ alimenta histórico pedagógico

## 3.2 Fonte de verdade

Cada informação deverá possuir uma fonte de verdade definida.

Exemplos:

**Valor da mensalidade**
Fonte: contrato vigente.

**Dia de vencimento**
Fonte: contrato vigente.

**Status financeiro do mês**
Fonte: cobrança/mensalidade correspondente.

**Participação em turma**
Fonte: associação histórica aluno-turma.

**Horário semanal**
Fonte: agenda/disponibilidade configurada.

**Histórico pedagógico**
Fonte: registros de aula.

O sistema não deverá duplicar desnecessariamente informações entre módulos.

---

# 4. Perfis e Autenticação

## US1

Como administradora, quero acessar o sistema através de autenticação segura para que somente pessoas autorizadas possam visualizar os dados internos da escola.

## CA1 - Login

O sistema deverá possuir tela de login contendo:

- Email
- Senha
- Botão "Entrar"

## CA2 - Usuária inicial

No MVP haverá apenas uma usuária administrativa:

Emily.

## CA3 - Sessão

Após autenticação bem-sucedida, redirecionar para:

`/admin/dashboard`

Usuário não autenticado tentando acessar rota interna deverá ser redirecionado para:

`/admin/login`

## CA4 - Segurança

Senha nunca deverá ser armazenada em texto puro.

## CA5 - Futuro

A estrutura de autenticação deverá permitir múltiplos usuários futuramente sem necessidade de reconstrução das principais entidades do sistema.

---

# 5. Dashboard

## US2

Como administradora, quero visualizar rapidamente os principais indicadores da escola para entender a situação operacional sem precisar consultar vários módulos.

## 5.1 Indicadores

O Dashboard deverá apresentar, quando houver dados disponíveis:

### DB1 - Alunos ativos

Quantidade total de alunos com status ativo.

### DB2 - Inadimplentes

Quantidade de alunos que possuem pelo menos uma cobrança inadimplente.

### DB3 - Receita prevista do mês

Somatório das cobranças válidas previstas para o mês selecionado.

### DB4 - Receita recebida

Somatório das cobranças pagas no mês.

### DB5 - Valores em atraso

Somatório das cobranças inadimplentes.

## 5.2 Agenda do dia

Mostrar:

- horário;
- aluno ou turma;
- modalidade;
- situação do horário.

Ordenação cronológica.

## 5.3 Próximos vencimentos

Exibir lista resumida contendo:

- aluno;
- valor;
- vencimento;
- status.

## 5.4 Contratos próximos do encerramento

Mostrar contratos cuja data final esteja próxima.

Sugestão inicial de janela:

30 dias.

Essa janela deverá ser tratada como configuração de aplicação, evitando regra espalhada pelo código.

## 5.5 Ações rápidas

Disponibilizar atalhos para operações frequentes:

- Novo aluno
- Ver agenda
- Registrar pagamento
- Registrar aula

## 5.6 Estados vazios

Caso não existam dados, não mostrar gráficos ou cards quebrados.

Exemplo:

"Nenhuma aula agendada para hoje."

---

# 6. Módulo de Alunos

## US3

Como administradora, quero cadastrar e consultar alunos para centralizar todas as informações relevantes sobre cada estudante.

## 6.1 Lista de alunos

Rota:

`/admin/alunos`

A listagem deverá permitir:

- busca por nome;
- busca por email;
- busca por telefone;
- filtro por status;
- filtro por turma;
- ordenação;
- acesso à ficha individual.

## 6.2 Status do aluno

Valores iniciais:

- ativo
- inativo
- cancelado

Alunos nunca deverão ser fisicamente removidos do banco através das operações normais da interface.

## 6.3 Cadastro

Botão:

`Novo aluno`

Abrir modal, drawer ou página dedicada.

Campos:

- nome completo: obrigatório;
- data de nascimento: opcional;
- email: opcional;
- WhatsApp: obrigatório;
- observações administrativas: opcional;
- status: obrigatório, padrão `ativo`.

## 6.4 Responsável

Para crianças e adolescentes, permitir cadastrar:

- nome do responsável;
- WhatsApp do responsável;
- email do responsável.

O responsável deverá ser modelado separadamente dos dados do aluno para permitir evolução futura.

## 6.5 Contato financeiro

O sistema deverá identificar explicitamente quem recebe comunicações financeiras.

Opções iniciais:

- próprio aluno;
- responsável.

Para menores, o responsável deverá ser a opção padrão.

## 6.6 Ficha do aluno

Rota sugerida:

`/admin/alunos/:id`

A ficha deverá funcionar como visão 360° do aluno.

Deverá apresentar:

### Dados gerais

- nome;
- contato;
- responsável;
- status;
- data de cadastro.

### Contrato atual

- modalidade;
- frequência;
- valor;
- início;
- término;
- vencimento;
- documento.

### Turma

- turma atual;
- histórico de turmas.

### Financeiro

- próximas cobranças;
- cobranças pagas;
- cobranças inadimplentes;
- comprovantes.

### Planner

- registros pedagógicos em ordem cronológica.

## 6.7 Abas sugeridas

A ficha poderá utilizar:

- Visão geral
- Contratos
- Financeiro
- Planner
- Turmas

A implementação visual poderá adaptar essa estrutura desde que mantenha fácil acesso às informações.

---

# 7. Contratos

## US4

Como administradora, quero cadastrar contratos individuais dos alunos para que o sistema saiba automaticamente valores, vigência e obrigações financeiras.

## 7.1 Decisão de produto

NÃO haverá módulo independente de catálogo de pacotes no MVP.

O contrato será a entidade responsável por representar comercialmente o acordo atual do aluno.

Isso permite contratos personalizados sem obrigar Emily a manter um catálogo rígido de planos.

## 7.2 Contrato individual

Todo contrato pertence a exatamente um aluno.

Um aluno poderá possuir vários contratos ao longo de sua jornada.

Somente o contrato aplicável ao período deverá ser considerado vigente.

Contratos anteriores deverão permanecer disponíveis no histórico.

## 7.3 Campos

### CT1 - Identificação

- id;
- aluno;
- modalidade;
- frequência semanal;
- duração/tipo;
- data inicial;
- data final;
- valor mensal;
- dia de vencimento;
- status;
- arquivo do contrato;
- observações.

## 7.4 Modalidade

Valores iniciais:

- individual;
- duo;
- turma.

A modelagem não deverá impedir novas modalidades futuramente.

## 7.5 Frequência semanal

Representar numericamente.

Exemplos:

- 1 aula/semana
- 2 aulas/semana
- 3 aulas/semana
- 4 aulas/semana

## 7.6 Tipo/duração

Exemplos atuais da escola:

- mensal;
- semestral;
- anual;
- personalizado.

A duração não deverá determinar automaticamente o preço.

## 7.7 Valores

O valor deverá pertencer ao contrato específico.

Exemplo:

Mesmo que o preço comercial padrão seja R$ 279,00, Emily poderá possuir um aluno com condição de R$ 260,00.

O financeiro deverá utilizar R$ 260,00 para esse aluno.

## 7.8 Vigência

Contratos com prazo determinado deverão possuir:

- data inicial;
- data final.

Contratos mensais sem fidelidade poderão possuir:

- data inicial;
- data final nula.

## 7.9 Upload

Formatos permitidos inicialmente:

- PDF;
- JPG;
- JPEG;
- PNG.

Tamanho máximo recomendado:

10 MB.

## 7.10 Fonte de verdade

O arquivo do contrato NÃO será fonte de verdade para os cálculos.

Os campos estruturados cadastrados no sistema serão a fonte de verdade.

## 7.11 Renovação

Ao renovar:

1. preservar contrato anterior;
2. encerrar contrato anterior quando aplicável;
3. criar novo contrato;
4. novas cobranças deverão seguir o novo contrato.

Nunca sobrescrever o histórico comercial do aluno.

---

# 8. Agenda

## US5

Como administradora, quero configurar os horários em que trabalho e visualizar quais estão vagos ou ocupados para consultar rapidamente minha disponibilidade.

## 8.1 Conceito

A agenda não deverá começar com horários arbitrários definidos pelo sistema.

Emily define sua própria grade semanal.

Ela deverá poder determinar:

- quais dias trabalha;
- quais horários existem;
- duração de cada horário.

## 8.2 Disponibilidade semanal

Rota:

`/admin/agenda`

Deverá existir ação:

`Configurar horários`

## 8.3 Criação de horário

Campos:

- dia da semana;
- horário inicial;
- horário final.

Exemplo:

Segunda-feira

09:00 até 10:00

Segunda-feira

11:30 até 12:15

Segunda-feira

21:00 até 22:00

Não assumir duração fixa de uma hora.

## 8.4 Recorrência

Os horários configurados representam disponibilidade semanal recorrente.

Não será necessário Emily recriar a agenda toda semana.

## 8.5 Exclusão

Emily poderá remover um horário da disponibilidade.

A remoção não deverá apagar registros históricos relacionados a aulas já realizadas.

## 8.6 Ocupação

Um horário poderá estar:

- vago;
- ocupado por aluno;
- ocupado por turma.

## 8.7 Regra de exclusividade

Um intervalo não poderá possuir simultaneamente:

- dois alunos;
- duas turmas;
- aluno e turma.

## 8.8 Sobreposição

O sistema deverá impedir sobreposição de horários.

Exemplo:

Horário existente:

10:00 - 11:00

Não permitir:

10:30 - 11:30

no mesmo dia.

## 8.9 Filtros

Disponibilizar:

- dia da semana;
- aluno;
- turma;
- status Vago/Ocupado.

## 8.10 Visualização

A interface deverá permitir identificar rapidamente horários vagos.

Não depender exclusivamente de cor.

Usar também texto ou indicador visual.

Exemplos:

`VAGO`

`OCUPADO`

## 8.11 Fora do MVP

Não implementar:

- reposição;
- falta;
- remarcação;
- férias;
- calendário de feriados;
- bloqueios excepcionais;
- presença.

---

# 9. Turmas

## US6

Como administradora, quero organizar alunos em turmas para gerenciar aulas com múltiplos participantes.

## 9.1 Cadastro

Campos:

- nome da turma;
- status;
- observações opcionais.

O dia e o horário da turma não são armazenados nesta entidade. Sua fonte de verdade é a associação histórica entre `weekly_slots` e `schedule_assignments`.

## 9.2 Participantes

Permitir adicionar múltiplos alunos.

## 9.3 Histórico

A associação entre aluno e turma deverá possuir:

- data de entrada;
- data de saída;
- status da participação.

Não simplesmente armazenar um array atual de alunos.

## 9.4 Saída

Ao remover aluno da turma:

- encerrar participação ativa;
- registrar data de saída;
- preservar histórico.

## 9.5 Cancelamento de aluno

Ao cancelar um aluno:

- encerrar participações ativas em turmas;
- não apagar histórico.

## 9.6 Mudança de turma

Quando aluno mudar de turma:

1. encerrar associação anterior;
2. criar nova associação;
3. preservar ambas no histórico.

---

# 10. Financeiro

## US7

Como administradora, quero acompanhar mensalidades e pagamentos para saber rapidamente quem pagou, quem ainda precisa pagar e quanto a escola recebeu.

## 10.1 Princípio

O financeiro deverá ser alimentado principalmente pelos contratos.

Emily NÃO deverá cadastrar manualmente todos os meses a mesma mensalidade.

## 10.2 Cobrança mensal

Cada competência deverá possuir uma cobrança independente.

Exemplo:

Aluno: João

Valor: R$ 424,00

Janeiro → R$ 424,00

Fevereiro → R$ 424,00

Março → R$ 424,00

Cada cobrança possui seu próprio status.

## 10.3 Estados

Utilizar enum interno equivalente a:

- pending
- overdue
- paid
- cancelled

Na interface:

- Pendente
- Inadimplente
- Pago
- Cancelado

Quando útil visualmente, cobranças futuras poderão aparecer como:

`A vencer`

sem necessariamente exigir um estado persistido separado caso isso possa ser derivado pela data.

## 10.4 Regra de inadimplência

Exemplo:

Vencimento:

05/09/2026

Durante o dia 05:

Status = Pendente

A partir de 06/09/2026, caso não exista pagamento:

Status = Inadimplente

Não aplicar regra especial para:

- sábado;
- domingo;
- feriado.

A regra é puramente baseada em data.

## 10.5 Pagamento parcial

NÃO haverá pagamento parcial.

Uma cobrança estará:

- paga integralmente;
  ou
- não paga.

## 10.6 Confirmação

Pagamento será confirmado manualmente por Emily.

Ação:

`Registrar pagamento`

Campos:

- data do pagamento;
- comprovante;
- observação opcional.

Valor deverá vir da cobrança.

## 10.7 Comprovante

Permitir:

- PDF;
- JPG;
- JPEG;
- PNG.

Após registrar:

`status = Pago`

## 10.8 Histórico

Nunca substituir pagamento anterior.

Cada competência deve permanecer registrada.

## 10.9 Tela financeira

Rota:

`/admin/financeiro`

Mostrar tabela contendo:

- aluno;
- competência;
- vencimento;
- valor;
- status;
- data de pagamento;
- ação.

## 10.10 Filtros

- competência/mês;
- ano;
- status;
- aluno;
- intervalo de vencimento.

## 10.11 Indicadores

Mostrar no topo:

- Receita prevista
- Receita recebida
- Em aberto
- Inadimplente

## 10.12 Cancelamento de aluno/contrato

Quando aluno cancelar:

Cobranças anteriores pagas:

permanecem.

Cobranças anteriores inadimplentes:

permanecem no histórico.

Cobranças futuras ainda não vencidas:

devem ser canceladas.

Cobranças futuras canceladas:

- não compõem receita prevista;
- não geram inadimplência;
- não geram cobrança WhatsApp.

Não apagar registros.

---

# 11. Cobrança Automática por WhatsApp

## US8

Como administradora, quero que alunos inadimplentes recebam automaticamente uma mensagem para não precisar fazer cobranças manualmente.

## 11.1 Gatilho

Quando uma cobrança mudar para:

`Inadimplente`

o sistema deverá criar uma solicitação de envio de cobrança.

## 11.2 Destinatário

Utilizar o contato financeiro configurado no aluno.

Se:

`contato_financeiro = aluno`

usar WhatsApp do aluno.

Se:

`contato_financeiro = responsável`

usar WhatsApp do responsável.

## 11.3 Frequência

Enviar apenas uma mensagem automática por ocorrência de inadimplência no MVP.

NÃO enviar cobrança automática diariamente.

## 11.4 Idempotência

A automação deverá possuir proteção contra envio duplicado.

O sistema deverá registrar que a cobrança automática daquela mensalidade já foi processada.

Atualizações, refresh da página ou reexecução de job não podem gerar mensagens duplicadas.

## 11.5 Registro

Registrar:

- cobrança;
- destinatário;
- data/hora;
- status;
- identificador externo, quando existir;
- erro, quando houver.

## 11.6 Falha

Caso o provedor de WhatsApp falhe:

- NÃO alterar dados financeiros;
- registrar falha;
- permitir nova tentativa;
- mostrar situação para Emily.

## 11.7 Template

A mensagem deverá ser configurável no código/configuração da aplicação.

Não espalhar texto fixo em múltiplos componentes.

## 11.8 Integração

A implementação dependerá do provedor/API de WhatsApp escolhido para o projeto.

Credenciais nunca poderão estar expostas no frontend.

---

# 12. Planner e Histórico Pedagógico

## US9

Como administradora e professora, quero registrar o desenvolvimento pedagógico dos alunos a cada aula para construir um histórico de evolução.

## 12.1 Importância

O Planner é uma entidade central do sistema.

Não deverá ser implementado como um único campo genérico de texto.

Os dados precisam ser suficientemente estruturados para permitir análise futura.

## 12.2 Registro de aula

Cada registro deverá possuir:

- data;
- sessão relacionada, quando existir;
- aluno ou turma;
- tipo/nome da aula;
- conteúdo trabalhado;
- observações;
- relatório da aula;
- homework;
- criado_em;
- atualizado_em.

## 12.3 Exemplos de tipo/nome

Permitir texto flexível para valores como:

- Introductive Class
- Practice Class
- Planner Class
- Lesson 1
- Lesson 2
- Self Introduction
- Review
- Vacation

Não transformar esses exemplos em enum rígido.

## 12.4 Registro individual

Para aulas em turma, permitir:

Registro geral da aula

-

Registro individual de cada aluno.

Exemplo:

Turma A

Conteúdo:
Simple Past

Relatório geral:
Turma apresentou boa compreensão.

Aluno João:
Dificuldade em perguntas.

Aluna Maria:
Excelente desenvolvimento oral.

## 12.5 Histórico do aluno

Na ficha do aluno, mostrar timeline cronológica.

Cada item deverá apresentar pelo menos:

- data;
- aula;
- conteúdo;
- relatório;
- homework.

## 12.6 Edição

Emily poderá editar registros.

Atualização não deverá alterar silenciosamente a data original de criação.

## 12.7 Preparação para IA

Não implementar IA no MVP.

Entretanto, a estrutura deverá permitir futuramente:

- resumo de evolução;
- análise de dificuldades;
- análise de frequência de temas;
- gráficos;
- relatórios;
- geração de feedback;
- comparação temporal;
- relatórios para alunos.

## 12.8 Não escopo

Não implementar:

- score automático;
- avaliação automática;
- IA;
- geração automática de relatório;
- portal para aluno visualizar Planner.

---

# 13. Importação CSV

## US10

Como administradora, quero importar minhas planilhas atuais para começar a utilizar o sistema sem cadastrar centenas de registros manualmente.

## 13.1 Estratégia

Cada módulo possuirá seu próprio importador.

Não haverá importador universal.

Importadores previstos:

- alunos;
- agenda;
- financeiro;
- planner;
- turmas, quando necessário.

## 13.2 Fluxo obrigatório

CSV
→ Upload
→ Leitura
→ Mapeamento
→ Validação
→ Preview
→ Confirmação
→ Importação

## 13.3 Preview

Antes de persistir:

mostrar:

- quantidade total;
- registros válidos;
- registros com erro;
- campos identificados.

## 13.4 Erros

Um CSV inválido não deverá causar importação silenciosamente incorreta.

Exemplos:

- data inválida;
- aluno inexistente;
- telefone inválido;
- valor inválido;
- coluna obrigatória ausente.

## 13.5 Resultado

Após importação:

mostrar:

- registros importados;
- registros ignorados;
- registros com erro.

## 13.6 Duplicidade

Cada importador deverá possuir estratégia explícita de identificação de duplicidades.

Nunca criar duplicações silenciosas.

## 13.7 Financeiro histórico

Importações financeiras poderão representar histórico anterior ao uso da plataforma.

Esses registros deverão permanecer identificáveis como dados importados.

## 13.8 Planner histórico

Permitir importar registros pedagógicos anteriores.

Quando possível, relacionar pelo aluno.

---

# 14. Esquema do Banco de Dados

A nomenclatura física poderá ser adaptada à stack escolhida, mas as entidades e relações de domínio deverão ser preservadas.

## Tabela: profiles

- id: UUID, obrigatório, PK e FK → auth.users.id
- name: string(120), obrigatório
- role: enum(admin), obrigatório no MVP
- active: boolean, obrigatório, default true
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório

Autenticação e credenciais pertencem exclusivamente ao Supabase Auth. A tabela pública não armazena senha.

---

## Tabela: students

- id: UUID, obrigatório, PK
- full_name: string(150), obrigatório
- birth_date: date, opcional
- email: string(255), opcional
- whatsapp: string(30), obrigatório
- status: enum(active, inactive, cancelled), obrigatório
- financial_contact_type: enum(student, guardian), obrigatório
- financial_guardian_id: UUID, opcional, FK → guardians.id
- administrative_notes: text, opcional
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório
- archived_at: timestamp, opcional

---

## Tabela: guardians

- id: UUID, obrigatório, PK
- student_id: UUID, obrigatório, FK → students.id
- full_name: string(150), obrigatório
- email: string(255), opcional
- whatsapp: string(30), obrigatório
- relationship: string(50), opcional
- active: boolean, obrigatório, default true
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório
- archived_at: timestamp, opcional

Relacionamento inicial:

students → guardians (1:N)

Mesmo que o MVP normalmente utilize um responsável principal, não limitar estruturalmente a exatamente um responsável.

---

## Tabela: contracts

- id: UUID, obrigatório, PK
- student_id: UUID, obrigatório, FK → students.id
- modality: string(50), obrigatório
- weekly_frequency: integer, obrigatório
- contract_type: string(50), obrigatório
- start_date: date, obrigatório
- billing_start_date: date, obrigatório
- end_date: date, opcional
- monthly_amount: decimal(10,2), obrigatório
- first_invoice_amount: decimal(10,2), opcional
- due_day: integer, obrigatório
- status: enum(active, completed, cancelled), obrigatório
- cancelled_at: timestamp, opcional
- cancellation_effective_date: date, opcional
- document_url/storage_key: string, opcional
- notes: text, opcional
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório
- archived_at: timestamp, opcional

Validação:

due_day >= 1

due_day <= 31

Para meses sem o dia configurado, usar o último dia válido do mês.

Exemplo:

vencimento dia 31

fevereiro de 2027

→ vencimento em 28/02/2027.

---

## Tabela: weekly_slots

- id: UUID, obrigatório, PK
- weekday: integer, obrigatório
- start_time: time, obrigatório
- end_time: time, obrigatório
- active: boolean, obrigatório
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório
- archived_at: timestamp, opcional

Validação:

end_time > start_time

Não permitir sobreposição no mesmo dia entre slots ativos.

---

## Tabela: schedule_assignments

- id: UUID, obrigatório, PK
- weekly_slot_id: UUID, obrigatório, FK → weekly_slots.id
- assignment_type: enum(student, class), obrigatório
- student_id: UUID, opcional, FK → students.id
- class_id: UUID, opcional, FK → classes.id
- start_date: date, opcional
- end_date: date, opcional
- active: boolean, obrigatório
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório

Regra:

Se assignment_type = student:
student_id obrigatório
class_id nulo

Se assignment_type = class:
class_id obrigatório
student_id nulo

---

## Tabela: classes

- id: UUID, obrigatório, PK
- name: string(120), obrigatório
- status: enum(active, inactive), obrigatório
- notes: text, opcional
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório
- archived_at: timestamp, opcional

---

## Tabela: class_memberships

- id: UUID, obrigatório, PK
- class_id: UUID, obrigatório, FK → classes.id
- student_id: UUID, obrigatório, FK → students.id
- joined_at: date, obrigatório
- left_at: date, opcional
- status: enum(active, ended), obrigatório
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório

Não apagar associação ao remover aluno da turma.

---

## Tabela: invoices

Representa uma cobrança mensal.

- id: UUID, obrigatório, PK
- student_id: UUID, obrigatório, FK → students.id
- contract_id: UUID, obrigatório, FK → contracts.id
- reference_month: date, obrigatório
- due_date: date, obrigatório
- amount: decimal(10,2), obrigatório
- status: enum(pending, overdue, paid, cancelled), obrigatório
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório
- archived_at: timestamp, opcional

Constraint recomendada:

UNIQUE(contract_id, reference_month)

Isso impede cobrança duplicada da mesma competência para o mesmo contrato.

---

## Tabela: payments

- id: UUID, obrigatório, PK
- invoice_id: UUID, obrigatório, FK → invoices.id
- amount: decimal(10,2), obrigatório
- payment_date: date, obrigatório
- receipt_url/storage_key: string, opcional
- notes: text, opcional
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório

Regra do MVP:

amount deve ser igual ao valor integral da cobrança.

Constraint obrigatória no MVP:

UNIQUE(invoice_id)

`payments.payment_date` é a fonte de verdade da data do pagamento.

---

## Tabela: whatsapp_collection_messages

- id: UUID, obrigatório, PK
- invoice_id: UUID, obrigatório, FK → invoices.id
- recipient_type: enum(student, guardian), obrigatório
- recipient_phone: string(30), obrigatório
- message_snapshot: text, obrigatório
- status: enum(pending, sent, failed), obrigatório
- provider_message_id: string, opcional
- sent_at: timestamp, opcional
- error_message: text, opcional
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório

Constraint recomendada para o MVP:

UNIQUE(invoice_id)

Evitar cobrança automática duplicada.

---

## Tabela: lesson_records

- id: UUID, obrigatório, PK
- lesson_date: date, obrigatório
- class_id: UUID, opcional, FK → classes.id
- student_id: UUID, opcional, FK → students.id
- lesson_name: string(150), opcional
- content: text, opcional
- observations: text, opcional
- lesson_report: text, opcional
- homework: text, opcional
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório
- archived_at: timestamp, opcional

---

## Tabela: lesson_student_notes

Utilizada principalmente para registros individuais dentro de aulas de turma.

- id: UUID, obrigatório, PK
- lesson_record_id: UUID, obrigatório, FK → lesson_records.id
- student_id: UUID, obrigatório, FK → students.id
- individual_report: text, opcional
- observations: text, opcional
- homework: text, opcional
- created_at: timestamp, obrigatório
- updated_at: timestamp, obrigatório
- archived_at: timestamp, opcional

---

## Tabela: import_jobs

- id: UUID, obrigatório, PK
- module: enum(students, schedule, finance, planner, classes), obrigatório
- file_name: string(255), obrigatório
- status: enum(processing, awaiting_confirmation, completed, failed), obrigatório
- total_rows: integer, obrigatório
- valid_rows: integer, obrigatório
- invalid_rows: integer, obrigatório
- imported_rows: integer, obrigatório
- created_at: timestamp, obrigatório
- completed_at: timestamp, opcional

---

# 15. Relacionamentos

- profiles: representam usuários internos autenticados por Supabase Auth.
- students → guardians: 1:N.
- students → contracts: 1:N.
- students → invoices: 1:N.
- contracts → invoices: 1:N.
- invoices → payments: 1:0..1 no MVP, com quitação exclusivamente integral.
- invoices → whatsapp_collection_messages: 1:0..1 no MVP.
- classes → class_memberships: 1:N.
- students → class_memberships: 1:N.
- weekly_slots → schedule_assignments: 1:N histórico.
- classes → lesson_records: 1:N.
- students → lesson_records: 1:N quando aula individual.
- lesson_records → lesson_student_notes: 1:N.

---

# 16. Regras de Integridade

## RI1

Não permitir dois contratos ativos conflitantes para o mesmo aluno no mesmo período sem confirmação explícita ou tratamento de negócio.

No MVP, preferir bloquear e solicitar encerramento do contrato anterior.

## RI2

Não permitir cobrança duplicada para:

contract_id + reference_month.

## RI3

Não permitir dois assignments ativos conflitantes no mesmo horário.

## RI4

Não permitir aluno cancelado ser adicionado como participante ativo de turma.

## RI5

Não permitir aluno cancelado receber novas cobranças futuras.

## RI6

Não permitir pagamento em cobrança cancelada.

## RI7

Não permitir pagamento duplicado da mesma cobrança no fluxo normal do MVP.

## RI8

Dados históricos não devem ser fisicamente apagados pelas operações normais da aplicação.

## RI9

Arquivos privados não deverão possuir URL pública permanente sem controle de acesso.

## RI10

Valores monetários devem utilizar decimal no banco.

Nunca utilizar float para valores financeiros.

---

# 17. Cancelamento de Aluno

## US11

Como administradora, quero cancelar um aluno preservando seu histórico para que os dados financeiros e pedagógicos anteriores continuem disponíveis.

## 17.1 Fluxo

Ação:

`Cancelar aluno`

Exibir confirmação.

## 17.2 Consequências

Ao confirmar:

1. student.status = cancelled;
2. encerrar contrato vigente;
3. encerrar participação ativa em turmas;
4. encerrar assignment individual ativo quando aplicável;
5. cancelar cobranças futuras;
6. preservar cobranças anteriores;
7. preservar pagamentos;
8. preservar Planner;
9. preservar contratos;
10. preservar comprovantes.

## 17.3 Financeiro

Receita prevista futura deverá ser recalculada sem cobranças canceladas.

---

# 18. Estados Vazios, Loading e Erros

Todas as telas deverão possuir tratamento explícito.

## UX1 - Loading

Não mostrar tela vazia durante carregamento.

Utilizar skeleton ou indicador apropriado.

## UX2 - Empty state

Exemplo em alunos:

"Nenhum aluno cadastrado."

Ações:

`Cadastrar aluno`

`Importar CSV`

## UX3 - Erro

Mostrar mensagem compreensível.

Evitar mostrar stack trace, código SQL ou erro técnico bruto.

## UX4 - Operações críticas

Utilizar confirmação para:

- cancelar aluno;
- cancelar contrato;
- remover horário;
- encerrar turma;
- remover aluno de turma.

---

# 19. Estética e Identidade Visual

## Estética Geral

O sistema interno deverá transmitir organização, clareza, confiança e produtividade.

Não deve parecer uma planilha web.

Também não deve parecer um ERP corporativo excessivamente complexo.

A interface deverá ser moderna, limpa e profissional, mantendo conexão visual com a identidade da English For All.

Utilizar:

- hierarquia visual clara;
- espaços bem distribuídos;
- cards quando agregarem informação;
- tabelas modernas;
- filtros facilmente acessíveis;
- indicadores visuais de status;
- tipografia legível;
- navegação rápida;
- responsividade.

Cores de status não deverão ser o único meio de comunicar significado.

Exemplo:

Vermelho + texto `Inadimplente`.

Não apenas vermelho.

---

# 20. Esquema de Telas e Ações

## Tela: Login

Rota:

`/admin/login`

Elementos:

- Logo
- Email
- Senha
- Entrar

Ações:

Entrar
→ validar
→ autenticar
→ `/dashboard`

---

## Tela: Dashboard

Rota:

`/admin/dashboard`

Elementos:

- Receita prevista
- Receita recebida
- Inadimplência
- Alunos ativos
- Agenda do dia
- Próximos vencimentos
- Contratos próximos do fim
- Ações rápidas

---

## Tela: Alunos

Rota:

`/admin/alunos`

Elementos:

- busca;
- filtros;
- tabela/lista;
- Novo aluno;
- Importar CSV.

Ações:

- cadastrar;
- editar;
- abrir ficha;
- filtrar;
- importar.

---

## Tela: Ficha do Aluno

Rota:

`/admin/alunos/:id`

Elementos:

- dados;
- status;
- responsável;
- contato financeiro;
- contrato;
- financeiro;
- Planner;
- turma;
- documentos.

Ações:

- editar aluno;
- criar contrato;
- anexar contrato;
- registrar pagamento;
- anexar comprovante;
- registrar aula;
- alterar turma;
- cancelar aluno.

---

## Tela: Agenda

Rota:

`/admin/agenda`

Elementos:

- grade semanal;
- filtros;
- horários vagos;
- horários ocupados;
- Configurar horários.

Ações:

- criar horário;
- remover horário;
- atribuir aluno;
- atribuir turma;
- liberar horário;
- filtrar.

---

## Tela: Turmas

Rota:

`/admin/turmas`

Elementos:

- lista;
- busca;
- status;
- horário;
- quantidade de alunos.

Ações:

- criar turma;
- editar;
- abrir;
- inativar.

---

## Tela: Detalhe da Turma

Rota:

`/admin/turmas/:id`

Elementos:

- nome;
- horário;
- participantes ativos;
- histórico de participantes;
- Planner relacionado.

Ações:

- adicionar aluno;
- remover aluno;
- editar turma;
- registrar aula.

---

## Tela: Financeiro

Rota:

`/admin/financeiro`

Elementos:

- cards de indicadores;
- filtros;
- tabela;
- status;
- ações.

Ações:

- registrar pagamento;
- abrir aluno;
- visualizar comprovante;
- filtrar;
- importar CSV.

---

## Tela: Planner

Rota:

`/admin/planner`

Elementos:

- registros;
- filtros por aluno;
- filtros por turma;
- filtro por data;
- busca;
- Novo registro;
- Importar CSV.

Ações:

- registrar aula;
- editar registro;
- abrir aluno;
- consultar histórico.

---

# 21. Responsividade

## Desktop

Será o principal ambiente operacional.

Priorizar produtividade em resoluções desktop.

## Tablet

Sistema deverá permanecer funcional.

## Mobile

Deverá permitir consultas e operações essenciais.

Tabelas poderão utilizar:

- cards;
- scroll horizontal;
- layouts adaptados.

Não reduzir conteúdo até torná-lo ilegível.

---

# 22. Auditoria e Histórico

Como o sistema contém informações financeiras e pedagógicas, registros importantes deverão possuir:

- created_at;
- updated_at.
- created_by;
- updated_by.

Entidades históricas não deverão ser sobrescritas quando isso destruir contexto anterior.

Exemplo:

Ao renovar contrato:

ERRADO:
editar contrato antigo com novo valor.

CORRETO:
encerrar contrato anterior e criar novo.

---

# 23. Automação Financeira

Deverá existir processo de backend responsável por verificar cobranças.

Pseudo-regra:

FOR each invoice WHERE status = pending:

IF current_date > due_date:
status = overdue

IF transitioned_to_overdue:
enqueue_whatsapp_collection(invoice)

O processo deverá ser idempotente.

Executar novamente não poderá gerar cobranças duplicadas.

---

# 24. Geração de Cobranças

Quando contrato entrar em vigor, o sistema deverá criar/controlar as competências financeiras correspondentes.

Para contratos com data final:

gerar cobranças somente dentro da vigência.

Para contratos sem data final:

gerar cobranças progressivamente.

Não é obrigatório materializar anos de cobranças futuras antecipadamente.

Uma estratégia aceitável é manter geração periódica de próximas competências.

## 24.1 Alteração contratual

Não alterar retroativamente cobranças já pagas.

Mudanças de contrato devem preferencialmente ocorrer através de encerramento + novo contrato.

---

# 25. Importação Inicial das Planilhas

A migração deverá ser tratada como parte importante da adoção.

Ordem recomendada:

1. alunos;
2. contratos/dados comerciais;
3. turmas;
4. agenda;
5. financeiro;
6. Planner.

Registros que dependem de aluno devem ser relacionados somente após identificação segura.

Não relacionar dados por similaridade fraca de nome automaticamente sem confirmação.

Exemplo perigoso:

"Maria Silva"

"Maria F. Silva"

Não assumir automaticamente que são a mesma pessoa.

---

# 26. Requisitos Não Funcionais

## RNF1 - Performance

Listagens comuns devem responder rapidamente.

Utilizar paginação quando necessário.

## RNF2 - Segurança

Todas as rotas internas exigem autenticação.

## RNF3 - Arquivos

Contratos e comprovantes devem utilizar storage apropriado.

## RNF4 - Credenciais

Secrets nunca devem estar hardcoded no frontend.

## RNF5 - Banco

Utilizar migrations versionadas.

## RNF6 - Datas

Datas de negócio deverão utilizar timezone consistente com a operação da escola no Brasil.

Regras de vencimento devem ser baseadas em data local da operação, evitando mudança indevida causada por UTC.

## RNF7 - Dinheiro

Persistir dinheiro como decimal.

## RNF8 - Integridade

Operações relacionadas que precisam ocorrer juntas deverão utilizar transações quando necessário.

Exemplo:

registrar pagamento

- marcar invoice como paga.

## RNF9 - Backup

A infraestrutura escolhida deverá permitir backup/restauração do banco e storage.

## RNF10 - Privacidade

O sistema armazenará dados pessoais, financeiros e pedagógicos.

Aplicar princípio de acesso mínimo e evitar exposição pública de arquivos.

---

# 27. Critérios Globais de Aceite

## GA1

Emily consegue cadastrar um aluno manualmente.

## GA2

Emily consegue importar alunos por CSV.

## GA3

Emily consegue anexar responsável ao aluno.

## GA4

Emily consegue cadastrar contrato individual.

## GA5

O contrato determina valor e vencimento financeiro.

## GA6

Emily consegue consultar histórico de contratos.

## GA7

Emily consegue criar sua disponibilidade semanal.

## GA8

Emily consegue identificar rapidamente horários vagos.

## GA9

Emily consegue atribuir aluno a horário.

## GA10

Emily consegue atribuir turma a horário.

## GA11

Sistema impede conflito de agenda.

## GA12

Emily consegue criar turma.

## GA13

Emily consegue adicionar e remover alunos preservando histórico.

## GA14

Sistema consegue identificar cobrança vencida.

## GA15

Cobrança torna-se inadimplente um dia após vencimento quando não paga.

## GA16

Sistema dispara somente uma cobrança automática de WhatsApp por ocorrência.

## GA17

Emily consegue registrar pagamento manual.

## GA18

Emily consegue anexar comprovante.

## GA19

Pagamento altera cobrança para Pago.

## GA20

Dashboard reflete pagamento registrado.

## GA21

Emily consegue registrar histórico pedagógico.

## GA22

Emily consegue visualizar histórico do aluno cronologicamente.

## GA23

Aulas em turma permitem observações individuais.

## GA24

Cancelamento preserva histórico.

## GA25

Cancelamento impede geração de cobranças futuras válidas.

## GA26

Dados não são fisicamente excluídos através das operações normais.

## GA27

Cada importador CSV apresenta preview antes de persistir dados.

## GA28

Erros de CSV são apresentados antes da confirmação.

---

# 28. Fora do Escopo do MVP

NÃO implementar nesta versão:

- Landing Page;
- cadastro público;
- portal do aluno;
- login de aluno;
- login de responsável;
- aplicativo mobile nativo;
- múltiplos funcionários;
- permissões avançadas;
- RBAC completo;
- pagamentos online;
- PIX automático;
- gateway de pagamento;
- conciliação bancária;
- pagamento parcial;
- emissão fiscal;
- controle de faltas;
- controle de presença;
- reposições;
- remarcações;
- férias;
- calendário de feriados;
- LMS;
- videoaulas;
- videoconferência;
- biblioteca de materiais;
- envio de homework para portal do aluno;
- IA pedagógica;
- análise automática de evolução;
- gráficos de evolução por IA;
- relatórios automáticos para alunos;
- OCR/leitura automática dos contratos;
- catálogo complexo de pacotes;
- CRM comercial.

Não criar funcionalidades fora deste escopo sem nova decisão de produto.

---

# 29. Preparação para Evoluções Futuras

Embora não façam parte do MVP, a modelagem deverá evitar bloquear:

### FUT1 - Equipe

Múltiplos usuários internos.

### FUT2 - Professores

Atribuição de professor a turmas e aulas.

### FUT3 - IA pedagógica

Análise dos registros do Planner.

### FUT4 - Evolução do aluno

Gráficos por período.

### FUT5 - Relatório

Gerar relatório visual compartilhável.

### FUT6 - Portal

Aluno consultar informações selecionadas.

### FUT7 - Contratos inteligentes

Extração automática de dados do PDF.

### FUT8 - Financeiro

Integração com meios de pagamento.

### FUT9 - WhatsApp

Outras automações operacionais.

Essas possibilidades NÃO justificam implementar complexidade desnecessária agora.

---

# 30. Diretrizes para Implementação por AI Coding

Esta seção é obrigatória para qualquer agente responsável pela implementação.

## AI1 - Não inventar requisitos

Não criar:

- telas;
- módulos;
- campos;
- automações;
- regras comerciais;

que não estejam neste PRD ou que não sejam estritamente necessárias tecnicamente.

## AI2 - Não transformar o sistema em ERP

O produto precisa ser simples.

Complexidade técnica não deve resultar em complexidade para Emily.

## AI3 - Não duplicar entrada

Antes de criar um campo manual, verificar se o dado já pode ser derivado.

## AI4 - Preservar histórico

Nunca resolver mudanças históricas sobrescrevendo dados antigos quando uma nova entidade/evento representa melhor a realidade.

## AI5 - Não utilizar mock em funcionalidade concluída

Funcionalidades consideradas prontas devem utilizar persistência real.

## AI6 - Estados obrigatórios

Implementar:

- loading;
- empty;
- success;
- error.

## AI7 - Não confiar apenas no frontend

Regras críticas devem existir no backend/banco quando aplicável.

Especialmente:

- conflito de agenda;
- duplicidade financeira;
- autenticação;
- autorização;
- pagamentos;
- integridade relacional.

## AI8 - Código modular

Separar domínio de:

- alunos;
- contratos;
- financeiro;
- agenda;
- turmas;
- Planner;
- integrações.

Evitar componente ou service monolítico.

## AI9 - Integrações externas

WhatsApp deverá possuir camada própria de integração.

Não acoplar lógica financeira diretamente ao SDK do provedor.

Exemplo conceitual:

Financeiro
→ CollectionService
→ WhatsAppProvider

Isso permite trocar o provedor posteriormente.

## AI10 - Priorizar fluxo real

A implementação deverá ser validada principalmente pelos fluxos:

Aluno
→ Contrato
→ Financeiro
→ Pagamento

Aluno
→ Turma
→ Agenda

Aula
→ Planner
→ Histórico do aluno

Inadimplência
→ Cobrança WhatsApp

---

# 31. Fluxos Críticos

## FL1 - Novo aluno individual

Emily
→ Novo aluno
→ Dados
→ Criar
→ Abrir ficha
→ Novo contrato
→ Individual
→ Valor
→ Frequência
→ Vigência
→ Vencimento
→ Anexar contrato
→ Salvar
→ Financeiro passa a reconhecer as cobranças

## FL2 - Novo aluno em turma

Emily
→ Novo aluno
→ Criar contrato
→ Abrir turma
→ Adicionar aluno
→ Participação ativa
→ Agenda da turma permanece vinculada ao horário

## FL3 - Pagamento

Cobrança pendente
→ aluno paga
→ envia comprovante
→ Emily abre sistema
→ Registrar pagamento
→ anexa comprovante
→ confirma
→ cobrança = Pago
→ dashboard atualizado

## FL4 - Inadimplência

Vencimento passa
→ cobrança continua sem pagamento
→ próximo dia
→ sistema identifica atraso
→ cobrança = Inadimplente
→ determina contato financeiro
→ envia WhatsApp
→ registra tentativa/envio
→ não envia novamente automaticamente

## FL5 - Registro pedagógico individual

Emily
→ Planner
→ Novo registro
→ selecionar aluno
→ data
→ aula
→ conteúdo
→ relatório
→ homework
→ salvar
→ registro aparece na timeline do aluno

## FL6 - Registro de turma

Emily
→ turma
→ Registrar aula
→ conteúdo geral
→ relatório geral
→ observações individuais
→ salvar
→ histórico da turma atualizado
→ histórico de cada aluno atualizado

## FL7 - Cancelamento

Emily
→ aluno
→ Cancelar
→ confirmação
→ aluno cancelado
→ contrato encerrado
→ turma encerrada para aquele aluno
→ assignments individuais encerrados
→ cobranças futuras canceladas
→ histórico preservado

---

# 32. Métrica de Sucesso do MVP

O MVP será considerado bem-sucedido se Emily conseguir operar as principais rotinas da escola sem depender das planilhas atuais para essas mesmas funções.

O sistema deverá tornar mais rápido:

- descobrir horário disponível;
- encontrar aluno;
- consultar contrato;
- verificar vencimento;
- descobrir inadimplência;
- registrar pagamento;
- encontrar comprovante;
- consultar turma;
- registrar aula;
- consultar evolução histórica.

A principal métrica qualitativa será:

> Emily consegue administrar a operação cotidiana da English For All pelo sistema com menos esforço, menos duplicação e maior clareza do que utilizando as planilhas atuais.

---

# 33. Regra Final de Produto

Em qualquer decisão não especificada neste PRD, utilizar a seguinte ordem de prioridade:

1. preservar integridade dos dados;
2. preservar histórico;
3. reduzir trabalho manual;
4. evitar duplicidade;
5. tornar a operação clara para Emily;
6. manter o MVP simples;
7. preparar evolução futura sem implementá-la prematuramente.

Se uma decisão alterar regra de negócio, financeiro, contratos, agenda ou comportamento esperado pela usuária, NÃO assumir silenciosamente.

Solicitar definição antes da implementação.
