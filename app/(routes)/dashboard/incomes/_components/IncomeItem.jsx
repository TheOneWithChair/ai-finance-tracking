import React from "react";

function IncomeItem({ budget }) {
  return (
    <div
      className="p-5 border rounded-2xl
    hover:shadow-md cursor-pointer h-[170px]"
    >
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2
            className="text-2xl p-3 px-4
              bg-slate-100 rounded-full 
              "
          >
            {budget?.icon || '💰'}
          </h2>
          <div>
            <h2 className="font-bold">{budget?.name || 'N/A'}</h2>
            <h2 className="text-sm text-gray-500">Monthly Income</h2>
          </div>
        </div>
        <h2 className="font-bold text-primary text-lg">
          ₹{budget?.amount || 'N/A'}
        </h2>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm text-gray-600">
          Created on: {budget?.createdAt || 'N/A'}

          </h2>
        </div>
      </div>
    </div>
  );
}

export default IncomeItem;

