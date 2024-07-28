# Expense-Buddy

Expense-Buddy is a debt simplification tool designed to help groups manage shared expenses efficiently. Users can create groups, add expenses, split costs, and simplify transactions to minimize the number of exchanges needed to settle debts.

## Features

- **Group Creation**: Create groups with multiple users.
- **Expense Management**: Add expenses and split them among group members.
- **Debt Simplification**: Reduce the number of transactions needed to settle debts.

## Example

Consider a group with three users: Alice, Bob, and Charlie. The initial debts are as follows:
- Alice owes Bob $50
- Alice owes Charlie $20
- Bob owes Charlie $30

Without simplification, there are three transactions:
1. Alice pays Bob $50
2. Alice pays Charlie $20
3. Bob pays Charlie $30

With Expense-Buddy's simplification feature, the transactions are reduced:
1. Alice pays Bob $20
2. Alice pays Charlie $50

This simplification minimizes the number of transactions while ensuring that everyone is paid what they are owed.

## Installation

To install Expense-Buddy, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/expense-buddy.git
    ```
2. Navigate to the project directory:
    ```bash
    cd expense-buddy
    ```
3. Install the required dependencies:
   In both frontend and Backend folder
    ```bash
    npm install
    ```
4. Run Backend 
   ```bash
    node app.js
    ```
5. Run Backend
   ```bash
   npm run dev
    ```

## Usage

1. Create a group and add users.
2. Add expenses and specify how they should be split among the users.
3. Use the debt simplification feature to minimize the number of transactions.

