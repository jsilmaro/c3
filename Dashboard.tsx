
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  DollarSign,
  TrendingDown,
  TrendingUp, 
  Wallet
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from "recharts";
import { dashboardApi } from "@/services/api";

// Types
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyChange: number;
  expensesByCategory: {
    category: string;
    amount: number;
  }[];
  recentTransactions: Transaction[];
  spendingOverTime: {
    date: string;
    income: number;
    expenses: number;
  }[];
}

// Mock data for initial render
const mockData: DashboardSummary = {
  totalIncome: 4250,
  totalExpenses: 2830,
  balance: 1420,
  monthlyChange: 15.3,
  expensesByCategory: [
    { category: "Housing", amount: 800 },
    { category: "Food", amount: 350 },
    { category: "Transportation", amount: 250 },
    { category: "Entertainment", amount: 120 },
    { category: "Utilities", amount: 230 },
    { category: "Shopping", amount: 380 },
    { category: "Other", amount: 100 },
  ],
  recentTransactions: [
    {
      id: "1",
      description: "Salary",
      amount: 4250,
      type: "income",
      category: "Income",
      date: "2023-06-01",
    },
    {
      id: "2",
      description: "Rent",
      amount: 800,
      type: "expense",
      category: "Housing",
      date: "2023-06-03",
    },
    {
      id: "3",
      description: "Groceries",
      amount: 150,
      type: "expense",
      category: "Food",
      date: "2023-06-05",
    },
    {
      id: "4",
      description: "Dinner",
      amount: 65,
      type: "expense",
      category: "Food",
      date: "2023-06-10",
    },
    {
      id: "5",
      description: "Gas",
      amount: 45,
      type: "expense",
      category: "Transportation",
      date: "2023-06-12",
    },
  ],
  spendingOverTime: [
    { date: "Jan", income: 3800, expenses: 2500 },
    { date: "Feb", income: 3900, expenses: 2600 },
    { date: "Mar", income: 4100, expenses: 2700 },
    { date: "Apr", income: 4000, expenses: 2900 },
    { date: "May", income: 4150, expenses: 2750 },
    { date: "Jun", income: 4250, expenses: 2830 },
  ],
};

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary>(mockData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch data from your API
        // For now, just simulate a short loading state
        setTimeout(() => {
          // Here we'd typically call the API:
          // const response = await dashboardApi.getSummary();
          // setSummary(response.data);
          
          // But for now, we'll just use our mock data
          setSummary(mockData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your financial overview and recent activity.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-income">
              {formatCurrency(summary.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">For the current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-expense">
              {formatCurrency(summary.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">For the current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.balance)}
            </div>
            <p className="text-xs text-muted-foreground">Available funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Change</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {summary.monthlyChange}%
              </div>
              <span className="ml-2 text-finance-income">
                <ArrowUpIcon className="h-4 w-4" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Compared to last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Recent Transactions */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Spending Over Time Chart */}
        <Card className="col-span-7 md:col-span-4">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={summary.spendingOverTime}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value)]}
                    labelStyle={{ color: '#333' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#incomeGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#expenseGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-7 md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.recentTransactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === "income" 
                        ? "bg-green-100" 
                        : "bg-red-100"
                    }`}>
                      {transaction.type === "income" ? (
                        <ArrowUpIcon className="h-4 w-4 text-finance-income" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-finance-expense" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.category} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === "income" 
                      ? "text-finance-income" 
                      : "text-finance-expense"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;