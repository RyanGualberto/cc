import React from "react";
import { type RevenueCategory } from "~/types/revenue-category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { EditRevenueCategoryDialog } from "./edit-revenue-category-dialog";
import { type Team } from "~/types/team";

const RevenueCategoryTable: React.FC<{
  data: Array<RevenueCategory>;
  team: Team;
}> = ({ data, team }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Receitas</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((revenueCategory) => (
          <TableRow key={revenueCategory.id}>
            <TableCell>{revenueCategory.name}</TableCell>
            <TableCell>{revenueCategory._count?.revenues}</TableCell>
            <TableCell className="flex items-center gap-2">
              <EditRevenueCategoryDialog
                team={team}
                revenueCategory={revenueCategory}
              />
              <Button className="bg-red-500/10 text-red-500" size="icon">
                <Trash2 size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RevenueCategoryTable;
