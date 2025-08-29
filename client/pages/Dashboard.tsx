import React from "react";
import AppHeader from "@/components/arcon/AppHeader";
import Toolbar from "@/components/arcon/Toolbar";
import DataTable, { Column } from "@/components/arcon/DataTable";
import EditProfileDialog from "@/components/arcon/EditProfileDialog";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

const mockUsers: User[] = Array.from({ length: 28 }).map((_, i) => ({
  id: i + 1,
  firstName: i % 3 === 0 ? "Alex" : i % 3 === 1 ? "Sam" : "Jordan",
  lastName: i % 2 === 0 ? "Taylor" : "Morgan",
  email: `user${i + 1}@example.com`,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

const columns: Column<User>[] = [
  { key: "id", header: "ID", className: "w-[80px]" },
  { key: "firstName", header: "First Name" },
  { key: "lastName", header: "Last Name" },
  { key: "email", header: "Email" },
  {
    key: "createdAt",
    header: "Created At",
    render: (row) => new Date(row.createdAt).toLocaleString(),
  },
];

const Dashboard: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({ firstName: "Alex", lastName: "Taylor" });

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return mockUsers;
    return mockUsers.filter((u) =>
      [u.id.toString(), u.firstName, u.lastName, u.email].some((v) => v.toLowerCase().includes(q)),
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-white">
      <AppHeader onSearchChange={setSearch} onAddNew={() => {}} onFilter={() => {}} />
      <main className="mx-auto max-w-[1200px] px-6 py-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-arcon-gray-heading font-roboto">Dashboard</h1>
            <p className="text-sm text-arcon-gray-secondary font-roboto mt-1">All Users</p>
          </div>
          <Button
            variant="outline"
            className="h-10 rounded-control border-arcon-gray-border text-arcon-gray-primary"
            onClick={() => setOpen(true)}
          >
            Edit Profile
          </Button>
        </div>

        <div className="mb-4">
          <Toolbar onSearchChange={setSearch} onAddNew={() => {}} onFilter={() => {}} />
        </div>

        <DataTable<User>
          columns={columns}
          data={filtered}
          loading={false}
          emptyMessage="No users found. Add a new user to get started."
        />
      </main>

      <EditProfileDialog
        open={open}
        onOpenChange={setOpen}
        firstName={profile.firstName}
        lastName={profile.lastName}
        onSave={(data) => setProfile(data)}
      />
    </div>
  );
};

export default Dashboard;
