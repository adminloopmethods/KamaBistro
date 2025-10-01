// components/VersionHistoryModal.tsx
"use client";
import React, {useState, useEffect} from "react";
import {X, Calendar, RotateCcw, CheckCircle} from "lucide-react";
import {
  getWebpageVersionsReq,
  rollbackWebpageVersionReq,
} from "@/functionality/fetch";

interface VersionContent {
  Status: boolean;
  contents: any[];
  createdAt: string;
  editedWidth: string;
  editorId: string;
  id: string;
  locationId: string | null;
  name: string;
  route: string;
  updatedAt: string;
  verifierId: string;
}

interface ApiVersion {
  id: string;
  version: VersionContent;
  webpageId: string;
  createdAt: string;
  updatedAt: string;
}

interface Version {
  id: string;
  versionNumber: number;
  title: string;
  content: any;
  createdAt: string;
  updatedAt: string;
  isLive: boolean;
}

interface Webpage {
  id: string;
  title: string;
  name?: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
  webpage: Webpage | null;
  onRollbackSuccess: () => void;
}

const VersionHistoryModal: React.FC<Props> = ({
  show,
  onClose,
  webpage,
  onRollbackSuccess,
}) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState<string | null>(null);
  const [currentLiveVersionId, setCurrentLiveVersionId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (show && webpage?.id) {
      fetchVersions();
    }
  }, [show, webpage?.id]);

  const fetchVersions = async () => {
    if (!webpage?.id) return;

    try {
      setIsLoading(true);
      const response = await getWebpageVersionsReq(webpage.id);

      console.log("Versions API response:", response); // Debug log

      if (response.ok && Array.isArray(response.versions)) {
        // Transform API response to our expected format
        const transformedVersions: Version[] = response.versions.map(
          (apiVersion: ApiVersion, index: number) => {
            // Use the index to create a version number (newest first)
            const versionNumber = response.versions.length - index;

            // Check if this version is live - look for Status: true in the version object
            const isLive = apiVersion.version.Status === true;

            // console.log(`Version ${versionNumber}:`, {
            //   id: apiVersion.id,
            //   status: apiVersion.version.Status,
            //   isLive: isLive,
            //   name: apiVersion.version.name,
            // }); // Debug log

            return {
              id: apiVersion.id,
              versionNumber: versionNumber,
              title: apiVersion.version.name,
              content: apiVersion.version.contents,
              createdAt: apiVersion.createdAt,
              updatedAt: apiVersion.updatedAt,
              isLive: isLive,
            };
          }
        );

        // Sort by version number (newest first)
        const sortedVersions = transformedVersions.sort(
          (a, b) => b.versionNumber - a.versionNumber
        );

        setVersions(sortedVersions);

        // Find the currently live version
        const liveVersion = sortedVersions.find(
          (v: Version) => v.isLive === true
        );
        setCurrentLiveVersionId(liveVersion?.id || null);

        console.log(
          "All versions with live status:",
          sortedVersions.map((v) => ({
            id: v.id,
            version: v.versionNumber,
            isLive: v.isLive,
          }))
        ); // Debug log
        console.log("Live version ID:", liveVersion?.id); // Debug log
      } else {
        console.error(
          "Failed to fetch versions or invalid response format:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = async (versionId: string, versionNumber: number) => {
    if (!webpage?.id) return;

    try {
      setIsRollingBack(versionId);

      // Optimistically update the UI first
      setVersions((prevVersions) =>
        prevVersions.map((version) => ({
          ...version,
          isLive: version.id === versionId,
        }))
      );
      setCurrentLiveVersionId(versionId);

      const response = await rollbackWebpageVersionReq(webpage.id, versionId);

      console.log("Rollback response:", response); // Debug log

      if (response.ok) {
        // Refetch to confirm the change with the server
        await fetchVersions();

        // Show success message
        // alert(`Successfully rolled back to version ${versionNumber}!`);

        // Refresh the parent component data
        onRollbackSuccess();
      } else {
        console.error("Rollback failed:", response.error);
        alert("Rollback failed: " + (response.error || "Unknown error"));

        // If rollback failed, refetch to get the correct state from server
        await fetchVersions();
      }
    } catch (error) {
      console.error("Error during rollback:", error);
      alert("An error occurred during rollback");

      // If there was an error, refetch to get the correct state from server
      await fetchVersions();
    } finally {
      setIsRollingBack(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVersionBadge = (version: Version) => {
    if (version.id === currentLiveVersionId) {
      return (
        <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          <span>Currently Live</span>
        </div>
      );
    }

    return null;
  };

  const getCurrentLiveVersion = () => {
    return versions.find((v) => v.id === currentLiveVersionId);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Version History - {webpage?.title || webpage?.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {getCurrentLiveVersion() &&
                `Current live version: V${
                  getCurrentLiveVersion()?.versionNumber
                }`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[70vh]">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No version history available
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className={`border rounded-lg p-4 transition-all ${
                    version.id === currentLiveVersionId
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          version.id === currentLiveVersionId
                            ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="text-sm font-bold">
                          V{version.versionNumber}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {version.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(version.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {getVersionBadge(version)}
                  </div>

                  <div className="flex justify-end">
                    {version.id !== currentLiveVersionId && (
                      <button
                        onClick={() =>
                          handleRollback(version.id, version.versionNumber)
                        }
                        disabled={isRollingBack === version.id}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {isRollingBack === version.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Rolling back...</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-4 h-4" />
                            <span>Rollback to V{version.versionNumber}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryModal;
