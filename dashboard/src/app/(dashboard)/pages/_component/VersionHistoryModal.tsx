// components/VersionHistoryModal.tsx
"use client";
import React, {useState, useEffect} from "react";
import {X, Clock, RotateCcw, User, Calendar, CheckCircle} from "lucide-react";
import {
  getWebpageVersionsReq,
  rollbackWebpageVersionReq,
} from "@/functionality/fetch";

interface Version {
  id: string;
  createdAt: string;
  version: {
    name: string;
    updatedAt: string;
    editor?: {
      name: string;
      email: string;
    };
  };
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  webpageId: string;
  webpageName: string;
  currentWebpageData?: any; // Add current webpage data to identify live version
  onRollback: () => void;
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  webpageId,
  webpageName,
  currentWebpageData,
  onRollback,
}) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && webpageId) {
      fetchVersions();
    }
  }, [isOpen, webpageId]);

  // Determine which version is currently live based on updatedAt timestamp
  const findCurrentVersionId = (versions: Version[], currentData: any) => {
    if (!currentData || !versions.length) return null;

    // Create a fingerprint of the current content
    const createContentFingerprint = (content: any) => {
      const simplifyContent = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(simplifyContent).filter(Boolean);
        } else if (obj && typeof obj === "object") {
          const simple: any = {};
          // Only include content-related fields, ignore metadata and timestamps
          const includeFields = [
            "name",
            "content",
            "givenName",
            "href",
            "aria",
            "children",
            "elements",
          ];
          includeFields.forEach((field) => {
            if (obj[field] !== undefined) {
              simple[field] = simplifyContent(obj[field]);
            }
          });
          return Object.keys(simple).length ? simple : null;
        }
        return obj;
      };

      return JSON.stringify(simplifyContent(content));
    };

    const currentFingerprint = createContentFingerprint(currentData.contents);

    // Find the version with matching content
    for (const version of versions) {
      const versionFingerprint = createContentFingerprint(
        version.version.contents
      );
      if (versionFingerprint === currentFingerprint) {
        return version.id;
      }
    }

    return null;
  };

  const fetchVersions = async () => {
    try {
      setIsLoading(true);
      const response = await getWebpageVersionsReq(webpageId);

      if (response.ok && response.versions) {
        const sortedVersions = response.versions.sort(
          (a: Version, b: Version) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setVersions(sortedVersions);

        // Determine which version is currently live
        const liveVersionId = findCurrentVersionId(
          sortedVersions,
          currentWebpageData
        );
        setCurrentVersionId(liveVersionId);
      }
    } catch (error) {
      console.error("Failed to fetch versions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = async (versionId: string) => {
    try {
      setIsRollingBack(versionId);
      const response = await rollbackWebpageVersionReq(webpageId, versionId);

      if (response.ok) {
        // Update the current version to the one we rolled back to
        setCurrentVersionId(versionId);

        // Refresh the versions list to get any updates
        await fetchVersions();

        // Notify parent component to refresh the main webpage data
        onRollback();

        // Show success message
        alert(
          "Webpage rolled back successfully! The page will now reflect this version."
        );
      } else {
        alert("Failed to rollback: " + response.error);
      }
    } catch (error) {
      console.error("Rollback error:", error);
      alert("Failed to rollback webpage");
    } finally {
      setIsRollingBack(null);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if a version is the current live version
  const isCurrentVersion = (versionId: string) => {
    return versionId === currentVersionId;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Version History
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {webpageName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No version history found
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => {
                const isLive = isCurrentVersion(version.id);
                const isOldest = index === versions.length - 1;

                return (
                  <div
                    key={version.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      isLive
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                            isLive
                              ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                              : "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300"
                          }`}
                        >
                          {versions.length - index}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Version {versions.length - index}
                          {isLive && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Live
                            </span>
                          )}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRollback(version.id)}
                        disabled={isRollingBack === version.id || isLive}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          isLive
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800"
                        }`}
                      >
                        {isRollingBack === version.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-amber-600"></div>
                            <span>Rolling back...</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3 h-3" />
                            <span>Rollback to this version</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(version.createdAt)}</span>
                        {isOldest && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            Original
                          </span>
                        )}
                      </div>

                      {version.version.editor && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{version.version.editor.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                      Webpage: {version.version.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {versions.length} versions found •{" "}
              {currentVersionId
                ? "Live version highlighted"
                : "Unable to detect live version"}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryModal;
