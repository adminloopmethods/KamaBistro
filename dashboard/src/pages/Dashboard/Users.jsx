import React, { useEffect, useState } from 'react';
import TableComp from './component/TableComp';
import UserFormDialog from './component/UserFormDialog';
import { getUsersReq, switchStatusReq } from '../../app/fetch';
import { Toaster } from 'sonner';
import { SquarePen, Trash2 } from 'lucide-react';
import { Switch } from '@headlessui/react';
import { toastWithUpdate } from '../../Functionality/toastWithUpdate';
import DeleteUserDialog from './component/DeleteUserDialog';
import { toTitleCase } from '../../app/stringOperation';
import SearchAndFilter from './component/SearchAndFilter';

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [refresh, setRefresh] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([usersModel]);


  const handleAddClick = () => {
    setEditUser(null);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setIsDialogOpen(true);
  };

  const handleUserDelete = (id) => {
    console.log(id)
  }

  const changeStatus = async (id) => {

    try {
      const response = await toastWithUpdate(() => switchStatusReq(id), {
        loading: "Updating user...",
        success: () =>
          "Status changed successfully!",
        error: (err) => err?.message || "Failed to create/update user.",
      })
      setRefresh(Math.random)
    } catch (err) {

    }
  }


  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await getUsersReq();
        const users = response.users.map((e) => ({
          id: e.id,
          name: e.name,
          email: e.email,
          phone: e.phone || '',
          role: e.role || 'EDITOR',
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
      key: 'role',
      header: 'Role',
      width: '100px',
      render: (value) => (
        <span>
          {toTitleCase(value)}
        </span>
      )
    }
    ,
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (value) => (
        <span className={value === 'Active' ? 'text-green-600' : 'text-red-600'}>
          {value}
        </span>
      )
    }
  ];

  const actions = (user) => {
    return (
      <div className="flex items-center gap-4 w-[fit-content]">
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
              changeStatus(user.id)
            }}
            className={`${user?.status === "Active"
              ? "theme-gradient"
              : "bg-gray-300"
              } relative inline-flex h-[6px] w-[26px] items-center rounded-full`}
          >
            <span
              className={`${user?.status === "Active"
                ? "translate-x-3"
                : "translate-x-0"
                } inline-block h-4 w-4 bg-white rounded-full shadow-2xl border border-gray-300 transition`}
            />
          </Switch>
        </div>
        <button
          title="Delete user"
          onClick={() => handleDeleteClick(user)}
          className="text-gray-600 hover:text-blue-600"
        >
          <Trash2 size={18} />
        </button>
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

      <SearchAndFilter />

      <TableComp columns={columns} data={users} title="Users" action={true} actions={actions} />

      <DeleteUserDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        user={selectedUser}
        onConfirm={handleUserDelete}
      />

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
