import React from "react";
import StatusBadge from "../components/StatusBadge";

const LeadsTable = ({ leads }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>

            
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{lead.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{lead.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap">{lead.date}</td>

              
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={lead.status || "new"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;