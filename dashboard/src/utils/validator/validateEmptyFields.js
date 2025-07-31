function validateEmpty(formObj, toast) {
  const { name, email, phone, role } = formObj;

  if (!name.trim()) {
    toast.error("Name is required");
    return false;
  }
  if (!email.trim()) {
    toast.error("Email is required");
    return false;
  }
  if (!phone.trim()) {
    toast.error("Phone is required");
    return false;
  }
  if (!role) {
    toast.error("Role is required");
    return false;
  }

  return true; // ✅ success
}

export { validateEmpty };
