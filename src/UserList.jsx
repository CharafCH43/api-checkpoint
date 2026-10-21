import { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users",
          { signal: controller.signal },
        );

        setListOfUsers(response.data);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError("Unable to load users. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => controller.abort();
  }, []);

  const filteredUsers = listOfUsers.filter((user) =>
    user.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  if (loading) {
    return (
      <div className="status-message">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-message error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }

  return (
    <main className="users-page">
      <header className="page-header">
        <div className="brand-icon">U</div>
        <p className="eyebrow">DIRECTORY / PEOPLE</p>
        <h1>
          Discover <span>Users</span>
        </h1>
        <p className="subtitle">
          Explore the community and discover people around you.
        </p>
      </header>

      <section className="directory">
        <div className="directory-heading">
          <div>
            <h2>User Directory</h2>
            <p>Search and select a user to see more information.</p>
          </div>
          <span className="count">{filteredUsers.length} users</span>
        </div>

        <div className="search-box">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search users by name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {filteredUsers.length === 0 ? (
          <p className="empty-message">No users match your search.</p>
        ) : (
          <div className="user-grid">
            {filteredUsers.map((user) => (
              <article
                className={`user-card ${
                  selectedUser?.id === user.id ? "selected" : ""
                }`}
                key={user.id}
              >
                <button
                  className="user-card-button"
                  onClick={() =>
                    setSelectedUser(selectedUser?.id === user.id ? null : user)
                  }
                  aria-expanded={selectedUser?.id === user.id}
                >
                  <div className="avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="user-main">
                    <h3>{user.name}</h3>
                    <p className="email">{user.email}</p>
                    <p className="company">{user.company.name}</p>
                  </div>

                  <span className="expand-icon">
                    {selectedUser?.id === user.id ? "−" : "+"}
                  </span>
                </button>

                {selectedUser?.id === user.id && (
                  <div className="user-details">
                    <h4>Contact details</h4>
                    <p>
                      <strong>Address:</strong> {user.address.suite},{" "}
                      {user.address.street}, {user.address.city},{" "}
                      {user.address.zipcode}
                    </p>
                    <p>
                      <strong>Phone:</strong> {user.phone}
                    </p>
                    <p>
                      <strong>Website:</strong>{" "}
                      <a
                        href={`https://${user.website}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {user.website}
                      </a>
                    </p>
                    <p>
                      <strong>Company:</strong> {user.company.name}
                    </p>
                    <p>
                      <strong>Catchphrase:</strong> {user.company.catchPhrase}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>Built with React, Hooks, Axios & JSONPlaceholder</footer>
    </main>
  );
}

export default UserList;
