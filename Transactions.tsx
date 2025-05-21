
import { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data
const mockTransactions = [
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
  {
    id: "6",
    description: "Movie",
    amount: 25,
    type: "expense",
    category: "Entertainment",
    date: "2023-06-15",
  },
  {
    id: "7",
    description: "Freelance Work",
    amount: 500,
    type: "income",
    category: "Income",
    date: "2023-06-18",
  },
  {
    id: "8",
    description: "Electricity Bill",
    amount: 85,
    type: "expense",
    category: "Utilities",
    date: "2023-06-20",
  },
];

const categories = [
  "Housing",
  "Food",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Healthcare",
  "Education",
  "Income",
  "Other",
];

// Transaction form schema
const transactionFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce
    .number()
    .positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  date: z.date(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const Transactions = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    if (
      search &&
      !transaction.description.toLowerCase().includes(search.toLowerCase()) &&
      !transaction.category.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    // Type filter
    if (typeFilter !== "all" && transaction.type !== typeFilter) {
      return false;
    }

    // Category filter
    if (categoryFilter !== "all" && transaction.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  // Transaction form
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
      category: "",
      date: new Date(),
    },
  });

  const onSubmit = (data: TransactionFormValues) => {
    // In a real app, you would call an API to add the transaction
    const newTransaction = {
      id: Math.random().toString(36).substring(2, 9),
      description: data.description,
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: data.date.toISOString().split("T")[0],
    };

    setTransactions([newTransaction, ...transactions]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Manage your income and expenses.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setSearch("")}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Type filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FilterIcon className="h-4 w-4" />
                {typeFilter === "all"
                  ? "All Types"
                  : typeFilter === "income"
                  ? "Income"
                  : "Expenses"}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <DropdownMenuRadioItem value="all">
                  All Types
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="income">
                  Income
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="expense">
                  Expenses
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FilterIcon className="h-4 w-4" />
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
              <DropdownMenuRadioGroup
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <DropdownMenuRadioItem value="all">
                  All Categories
                </DropdownMenuRadioItem>
                {categories.map((category) => (
                  <DropdownMenuRadioItem key={category} value={category}>
                    {category}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Transaction Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Rent, Groceries, Salary..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Add Transaction</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No transactions found.
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b py-4 last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpIcon className="h-4 w-4 text-finance-income" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-finance-expense" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-finance-income"
                          : "text-finance-expense"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;