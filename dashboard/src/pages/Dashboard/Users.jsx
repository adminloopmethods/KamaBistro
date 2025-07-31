import React, { useEffect, useState } from 'react';
import TableComp from './component/TableComp';
import UserFormDialog from './component/UserFormDialog';
import { getUsersReq } from '../../app/fetch';
import { Toaster } from 'sonner';
import { SquarePen } from 'lucide-react';
import { Switch } from '@headlessui/react';

const usersModel = {
  id: '',
  name: '',
  email: '',
  phone: '',
  role: '',
  status: '',
}

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [refresh, setRefresh] = useState(0)

  const [users, setUsers] = useState([usersModel]);


  const handleAddClick = () => {
    setEditUser(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setIsDialogOpen(true);
  };



  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await getUsersReq();
        const users = response.users.map((e) => ({
          id: e.id,
          name: e.name,
          email: e.email,
          phone: e.phone || '',
          role: e.role || 'USER',
          status: e.status ? 'Active' : 'Inactive',
        }));
        setUsers(users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
    fetchUsers();
  }, [refresh]);

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
            {row.name[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 dark:text-white font-medium">
              {row.name}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {row.email}
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

  const actions = (user) => {
    return (
      <div className="flex items-center gap-4">
        {/* Edit button */}
        <button
          title="Edit user"
          onClick={() => handleEditClick(user)}
          className="text-gray-600 hover:text-blue-600"
        >
          <SquarePen size={18} />
        </button>

        {/* Status toggle switch */}
        <div className="flex items-center space-x-4 ">
          <Switch
            checked={user?.status === "Active"}
            onChange={() => {
            }}
            className={`${user?.status === "Active"
              ? "theme-gradient"
              : "bg-gray-300"
              } relative inline-flex h-[6px] w-6 items-center rounded-full`}
          >
            <span
              className={`${user?.status === "Active"
                ? "translate-x-4"
                : "translate-x-0"
                } inline-block h-4 w-4 bg-white rounded-full shadow-2xl border border-gray-300 transition`}
            />
          </Switch>
        </div>
      </div>
    );
  };


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
          className="theme-gradient text-[14px] px-[24px] py-[12px] rounded-3xl self-center text-[white]"
        >
          Add User
        </button>
      </div>

      <TableComp columns={columns} data={users} title="Users" action={true} actions={actions} />

      <UserFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        setUserObject={setEditUser}
        initialData={editUser}
        refresh={() => setRefresh(Math.random)}
      />
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Users;
