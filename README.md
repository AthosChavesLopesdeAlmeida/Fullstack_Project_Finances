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


# Modelagem do banco de dados

### Usuário

O usuário tem os atributos padrão (nome, email, senha, id) e um array de contas
Preferi usar um array para que eu tenha a possibilidade de expandir para a criação de múltiplas contas no futuro

### Conta

Tem um id, user_id (usuário ao qual ela pertence), um array de orçamentos (para cada mês ou espaço de tempo delimitado)

### Orçamento

Tem um id, acc_id (conta à qual ele pertence), data de início (momento em que o usuário o cria, por enquanto) e data de fim (30 dias após a data de início) e valor do orçamento

Futuramente, a data de início vai poder ser estipulada pelo usuário de maneira mais flexível

### Despesa

Uma despesa vai ter um id, um budget_id (orçamento ao qual faz referência), valor gasto e categoria do gasto