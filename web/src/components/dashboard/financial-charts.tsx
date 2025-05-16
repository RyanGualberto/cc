"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  type TooltipProps,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { expenseRequest } from "~/requests/expense";
import { revenueRequest } from "~/requests/revenue";
import { type Team } from "~/types/team";
import { Loading } from "../ui/loading";
import { formatCurrency } from "~/helpers/formatCurrency";

interface MonthlyDataItem {
  name: string;
  value: number;
}

interface CategoryDataItem {
  name: string;
  value: number;
}

interface TrendDataItem {
  name: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#8DD1E1",
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-md border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            className="text-sm"
            style={{ color: entry.color }}
          >
            {`${entry.name}: ${formatCurrency(entry.value!)}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

interface FinancialChartsCardProps {
  team: Team;
  date: string;
}

export default function FinancialChartsCard({
  team,
  date,
}: FinancialChartsCardProps) {
  const {
    data: expenses,
    isPending: expensesPending,
    isError: expensesError,
  } = useQuery({
    queryKey: ["expenses", { teamId: team.id, date }],
    queryFn: async () =>
      await expenseRequest.listByTeamAndDate({
        teamId: team.id,
        date,
      }),
  });

  const {
    data: revenues,
    isPending: revenuesPending,
    isError: revenuesError,
  } = useQuery({
    queryKey: ["revenues", { teamId: team.id, date }],
    queryFn: async () =>
      await revenueRequest.listByTeamAndDate({
        teamId: team.id,
        date,
      }),
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyDataItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataItem[]>([]);
  const [trendData, setTrendData] = useState<TrendDataItem[]>([]);

  useEffect(() => {
    if (expenses && revenues) {
      // Prepare data for comparison chart
      const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amountInCents / 100,
        0,
      );
      const totalRevenues = revenues.reduce(
        (sum, revenue) => sum + revenue.amountInCents / 100,
        0,
      );
      const balance = totalRevenues - totalExpenses;

      setMonthlyData([
        { name: "Receitas", value: totalRevenues },
        { name: "Despesas", value: totalExpenses },
        { name: "Saldo", value: balance },
      ]);

      // Prepare data for category distribution
      const expensesByCategory = expenses.reduce(
        (acc: Record<string, number>, expense) => {
          const categoryName = expense.category?.name ?? "Sem categoria";
          acc[categoryName] =
            (acc[categoryName] ?? 0) + expense.amountInCents / 100;
          return acc;
        },
        {},
      );

      setCategoryData(
        Object.entries(expensesByCategory).map(([name, value]) => ({
          name,
          value,
        })),
      );

      // Prepare data for trend chart (simulated for 6 months)
      const currentDate = new Date();
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() - i);
        months.push(month.toLocaleDateString("pt-BR", { month: "short" }));
      }

      // Simulated data - in a real app, you would fetch this from your API
      setTrendData(
        months.map((month, index) => {
          // Generate some random but consistent data for demo
          const seed = index + 1;
          const revValue = totalRevenues * (0.7 + seed * 0.1);
          const expValue = totalExpenses * (0.8 + seed * 0.05);

          return {
            name: month,
            receitas: revValue,
            despesas: expValue,
            saldo: revValue - expValue,
          };
        }),
      );
    }
  }, [expenses, revenues]);

  const isPending = expensesPending || revenuesPending;
  const isError = expensesError || revenuesError;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <CardTitle>Análise Financeira</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isPending && <Loading />}
        {isError && <div>Erro ao carregar dados financeiros</div>}
        {!isPending && !isError && (
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="comparison">Comparativo</TabsTrigger>
              <TabsTrigger value="categories">Categorias</TabsTrigger>
              <TabsTrigger value="trend">Tendência</TabsTrigger>
            </TabsList>
            <TabsContent value="comparison" className="space-y-4">
              <h3 className="text-lg font-medium">Comparativo Financeiro</h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value as number)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" name="Valor" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="categories" className="space-y-4">
              <h3 className="text-lg font-medium">
                Distribuição de Despesas por Categoria
              </h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="trend" className="space-y-4">
              <h3 className="text-lg font-medium">
                Tendência Financeira (6 meses)
              </h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(value: number) =>
                        `R$${value.toLocaleString()}`
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="receitas"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="despesas"
                      stroke="#ff8042"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="saldo"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
