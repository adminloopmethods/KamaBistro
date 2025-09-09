// components/users/EditUserModal.tsx
import React, {useState, useEffect} from "react";
import {getLocationsReq, updateUserReq} from "@/functionality/fetch";
import {toast, Toaster} from "sonner";

interface Location {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  locationId: string;
  location: Location;
}

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

interface FormErrors {
  name?: string;
  phone?: string;
  password?: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onUserUpdated,
}) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [locationId, setLocationId] = useState<string | null>(user.locationId);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name);
      setPhone(user.phone);
      setLocationId(user.locationId);
      setPassword("");
      setErrors({});
    }
  }, [user, isOpen]);

  // Fetch locations when modal opens
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocationsReq();

        if (response.ok && response.location) {
          setLocations(response.location);
        } else {
          console.error("Failed to fetch locations:", response.error);
          toast.error("Failed to load locations");
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        toast.error("An error occurred while loading locations");
      }
    };

    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen]);

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      // Remove any non-digit characters for validation
      const cleanedPhone = phone.replace(/\D/g, "");
      if (cleanedPhone.length < 10) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    // Password validation (only if provided)
    if (password) {
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])/.test(password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter";
      } else if (!/(?=.*[A-Z])/.test(password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter";
      } else if (!/(?=.*\d)/.test(password)) {
        newErrors.password = "Password must contain at least one number";
      } else if (!/(?=.*[@$!%*?&])/.test(password)) {
        newErrors.password =
          "Password must contain at least one special character (@$!%*?&)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate individual field on blur
  const validateField = (fieldName: keyof FormErrors, value: string) => {
    const newErrors = {...errors};

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required";
        } else if (value.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Phone number is required";
        } else {
          const cleanedPhone = value.replace(/\D/g, "");
          if (cleanedPhone.length < 10) {
            newErrors.phone = "Please enter a valid phone number";
          } else {
            delete newErrors.phone;
          }
        }
        break;

      case "password":
        if (value) {
          if (value.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
          } else if (!/(?=.*[a-z])/.test(value)) {
            newErrors.password =
              "Password must contain at least one lowercase letter";
          } else if (!/(?=.*[A-Z])/.test(value)) {
            newErrors.password =
              "Password must contain at least one uppercase letter";
          } else if (!/(?=.*\d)/.test(value)) {
            newErrors.password = "Password must contain at least one number";
          } else if (!/(?=.*[@$!%*?&])/.test(value)) {
            newErrors.password =
              "Password must contain at least one special character (@$!%*?&)";
          } else {
            delete newErrors.password;
          }
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");

    // Format based on length
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
        10
      )}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    setIsLoading(true);

    // Clean phone number for storage (remove non-digits)
    const cleanedPhone = phone.replace(/\D/g, "");

    const updateData = {
      name,
      phone: cleanedPhone,
      locationId: locationId || null,
      ...(password ? {password} : {}),
    };

    try {
      const response = await updateUserReq(user.id, updateData);

      if (response.ok) {
        toast.success("User updated successfully!");
        onUserUpdated();
        onClose();
      } else {
        const errorMessage =
          response.error || response.message || "Failed to update user";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating the user");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white shadow dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">Edit User</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                onBlur={() => validateField("name", name)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 text-gray-400 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 dark:text-white cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                onBlur={() => validateField("phone", phone)}
                placeholder="(123) 456-7890"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white ${
                  errors.phone
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <select
                value={locationId || ""}
                onChange={(e) => setLocationId(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">No location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password (optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validateField("password", password)}
                placeholder="Leave blank to keep current"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              {password && !errors.password && (
                <p className="mt-1 text-sm text-green-500">
                  Password meets requirements
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUserModal;
