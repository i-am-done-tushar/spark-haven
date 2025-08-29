import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface Profile {
  firstName: string;
  lastName: string;
  email?: string;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [profile, setProfile] = useState<Profile>({
    firstName: "",
    lastName: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>("");

  const navigate = useNavigate();

  const token = useMemo(() => localStorage.getItem("access"), []);

  const loadUsers = async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5294/api/User", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data?.data ?? []);
        setUsers(list);
      } else if (response.status === 401) {
        setError("Unauthorized. Token may be invalid or expired.");
      } else {
        setError("Failed to fetch users.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const loadProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5294/api/User/profile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const body = await res.json();
        const p = body?.data ?? body;
        setProfile({
          firstName: p.firstName ?? "",
          lastName: p.lastName ?? "",
          email: p.email,
        });
      }
    } catch {
      // ignore, keep defaults
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const run = async () => {
      setLoading(true);
      setError("");
      await Promise.all([loadUsers(), loadProfile()]);
      setLoading(false);
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "User";

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("http://localhost:5294/api/User/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
        }),
      });
      if (res.ok) {
        setIsDialogOpen(false);
        await loadUsers();
      } else {
        let message = "Failed to update profile";
        try {
          const err = await res.json();
          message = err?.message || message;
        } catch {}
        setSaveError(message);
      }
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 font-roboto">Loading users...</p>;
  if (error) return <p className="p-6 text-red-600 font-roboto">{error}</p>;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="w-full border-b border-arcon-gray-border bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
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
          <div className="flex items-center gap-3">
            <span className="text-arcon-gray-primary font-roboto">
              {fullName}
            </span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="bg-arcon-blue text-white hover:bg-arcon-blue/90"
                >
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-roboto">
                    Edit profile
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveProfile} className="space-y-4 mt-2">
                  <div>
                    <label className="block text-arcon-gray-primary text-sm font-medium mb-2 font-roboto">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, firstName: e.target.value }))
                      }
                      placeholder="Enter your first name"
                      className="h-12 border-arcon-gray-border"
                    />
                  </div>
                  <div>
                    <label className="block text-arcon-gray-primary text-sm font-medium mb-2 font-roboto">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, lastName: e.target.value }))
                      }
                      placeholder="Enter your last name"
                      className="h-12 border-arcon-gray-border"
                    />
                  </div>
                  {saveError && (
                    <p className="text-red-600 text-sm font-roboto">
                      {saveError}
                    </p>
                  )}
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-arcon-blue text-white hover:bg-arcon-blue/90"
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-arcon-blue"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Users table (unchanged) */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-arcon-gray-heading text-2xl font-bold font-roboto mb-4">
          All Users
        </h1>
        <div>
          <table border={1} cellPadding={10} cellSpacing={0}>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
