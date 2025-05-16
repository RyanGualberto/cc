import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { type Team } from "~/types/team";
import { Button } from "../ui/button";
import Show from "../utils/show";
import { HeaderWithMonthPicker } from "../ui/header-with-month-picker";
import { RevenuesTable } from "./revenues-table";
import { RevenueResumeCards } from "./revenue-resume-cards";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { revenueRequest } from "~/requests/revenue";
import Link from "next/link";
import { AddRevenueDialog } from "./add-revenue-dialog";
import { Loading } from "../ui/loading";
import { type RowSelectionState } from "@tanstack/react-table";
import { type Revenue } from "~/types/revenue";

const RevenuesCard: React.FC<{
  team: Team;
  short?: boolean;
}> = ({ team, short = false }) => {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const queryClient = useQueryClient();
  const [date, setDate] = React.useState(
    new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      year: "numeric",
    }),
  );
  const {
    data: revenues,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["revenues", { teamId: team.id }],
    queryFn: async () =>
      await revenueRequest.listByTeamAndDate({
        teamId: team.id,
        date,
      }),
  });
  const [filteredData, setFilteredData] = React.useState<Revenue[]>([]);

  useEffect(() => {
    setFilteredData(revenues ?? []);
  }, [revenues]);

  useEffect(() => {
    void queryClient.invalidateQueries({
      queryKey: ["revenues", { teamId: team.id }],
    });
  }, [date, team.id, queryClient]);

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <CardTitle className="w-full">Despesas</CardTitle>
        <AddRevenueDialog team={team} />
      </CardHeader>
      <Show
        when={isPending}
        component={
          <CardContent>
            <Loading />
          </CardContent>
        }
      />
      <Show
        when={isError}
        component={<CardContent>Erro ao carregar despesas</CardContent>}
      />
      <Show
        when={Boolean(revenues)}
        component={
          <CardContent className="flex flex-col gap-8">
            <HeaderWithMonthPicker value={date} onChange={setDate} />
            <RevenueResumeCards rowSelection={rowSelection} data={filteredData} />
            <RevenuesTable
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              onFilteredRowsChange={setFilteredData}
              short={short}
              data={revenues!}
              teamId={team.id}
            />
            <Show
              component={
                <Button className="w-full" variant="ghost" asChild>
                  <Link href={`/app/${team.id}/revenues`}>
                    Ver todas as despesas
                  </Link>
                </Button>
              }
              when={short}
            />
          </CardContent>
        }
      />
    </Card>
  );
};

export default RevenuesCard;
