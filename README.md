# Descrição do projeto

### Este projeto foi construído com a seguinte stack:

- React (via Next.js)
- Prisma ORM (para PostgreSQL em neon.tech)
- Route Handler do Next.js no lugar de um servidor Express 
- Tailwind
- shadcn/ui (para componentes)

### Este Projeto funciona da seguinte maneira:

Um usuário cria uma conta e estipula um orçamento para um mês (30 dias a partir da criação desse orçamento) 
Durante esse tempo, o usuário registra seus gastos e é calculado o valor restante de seu orçamento

O gasto contém:
- Valor gasto
- Categoria do gasto (alimentação, transporte etc.)

### Possibilidades futuras

1. O usuário poderá cadastrar diversas contas (contas bancárias) e estipular orçamentos para estas

2. O tempo para os orçamentos será mais flexível (semanal, trimestral, semestral etc)

3. Dashboard de estatísticas do usuário com gráficos


*Porém, vou manter simples até completar o funcionamento principal*
