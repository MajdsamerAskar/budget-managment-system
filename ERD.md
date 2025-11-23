# ERD for Budget-Managemnt-System

## Entities: 

### User : (Account in this platform)

- id (Primary Key) - String (UUID)
- email - String (unique)
- created_at - Timestamp

### Account (Financial accounts - Bank, Wallet, Credit)

- id (Primary Key) - String (UUID)
- user_id (Foreign Key) - String → User.id
- account_name - String
- type - Enum: "Bank" | "Wallet" | "Credit"
- balance - Decimal/Number
- created_at - Timestamp

### Category (Types of Income/Expenses)

- id (Primary Key) - String (UUID)
- user_id (Foreign Key) - String → User.id
- name - String
- type - Enum: "Income" | "Expense"
- description - String (optional)
- color - String (optional, for UI)
- icon - String (optional, for UI)
- created_at - Timestamp


### Budget

- id (Primary Key) - String (UUID)
- user_id (Foreign Key) - String → User.id
- category_id (Foreign Key) - String → Category.id
- name - String
- total_amount - Decimal/Number
- spent - Decimal/Number (calculated/cached field)
- start_date - Date
- end_date - Date
- created_at - Timestamp

### Transactions 

- id (Primary Key) - String (UUID)
- user_id (Foreign Key) - String → User.id
- account_id (Foreign Key) - String → Account.id
- category_id (Foreign Key) - String → Category.id
- budget_id (Foreign Key, Nullable) - String → Budget.id
- payment_method - String (stored directly, not FK)
- amount - Decimal/Number
- transaction_type - Enum: "Income" | "Expense"
- date - Date
- description - String (optional)
- created_at - Timestamp


## Relations : 

- User → Account (1-to-Many) -- One user can have multiple accounts
User.id ← Account.user_id


- User → Category (1-to-Many) -- One user can create multiple custom categories
User.id ← Category.user_id


- User → Budget (1-to-Many) -- One user can define multiple budgets
User.id ← Budget.user_id


- Category → Budget (1-to-Many) One category can have multiple budgets (e.g., monthly food budgets)
Category.id ← Budget.category_id


- User → Transaction (1-to-Many) -- One user can have multiple transactions
User.id ← Transaction.user_id


- Account → Transaction (1-to-Many) -- One account can have multiple transactions
Account.id ← Transaction.account_id


- Category → Transaction (1-to-Many) -- One category can have multiple transactions
Category.id ← Transaction.category_id


- Budget → Transaction (1-to-Many, Optional) -- One budget can track multiple transactions
Budget.id ← Transaction.budget_id (nullable)