
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  CalendarIcon, 
  DownloadIcon, 
  PieChart, 
  BarChart, 
  LineChart
} from "lucide-react";
import { format } from "date-fns";
import { reportsApi } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";

// Color constants for charts
const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", 
  "#00C49F", "#FFBB28", "#FF8042", "#a4de6c", "#d0ed57"
];

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(1)), // First day of current month
    to: new Date()
  });
  
  const [activeChart, setActiveChart] = useState("spending");

  // Format dates for API requests
  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
  
  // Query for spending by category data
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["spending-by-category", formatDate(dateRange.from), formatDate(dateRange.to)],
    queryFn: () => reportsApi.getSpendingByCategory({
      start_date: formatDate(dateRange.from),
      end_date: formatDate(dateRange.to)
    }).then(res => res.data),
  });
  
  // Query for spending over time data
  const { data: timeData, isLoading: timeLoading } = useQuery({
    queryKey: ["spending-over-time", formatDate(dateRange.from), formatDate(dateRange.to)],
    queryFn: () => reportsApi.getSpendingOverTime({
      start_date: formatDate(dateRange.from),
      end_date: formatDate(dateRange.to)
    }).then(res => res.data),
  });

  // Query for income by category data
  const { data: incomeData, isLoading: incomeLoading } = useQuery({
    queryKey: ["income-by-category", formatDate(dateRange.from), formatDate(dateRange.to)],
    queryFn: () => reportsApi.getIncomeByCategory({
      start_date: formatDate(dateRange.from),
      end_date: formatDate(dateRange.to)
    }).then(res => res.data),
  });

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await reportsApi.exportReport(activeChart, {
        start_date: formatDate(dateRange.from),
        end_date: formatDate(dateRange.to),
        format
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeChart}-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export report");
    }
  };

  // Chart data configuration for spending by category
  const chartConfig = {
    spending: { 
      title: "Spending by Category",
      description: "Where your money is going",
      data: categoryData || [],
      loading: categoryLoading,
      icon: PieChart,
    },
    income: { 
      title: "Income by Category",
      description: "Your sources of income",
      data: incomeData || [],
      loading: incomeLoading,
      icon: BarChart,
    },
    trends: { 
      title: "Spending & Income Trends",
      description: "How your finances are changing over time",
      data: timeData || [],
      loading: timeLoading,
      icon: LineChart,
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your spending and income patterns.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  <>
                    {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                  </>
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleExport('csv')}
              title="Export as CSV"
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleExport('pdf')}
              title="Export as PDF"
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="spending" onValueChange={setActiveChart}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {Object.entries(chartConfig).map(([key, config]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>{config.title}</CardTitle>
                  <CardDescription>{config.description}</CardDescription>
                </div>
                <config.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="h-80">
                {config.loading ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Loading chart data...</p>
                  </div>
                ) : config.data.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No data available for the selected period</p>
                  </div>
                ) : (
                  <div className="h-full w-full">
                    {key === "spending" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Tooltip content={<ChartTooltipContent />} />
                          <Pie
                            data={config.data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="amount"
                            nameKey="category"
                            label={({ category, percent }) => 
                              `${category}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {config.data.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    )}
                    
                    {key === "income" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={config.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="amount" fill="#82ca9d" name="Income" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    )}
                    
                    {key === "trends" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={config.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="spending"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                            name="Spending"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="income" 
                            stroke="#82ca9d" 
                            name="Income"
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Reports;
