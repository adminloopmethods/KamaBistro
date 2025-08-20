"use client";

import {AuditLog, getAuditLogsReq} from "@/functionality/fetch";
import {useState, useEffect} from "react";
import {
  FiClock,
  FiUser,
  FiLayers,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiSearch,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalLogs: 0,
    totalPages: 1,
    currentPage: 1,
    limitNum: 10,
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getAuditLogsReq();

      if (response.ok && response.logs) {
        setLogs(response.logs);
        setPagination(response.pagination);
      } else {
        setError(response.error || "Failed to fetch logs");
      }
    } catch (err) {
      setError("An error occurred while fetching logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getOutcomeIcon = (outcome: string) => {
    return outcome === "Success" ? (
      <FiCheckCircle className="text-emerald-500 text-lg" />
    ) : (
      <FiXCircle className="text-rose-500 text-lg" />
    );
  };

  const getActionTypeIcon = (actionType: string) => {
    switch (actionType) {
      case "CREATE":
        return <div className="w-3 h-3 rounded-full bg-blue-500"></div>;
      case "UPDATE":
        return <div className="w-3 h-3 rounded-full bg-amber-500"></div>;
      case "DELETE":
        return <div className="w-3 h-3 rounded-full bg-rose-500"></div>;
      case "LOGIN":
        return <div className="w-3 h-3 rounded-full bg-indigo-500"></div>;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-500"></div>;
    }
  };

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case "CREATE":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "UPDATE":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "DELETE":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "LOGIN":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getOutcomeColor = (outcome: string) => {
    return outcome === "Success"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200";
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({...pagination, currentPage: newPage});
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.action_performed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white border border-red-200 text-red-800">
          <div className="flex items-center mb-4">
            <FiXCircle className="text-red-500 text-xl mr-2" />
            <h2 className="text-lg font-semibold">Error Loading Logs</h2>
          </div>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchLogs}
            className="flex items-center px-4 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            <FiRefreshCw className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl dark:text-white font-bold mb-2">
              Audit Logs
            </h1>
            <p className="text-gray-600">
              Track and monitor all system activities
            </p>
          </div>
          <div className="relative rounded-lg bg-white border border-gray-200">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 " />
            </div>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-900 focus:ring-blue-400 w-64"
            />
          </div>
        </div>

        <div className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
          {/* <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-end items-end sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Recent Activity</h2>
              <p className="text-sm text-gray-600">
                {filteredLogs.length} of {pagination.totalLogs} logs displayed
              </p>
            </div>
            <div className="flex justify-end items-center gap-2">
              <button className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200">
                <FiFilter className="mr-1.5" />
                Filters
              </button>
              <button
                onClick={fetchLogs}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200"
              >
                <FiRefreshCw className="mr-1.5" />
                Refresh
              </button>
            </div>
          </div> */}

          <div className="divide-y divide-gray-200">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-6 transition-colors duration-200 cursor-pointer "
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1.5">
                        {/* {getActionTypeIcon(log.actionType)} */}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={` p-1 rounded-full text-xs font-medium border ${getActionTypeColor(
                              log.actionType
                            )}`}
                          >
                            {log.actionType}
                          </span>
                          <span
                            className={` p-1 rounded-full text-xs font-medium border ${getOutcomeColor(
                              log.outcome
                            )} flex items-center gap-1.5`}
                          >
                            {getOutcomeIcon(log.outcome)}
                            {log.outcome}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-2 dark:text-white text-gray-900">
                          {log.action_performed}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                          <div className="flex items-center dark:text-white">
                            <FiClock className="mr-1.5 text-sm" />
                            <span>{formatDate(log.timestamp)}</span>
                          </div>
                          <div className="flex dark:text-white items-center">
                            <FiLayers className="mr-1.5 text-sm" />
                            <span>
                              {log.entity} • {log.entityId}
                            </span>
                          </div>
                          <div className="flex dark:text-white items-center">
                            <FiUser className="mr-1.5 text-sm" />
                            <span>{log.user.user.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors bg-gray-100 hover:bg-gray-200"
                    >
                      <FiEye className="mr-1.5" />
                      Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <FiSearch className="mx-auto text-3xl mb-3 text-gray-400" />
                <p className="text-gray-600">
                  {searchQuery
                    ? "No logs match your search"
                    : "No logs available"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-blue-500 hover:text-blue-600"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {(pagination.currentPage - 1) * pagination.limitNum + 1}{" "}
                to{" "}
                {Math.min(
                  pagination.currentPage * pagination.limitNum,
                  pagination.totalLogs
                )}{" "}
                of {pagination.totalLogs} results
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`p-2.5 rounded-lg transition-colors ${
                    pagination.currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  } bg-gray-100`}
                >
                  <FiChevronLeft className="text-lg" />
                </button>
                <div className="flex items-center gap-1 mx-2">
                  {Array.from(
                    {length: Math.min(5, pagination.totalPages)},
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            pagination.currentPage === pageNum
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  {pagination.totalPages > 5 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                </div>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`p-2.5 rounded-lg transition-colors ${
                    pagination.currentPage === pagination.totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  } bg-gray-100`}
                >
                  <FiChevronRight className="text-lg" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for log details */}
      {selectedLog && (
        <div
          className="fixed inset-0 overflow-y-auto z-50 transition-opacity duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setSelectedLog(null)}
            >
              <div
                className="absolute inset-0
              "
              ></div>
            </div>

            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl">
              <div className="p-6 bg-white rounded-t-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Audit Log Details</h3>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100"
                    aria-label="Close details"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        Action
                      </h4>
                      <div className="flex items-center gap-2">
                        <span
                          className={` p-1 rounded-full text-xs font-medium border ${getActionTypeColor(
                            selectedLog.actionType
                          )}`}
                        >
                          {selectedLog.actionType}
                        </span>
                        <p className="text-sm text-gray-800">
                          {selectedLog.action_performed}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        Entity
                      </h4>
                      <p className="text-sm text-gray-800">
                        {selectedLog.entity}{" "}
                        <span className="text-gray-600">
                          ({selectedLog.entityId})
                        </span>
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        User
                      </h4>
                      <p className="text-sm text-gray-800">
                        {selectedLog.user.user.name}{" "}
                        <span className="text-gray-600">
                          ({selectedLog.user.user.email})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        Outcome
                      </h4>
                      <span
                        className={` p-1 rounded-full text-xs font-medium border ${getOutcomeColor(
                          selectedLog.outcome
                        )} flex items-center gap-1.5 w-fit`}
                      >
                        {getOutcomeIcon(selectedLog.outcome)}
                        {selectedLog.outcome}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        Timestamp
                      </h4>
                      <p className="text-sm text-gray-800">
                        {formatDate(selectedLog.timestamp)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        IP Address
                      </h4>
                      <p className="text-sm font-mono text-gray-800">
                        {selectedLog.ipAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-3">
                      Old Value
                    </h4>
                    <div className="p-4 rounded-xl max-h-52 overflow-auto bg-gray-100 border border-gray-200">
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {selectedLog.oldValue
                          ? JSON.stringify(selectedLog.oldValue, null, 2)
                          : "Null"}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-3">
                      New Value
                    </h4>
                    <div className="p-4 rounded-xl max-h-52 overflow-auto bg-gray-100 border border-gray-200">
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {selectedLog.newValue
                          ? JSON.stringify(selectedLog.newValue, null, 2)
                          : "No data"}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2.5 rounded-lg font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
