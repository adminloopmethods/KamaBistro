import React, { useState } from 'react';
import TableComp from './component/TableComp';
import UserFormDialog from './component/UserFormDialog';

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [users, setUsers] = useState([
    {
      user: { name: 'Anukool', email: 'anukool@example.com', phone: '', role: 'USER' },
      status: 'Active'
    },
    {
      user: { name: 'Ravi', email: 'ravi@example.com', phone: '', role: 'ADMIN' },
      status: 'Inactive'
    }
  ]);

  const handleAddClick = () => {
    setEditUser(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (editUser) {
      // update logic
      setUsers((prev) =>
        prev.map((item) =>
          item.user.email === editUser.email
            ? { ...item, user: { ...item.user, ...formData } }
            : item
        )
      );
    } else {
      // create logic
      setUsers((prev) => [...prev, { user: formData, status: 'Active' }]);
    }
  };

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (_, row) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleEditClick(row.user)}>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
            {row.user.name[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 dark:text-white font-medium">
              {row.user.name}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {row.user.email}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={value === 'Active' ? 'text-green-600' : 'text-red-600'}>
          {value}
        </span>
      )
    }
  ];

  return (
    <div>
      <div className="mb-5 flex justify-between">
        <div>
          <h1 className="text-[30px] text-[#080217] dark:text-zinc-200 font-[600]">
            Users Management
          </h1>
          <p className="text-[16px] text-[#64748B] dark:text-stone-300 font-[400]">
            Manage user accounts and permissions
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="theme-gradient text-[14px] px-[24px] py-[12px] rounded-3xl self-center"
        >
          Add User
        </button>
      </div>

      <TableComp columns={columns} data={users} title="Users" />

      <UserFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editUser}
      />
    </div>
  );
};

export default Users;
