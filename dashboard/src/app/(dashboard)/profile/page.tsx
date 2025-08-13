"use client";
import React, {useState, useRef} from "react";
import Image from "next/image";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: string;
  joinedDate: string;
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({
    id: "usr_12345",
    name: "Deepanshu R. Kataria",
    email: "dkataria576@example.com",
    phone: "+91 8307690758",
    avatarUrl: "/default-avatar.jpg",
    role: "Editor",
    joinedDate: "2025-08-15",
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setUser((prev) => ({...prev, [name]: value}));
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", user);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setUser((prev) => ({
            ...prev,
            // avatarUrl: event.target.result as string ,
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen dark:bg-gray-800 ">
      <div className=" mx-auto">
        <div className="text-center mb-10 mt-5">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 h-48">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt="Avatar"
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-4xl font-bold text-gray-400">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-3 right-3 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-800 dark:text-gray-300"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-24 pb-10 px-8">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-lg">
                {/* Name Field */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Email Field (non-editable) */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-gray-900 dark:text-white">
                        {user.phone}
                      </p>
                    </div>
                  )}
                </div>

                {/* Role and Join Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Role
                    </label>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-gray-900 dark:text-white">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Member Since
                    </label>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(user.joinedDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition"
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
