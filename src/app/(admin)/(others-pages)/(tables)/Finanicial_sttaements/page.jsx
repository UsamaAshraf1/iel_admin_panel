"use client"
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import FinancialStatementTable from "@/components/tables/FinancialsStatementTable";
import EconomicModal from "@/components/example/EconmicCalenderModal";
import FinancialStatementModal from "@/components/example/FinanicialStatementModal";
import React from "react";



export default function BasicTables() {
   const [refresh,setRefresh]=useState(false)
  return (
    <div>
      <div className="space-y-6">
         <FinancialStatementModal setValue={setRefresh}/>
        <ComponentCard title="Finanicial Statement">
          <FinancialStatementTable value={refresh} setValue={setRefresh}/>
        </ComponentCard>
      </div>
    </div>
  );
}
