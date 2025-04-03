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
import { EditRevenueCategoryDialog } from "./edit-revenue-category-dialog";
import { type Team } from "~/types/team";
import { DeleteRevenueCategoryDialog } from "./delete-revenue-category-dialog";

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
              <DeleteRevenueCategoryDialog revenueCategory={revenueCategory} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RevenueCategoryTable;
