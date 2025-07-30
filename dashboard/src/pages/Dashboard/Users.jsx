import React from 'react';
import TableComp from './component/TableComp';

const Users = () => {
  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          {/* Avatar placeholder — replace with actual image if needed */}
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

  const data = [
    {
      user: { name: 'Anukool', email: 'anukool@example.com', profile: null },
      status: 'Active'
    },
    {
      user: { name: 'Ravi', email: 'ravi@example.com', profile: null },
      status: 'Inactive'
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
        <button className="theme-gradient text-[14px] px-[24px] py-[12px] rounded-3xl self-center">
          Add User
        </button>
      </div>

      <TableComp columns={columns} data={data} title="Users" />
    </div>
  );
};

export default Users;
