enum ExpenseCategory {
  'Food',
  'Transport',
  'Housing',
  'Health',
  'Education',
  'Leisure',
  'Shopping',
  'Bills',
  'Other',
}

export interface Expense  { 
  id: string,
  spent_value: number,
  category: ExpenseCategory,
  created_at: Date
}