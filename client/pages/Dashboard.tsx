import { useEffect, useMemo, useState } from "react";
import React from "react";
import AppHeader from "@/components/arcon/AppHeader";
import Toolbar from "@/components/arcon/Toolbar";
import DataTable, { Column } from "@/components/arcon/DataTable";
import EditProfileDialog from "@/components/arcon/EditProfileDialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RowItem {
  name: string;
  invites: string[]; // e.g. ["OP","YS"]
  createdDate: string; // ISO or dd-mm-yyyy
  createdBy: string;
  status: "Completed" | "In Progress";
  lastUpdated: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

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
  const [profile, setProfile] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const navigate = useNavigate();
  const { fullName, profile, updateProfile, logout } = useUser();

  // Prefetch table data (kept compatible with any existing storage the app may already be using)
  const [rows, setRows] = useState<RowItem[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("users");
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const mapped: RowItem[] = list.map((u: any, i: number) => ({
            name: `${u.firstName ?? "User"} ${u.lastName ?? i}`.trim(),
            invites: ["OP", "YS", "AS"].slice(0, Math.max(1, (i % 3) + 1)),
            createdDate:
              u.createdDate ?? new Date().toLocaleDateString("en-GB"),
            createdBy:
              `${u.firstName ?? "Team"} ${u.lastName ?? "Member"}`.trim(),
            status: i % 2 === 0 ? "Completed" : "In Progress",
            lastUpdated: u.updatedAt ?? new Date().toLocaleDateString("en-GB"),
          }));
          setRows(mapped);
          return;
        }
      }
    } catch {}

    // Fallback demo data (non-blocking)
    setRows([
      {
        name: "Template Name",
        invites: ["OP", "YS", "+6"],
        createdDate: "14-07-2024",
        createdBy: "Patricia A. Ramirez",
        status: "Completed",
        lastUpdated: "14-07-2024",
      },
      {
        name: "New Template",
        invites: ["OP", "YS"],
        createdDate: "22-07-2024",
        createdBy: "Deloris L. Hall",
        status: "In Progress",
        lastUpdated: "22-07-2024",
      },
    ]);
  }, []);

  // Edit profile dialog state - prefilled from prefetched profile
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (open) {
      setFirstName(profile?.firstName ?? "");
      setLastName(profile?.lastName ?? "");
    }
  }, [open, profile]);

  const handleSaveProfile = () => {
    updateProfile({ firstName, lastName });
    setOpen(false);
  };

  const initials = useMemo(() => {
    const [f = "", l = ""] = (fullName || "").split(" ");
    return (f[0] ?? "G").toUpperCase() + (l[0] ?? "").toUpperCase();
  }, [fullName]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      {/* Top navbar */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Left: logo */}
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
                <path
                  d="M27.3723 22.6039C27.9964 23.7209 27.189 25.097 25.9095 25.097H4.88702C3.6005 25.097 2.79387 23.7073 3.43201 22.5902L14.0587 3.98729C14.7055 2.85516 16.3405 2.86285 16.9765 4.00102L27.3723 22.6039Z"
                  stroke="#D83A52"
                  strokeWidth="2.5"
                  fill="none"
                />
              </svg>
              <span className="text-arcon-gray-primary text-xl font-bold font-roboto">
                arcon
              </span>
            </div>

            {/* Right: user */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-arcon-blue/90 text-white flex items-center justify-center text-xs font-semibold">
                  {initials}
                </div>
                <span className="text-sm text-arcon-gray-primary font-roboto">
                  {fullName}
                </span>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div>
                      <label className="block text-sm mb-1 text-arcon-gray-primary">
                        First name
                      </label>
                      <input
                        className="w-full h-10 px-3 border rounded text-sm border-arcon-gray-border focus:outline-none focus:ring-2 focus:ring-arcon-blue"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-arcon-gray-primary">
                        Last name
                      </label>
                      <input
                        className="w-full h-10 px-3 border rounded text-sm border-arcon-gray-border focus:outline-none focus:ring-2 focus:ring-arcon-blue"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
  const tokenRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    tokenRef.current = localStorage.getItem("access");
    if (!tokenRef.current) {
      navigate("/login");
      return;
    }
    const init = async () => {
      setLoading(true);
      setError("");
      await Promise.all([loadUsers(), loadProfile()]);
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:5294/api/User", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenRef.current}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setUsers(list);
    } catch (e: any) {
      setError(e?.message || "Failed to load users");
    }
  };

  const loadProfile = async () => {
    try {
      const res = await fetch("http://localhost:5294/api/User/profile", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenRef.current}`,
        },
      });
      if (!res.ok) return;
      const body = await res.json();
      const p = body?.data ?? body;
      setProfile({
        firstName: p.firstName ?? "",
        lastName: p.lastName ?? "",
        email: p.email ?? "",
      });
    } catch {
      // ignore
    }
  };

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.id.toString(), u.firstName, u.lastName, u.email].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  }, [search, users]);

  const handleSaveProfile = async (data: {
    firstName: string;
    lastName: string;
  }) => {
    const res = await fetch("http://localhost:5294/api/User/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenRef.current}`,
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: profile.email,
      }),
    });
    if (!res.ok) {
      let message = "Failed to update profile";
      try {
        const err = await res.json();
        message = err?.message || message;
      } catch {}
      throw new Error(message);
    }
    await Promise.all([loadProfile(), loadUsers()]);
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader
        onSearchChange={setSearch}
        onFilter={() => {}}
        userName={(profile.firstName + " " + profile.lastName).trim()}
      />
      <main className="mx-auto max-w-[1200px] px-6 py-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-arcon-gray-heading font-roboto">
              Dashboard
            </h1>
            <p className="text-sm text-arcon-gray-secondary font-roboto mt-1">
              All Users
            </p>
          </div>
          <Button
            variant="outline"
            className="h-10 rounded-control border-arcon-gray-border text-arcon-gray-primary"
            onClick={() => setOpen(true)}
          >
            Edit Profile
          </Button>
        </div>

      {/* Main layout: sidebar + content */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white border rounded-md p-3 space-y-2">
          {[
            "Home",
            "Templates",
            "Verification",
            "Integration",
            "Analytics",
            "Users",
          ].map((label, idx) => (
            <button
              key={label}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-roboto hover:bg-gray-50 ${idx === 1 ? "bg-arcon-blue-light/40 text-arcon-gray-primary" : "text-arcon-gray-secondary"}`}
            >
              {label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main>
          {/* Toolbar */}
          <div className="bg-white border rounded-md p-4 flex items-center justify-between">
            <h2 className="font-roboto font-semibold text-arcon-gray-heading">
              Templates
            </h2>
            <div className="flex items-center gap-2">
              <input
                placeholder="Search"
                className="h-9 w-56 px-3 border rounded text-sm border-arcon-gray-border focus:outline-none focus:ring-2 focus:ring-arcon-blue"
              />
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button
                size="sm"
                className="bg-arcon-blue text-white hover:bg-arcon-blue/90"
              >
                Add New
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 bg-white border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Name</TableHead>
                  <TableHead>Invitees</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {r.invites.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] rounded-full bg-gray-100 px-2 py-1 text-arcon-gray-primary border border-arcon-gray-border"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{r.createdDate}</TableCell>
                    <TableCell>{r.createdBy}</TableCell>
                    <TableCell>
                      {r.status === "Completed" ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                          In Progress
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{r.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="text-xs text-arcon-gray-secondary mt-6 text-center">
            Copyright © 2025 Arcon. All right reserved.
          </div>
        </main>
      </div>
        <div className="mb-4">
          <Toolbar onSearchChange={setSearch} onFilter={() => {}} />
        </div>

        {error ? (
          <div className="rounded-[12px] border border-arcon-gray-border bg-white p-6 text-sm text-red-600 font-roboto">
            {error}
          </div>
        ) : (
          <DataTable<User>
            columns={columns}
            data={filtered}
            loading={loading}
            emptyMessage="No users found. Add a new user to get started."
          />
        )}
      </main>

      <EditProfileDialog
        open={open}
        onOpenChange={setOpen}
        firstName={profile.firstName}
        lastName={profile.lastName}
        email={profile.email}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Dashboard;
