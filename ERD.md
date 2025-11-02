# ERD for Budget-Managemnt-System

## Entities: 

### User : (Account in this platform)

- user_id (Primary-Key) - Int
- name - String
- email - String
- password - String
- registration_date - Date

### Account : (for different financial accounts)

- account_id (Primary-Key) - Int
- user_id (Foreign-Key) - Int
- account_name - String
- type - String
- balance - Int

### Category : (Types of Expensis (Food , Transportation))

- category_id (Primary-Key) - Int
- user_id (Foreign-Key) - Int 
- name - String
- type - String 

### Budget

- budget_id (Primary-Key) - Int
- user_id (Foreign-Key) - Int
- name - String
- total_amount - Int
- start_date - Date
- end_date - Date

### Transactions 

- transaction_id (Primary-Key) - Int
- account_id (Foreign-Key) - Int
- category_id (Foreign-Key) - Int
- payment_method_id (Foreign-Key) - Int
- amount - Int
- transaction_type - String
- date - Date
- description - String

### PaymentMethod

- payment_method_id (Primary-Key) - Int
- method_name - String


## Relations : 

- User - Account (1 - to - Many) User can have many accounts.
- User - Budget (1 - to - Many) User can define many budgets.
- Category - Transactions (1 - to - Many) every category can have multiple transactions.
- Account - Transactions (1 - to - Many) every Transaction is made with one account.
- Budget - Category (1 - to - Many) a budget may include several categories.
- Transaction – PaymentMethod (1 - to - Many) each transaction is made with one payment method.

