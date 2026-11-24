# Raízes do Nordeste — Front-end

Aplicação web (SPA) desenvolvida para o **Projeto Multidisciplinar – Trilha Front-End**. Simula o sistema de pedidos da rede de lanchonetes **Raízes do Nordeste**, com cardápio por unidade, pedidos, fidelidade, promoções, pagamento externo simulado e conformidade com a LGPD.

> Projeto acadêmico. Todos os dados são fictícios e nenhum pagamento real é processado.

## Stack

- React 18 + Vite
- Tailwind CSS 3
- React Router 6
- Dados mockados em `src/data` e persistência em `localStorage`
- Sem back-end, sem biblioteca de UI

## Como executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

Para validar o build de produção:

```bash
npm run build
npm run preview
```

## Credenciais de demonstração

| Campo | Valor |
| --- | --- |
| E-mail | `demo@raizes.com` |
| Senha | `123456` |
| Pontos | 120 |

Também é possível criar uma conta em `/cadastro` (o cadastro concede 20 pontos de boas-vindas).

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Início, seleção de canal e destaques |
| `/unidades` | Unidades da rede |
| `/unidades/:id/cardapio` | Cardápio da unidade |
| `/carrinho` | Carrinho |
| `/checkout` | Pagamento e consentimento LGPD (protegida) |
| `/pedidos/:id` | Acompanhamento do pedido |
| `/pedidos` | Histórico do cliente (protegida) |
| `/fidelidade` | Pontos e benefícios (protegida) |
| `/promocoes` | Campanhas e cupons |
| `/perfil` | Dados, consentimentos e exclusão (protegida) |
| `/login` e `/cadastro` | Autenticação |
| `/lgpd` | Política de privacidade |

## Fluxo principal

1. Escolher uma unidade.
2. Montar o pedido no cardápio.
3. Revisar o carrinho.
4. Entrar/cadastrar-se.
5. Aplicar cupom e/ou pontos, aceitar o consentimento LGPD e pagar (simulado).
6. Acompanhar o status e ganhar pontos.

Para testar a **recusa de pagamento**, marque “Simular recusa do pagamento” no checkout. O pedido não é criado e o usuário pode tentar novamente.

## Organização

```
src/
  components/    ui, dominio e layout
  contexts/      autenticação, carrinho e canal
  data/          mocks
  pages/         uma página por rota
  services/      acesso a dados
  utils/         formatação, validação e constantes
```

## Observações

- O pagamento é uma simulação: `src/services/pagamentoService.js`.
- O avanço do status do pedido é manual, pensado para demonstração.
- A política de privacidade é um texto acadêmico e não substitui orientação jurídica.