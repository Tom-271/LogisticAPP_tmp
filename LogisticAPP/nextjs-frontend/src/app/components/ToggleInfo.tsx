"use client";

import React, { useState } from "react";

type Selected = "a" | "b" | null;

export default function ToggleInfo() {
  const [selected, setSelected] = useState<Selected>("a");

  const baseBtn = "flex-1 sm:flex-none px-2 sm:px-6 py-2.5 text-sm sm:text-base font-medium rounded-lg shadow-md transition-all duration-200 text-center";
  const activeBtn = "bg-blue-600 text-white hover:bg-blue-700";
  const inactiveBtn = "bg-gray-200 text-gray-800 hover:bg-gray-300";

  function handleClickSpedizioni() {
    setSelected("a");
  }

  function handleClickOrdini() {
    setSelected("b");
  }

  let classeBottoneSpedizioni = selected === "a" ? `${baseBtn} ${activeBtn}` : `${baseBtn} ${inactiveBtn}`;
  let classeBottoneOrdini = selected === "b" ? `${baseBtn} ${activeBtn}` : `${baseBtn} ${inactiveBtn}`;

  let riquadro;
  if (selected === "a") {
    const tableItems = [
      { name: "Solo learn app", date: "Oct 9, 2023", status: "Active", price: "$35.000", plan: "Monthly subscription" },
      { name: "Window wrapper", date: "Oct 12, 2023", status: "Active", price: "$12.000", plan: "Monthly subscription" },
      { name: "Unity loroin", date: "Oct 22, 2023", status: "Archived", price: "$20.000", plan: "Annually subscription" },
      { name: "Background remover", date: "Jan 5, 2023", status: "Active", price: "$5.000", plan: "Monthly subscription" },
      { name: "Colon tiger", date: "Jan 6, 2023", status: "Active", price: "$9.000", plan: "Annually subscription" },
    ];

    riquadro = (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 w-full overflow-hidden">
        <div className="max-w-screen-xl mx-auto">
          <div className="items-start justify-between md:flex mb-6">
            <div className="max-w-lg">
              <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">All products</h3>
              <p className="text-gray-600 mt-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </div>
          </div>
          
          <div className="relative w-full overflow-x-auto rounded-lg border border-blue-200 bg-white shadow-sm">
            <table className="w-full table-auto text-sm text-left">
              <thead className="text-gray-600 font-medium border-b bg-gray-50">
                <tr>
                  <th className="py-3 px-4 whitespace-nowrap">Name</th>
                  <th className="py-3 px-4 whitespace-nowrap">Date</th>
                  <th className="py-3 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 whitespace-nowrap">Plan</th>
                  <th className="py-3 px-4 whitespace-nowrap">Price</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {tableItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-full font-semibold text-xs ${item.status === "Active" ? "text-green-700 bg-green-100" : "text-gray-700 bg-gray-100"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{item.plan}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } else if (selected === "b") {
    riquadro = (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-900 w-full">
        I tuoi ordini.
      </div>
    );
  } else {
    riquadro = null;
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-center gap-2 sm:gap-4 w-full max-w-md mx-auto">
        <button
          type="button"
          onClick={handleClickSpedizioni}
          aria-pressed={selected === "a"}
          className={classeBottoneSpedizioni}
        >
          SPEDIZIONI
        </button>
        <button
          type="button"
          onClick={handleClickOrdini}
          aria-pressed={selected === "b"}
          className={classeBottoneOrdini}
        >
          ORDINI
        </button>
      </div>
      {riquadro}
    </div>
  );
}