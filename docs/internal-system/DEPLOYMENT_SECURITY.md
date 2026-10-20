# Checklist de segurança para deploy

## Vercel

- Defina `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` em Production e Preview somente para o projeto Supabase correspondente.
- Nunca configure `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` ou `WHATSAPP_API_TOKEN` com prefixo `NEXT_PUBLIC_`.
- Use um projeto Supabase de staging sem dados reais para Preview, ou proteja/desative os deployments de Preview.
- Antes da promoção, confira os logs de build e confirme que nenhum valor de secret foi impresso.

## Supabase

- Mantenha o signup público desabilitado e aprove manualmente o perfil administrativo inicial.
- Aplique migrations primeiro em staging; só então revise e aplique a mesma sequência em produção.
- Execute os Security e Performance Advisors após migrations de DDL.
- Confirme que `contracts`, `payment-receipts` e `imports` são buckets privados, e que somente URLs assinadas de curta duração são usadas.

## Gate de liberação

Execute `npm run verify:landing-lock`, `npm run lint`, `npm run typecheck`, `npm run build` e `npm audit --omit=dev --audit-level=high`. Não promova o deployment se algum deles falhar.
