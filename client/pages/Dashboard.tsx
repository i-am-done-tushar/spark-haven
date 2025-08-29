import { useEffect, useState } from "react";
 
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}
 
const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
 
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("access"); // get token from localStorage
      if (!token) {
        setError("No access token found. Please login.");
        setLoading(false);
        return;
      }
 
      try {
        const response = await fetch("http://localhost:5294/api/User", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`, // attach token here
          },
        });
 
        if (response.ok) {
          const data = await response.json();
          // If your API wraps users in "data" field, use: setUsers(data.data)
          setUsers(data.data);
        } else if (response.status === 401) {
          setError("Unauthorized. Token may be invalid or expired.");
        } else {
          setError("Failed to fetch users.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchUsers();
  }, []);
 
  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;
 
  return (
<div>
<h1>All Users</h1>
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
  );
};
 
export default Dashboard;