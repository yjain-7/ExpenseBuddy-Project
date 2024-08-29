# Expense-Buddy

![Expense Buddy Logo](https://via.placeholder.com/150x150.png?text=Expense+Buddy)

Expense-Buddy is a powerful debt simplification tool designed to help groups manage shared expenses efficiently. Whether you're splitting bills with roommates, planning a group trip, or managing team expenses, Expense-Buddy streamlines the process and minimizes the hassle of settling debts.

## Features

- **Group Creation**: Easily create and manage groups with multiple users.
- **Expense Management**: Add expenses and split them among group members with flexible options.
- **Debt Simplification**: Reduce the number of transactions needed to settle debts within the group.
- **User-Friendly Interface**: Intuitive design for seamless navigation and expense tracking.
- **Secure Authentication**: Protect your financial data with robust user authentication.

## Upcoming Feature

- **Currency Converter**: Simplify expenses across different currencies for international groups or travelers.

## How It Works

Consider a group with three users: Alice, Bob, and Charlie. The initial debts are as follows:
- Alice owes Bob $50
- Alice owes Charlie $20
- Bob owes Charlie $30

Without simplification, there would be three transactions:
1. Alice pays Bob $50
2. Alice pays Charlie $20
3. Bob pays Charlie $30

With Expense-Buddy's simplification feature, the transactions are reduced to:
1. Alice pays Bob $20
2. Alice pays Charlie $50

This simplification minimizes the number of transactions while ensuring that everyone is paid what they are owed.

## Installation

To get Expense-Buddy up and running on your local machine, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/expense-buddy.git
   ```

2. Navigate to the project directory:
   ```bash
   cd expense-buddy
   ```

3. Install the required dependencies for both frontend and backend:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

4. Start the backend server:
   ```bash
   cd backend && node app.js
   ```

5. In a new terminal, start the frontend development server:
   ```bash
   cd frontend && npm run dev
   ```

6. Open your browser and visit `http://localhost:5173` to see Expense-Buddy in action!

## Usage

1. Create an account or log in to your existing account.
2. Create a new group and invite your friends or colleagues.
3. Start adding expenses, specifying how they should be split among the group members.
4. Use the debt simplification feature to get an optimized plan for settling all debts within the group.
5. Settle up and enjoy your simplified finances!

## Contributing

We welcome contributions to Expense-Buddy! If you have suggestions for improvements or encounter any issues, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please contact us at support@expensebuddy.com.

---

Happy expense tracking with Expense-Buddy! 💰🤝
