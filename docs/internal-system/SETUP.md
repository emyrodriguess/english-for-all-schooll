# Setup do sistema interno

## Variáveis

Copie `.env.example` para `.env.local` e preencha a URL e a chave publicável do projeto Supabase. Nunca exponha a service-role key no cliente.

## Desenvolvimento local

1. Instale Docker e Supabase CLI.
2. Execute `supabase start`.
3. Aplique o schema com `supabase db reset`.
4. Inicie o app com `npm run dev`.

O seed cria dados apenas quando for explicitamente preenchido. A usuária inicial deve ser criada pelo painel/Auth Admin, nunca inserida diretamente em `auth.users` por migration. Novas contas nascem com `profiles.active = false`; após criar a Emily, ative somente o perfil dela e mantenha `must_change_password = true` para exigir a troca da senha temporária no primeiro acesso.

## Banco remoto

O schema do sistema interno já foi aplicado ao projeto remoto via MCP; não há migration manual pendente para a Emily executar. As mesmas alterações permanecem versionadas em `supabase/migrations/` como fonte de verdade para recuperação, auditoria e futuros ambientes.

Em mudanças futuras, confira o projeto alvo e o diff antes da aplicação. Depois do DDL, gere novamente os tipos TypeScript e execute os advisors de segurança e performance.

## Ativação da Emily

1. Crie a conta com o e-mail real por uma operação de Auth Admin e uma senha temporária forte.
2. Confirme que o gatilho criou `public.profiles` com `active = false` e `must_change_password = true`.
3. Ative exclusivamente o perfil correspondente à Emily.
4. Entregue a senha temporária por um canal seguro. No primeiro login, `/admin` encaminhará para `/admin/alterar-senha` antes de liberar o dashboard.

## Verificação

Execute `npm run check` antes de entregar mudanças. Para alterações funcionais, acrescente os testes do fluxo correspondente.
