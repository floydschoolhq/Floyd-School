import { useContext } from "react";
import { PortalContext } from "../Context/PortalProvider";
import { Card } from "./SharedComponentStudent";


const ParentDashboard = () => {
  
  const { user } = useContext(PortalContext);
  return (
    <div className="space-y-8">
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
        <p className="text-sm font-semibold text-indigo-700">Hello, {user?.name}.</p>
        <h2 className="text-3xl font-extrabold text-indigo-900 mt-1">Tracking Progress for {user?.studentName}.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Recent Activity" className="col-span-2">
          <ul className="space-y-3 text-gray-700">
            <li className="flex justify-between items-center text-sm border-b pb-2">
              <span>Completed: "React Hooks Deep Dive" (65% to 100%)</span>
              <span className="text-xs text-green-600">2 hours ago</span>
            </li>
            <li className="flex justify-between items-center text-sm border-b pb-2">
              <span>Submitted: "Web Frameworks Project"</span>
              <span className="text-xs text-green-600">Yesterday</span>
            </li>
            <li className="flex justify-between items-center text-sm pb-2">
              <span>Scored 92% on Data Structures Quiz</span>
              <span className="text-xs text-green-600">3 days ago</span>
            </li>
          </ul>
        </Card>
        <Card title="Current Focus" className="col-span-1">
          <p className="text-lg font-semibold text-gray-800">Web Frameworks Project</p>
          <p className="text-sm text-gray-500 mt-1">Due: Oct 15 | Status: Pending Review</p>
          <button className="mt-4 text-sm text-indigo-600 hover:underline">View Full Report</button>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboard;