import { useMemo, useState } from "react";
import { MOCK_EVALUATIONS } from "../../assets/mockData";
import { Card } from "./SharedComponents";
import { CheckCircle } from "lucide-react";

const Evaluation = () => {
  const [pendingOnly, setPendingOnly] = useState(true);

  const filteredEvaluations = useMemo(() => {
    return pendingOnly
      ? MOCK_EVALUATIONS.filter(e => e.status === "Pending")
      : MOCK_EVALUATIONS;
  }, [pendingOnly]);

  const totalPending = MOCK_EVALUATIONS.filter(e => e.status === "Pending").length;

  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">
        Evaluation & Grading
      </h2>

      {/* Bright Mode Card */}
      <Card className="bg-white border border-gray-300 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold" style={{ color: "#007FFF" }}>
            Submissions for Grading
          </h3>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Total Pending:{" "}
              <span className="font-bold" style={{ color: "#FF8C00" }}>
                {totalPending}
              </span>
            </span>

            {/* Toggle Button */}
            <button
              onClick={() => setPendingOnly(!pendingOnly)}
              className="text-white px-4 py-2 rounded-lg text-sm transition duration-150 flex items-center shadow"
              style={{ backgroundColor: "#007FFF" }}
            >
              {pendingOnly ? "Show All" : "Show Pending Only"}
              <CheckCircle className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-800">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 uppercase text-xs text-gray-600">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Assignment</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Score</th>
              </tr>
            </thead>

            <tbody>
              {filteredEvaluations.map(e => (
                <tr
                  key={e.id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition duration-150"
                >
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {e.student}
                  </td>

                  <td className="py-4 px-4" style={{ color: "#007FFF" }}>
                    {e.assignment}
                  </td>

                  <td className="py-4 px-4 text-gray-800">
                    {e.submissionDate}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold`}
                      style={{
                        backgroundColor:
                          e.status === "Pending"
                            ? "rgba(255, 140, 0, 0.15)"
                            : "rgba(0, 128, 0, 0.15)",
                        color: e.status === "Pending" ? "#FF8C00" : "green",
                      }}
                    >
                      {e.status}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    {e.status === "Pending" ? (
                      <button
                        className="text-white px-3 py-1 text-xs rounded-lg shadow transition"
                        style={{ backgroundColor: "#FF8C00" }}
                      >
                        Grade Now
                      </button>
                    ) : (
                      <span className="text-lg font-bold" style={{ color: "#007FFF" }}>
                        {e.score}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEvaluations.length === 0 && (
            <p className="text-center py-8 text-gray-600">
              All submissions have been graded. Great job!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Evaluation;
