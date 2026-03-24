import { useEffect, useState } from "react";
import api from "../api/client";

export default function DashboardPage({ onLogout }) {
  const [streak, setStreak] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [streakRes, sessionsRes] = await Promise.all([
          api.get("/streak"),
          api.get("/sessions?limit=10&offset=0"),
        ]);
        setStreak(streakRes.data);
        setSessions(sessionsRes.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    onLogout();
  }

  if (loading) {
    return <div className="page-shell"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="card-grid">
        <div className="card">
          <h2>Current Streak</h2>
          <p className="metric">{streak?.currentStreak ?? 0}</p>
        </div>

        <div className="card">
          <h2>Longest Streak</h2>
          <p className="metric">{streak?.longestStreak ?? 0}</p>
        </div>
      </section>

      <section className="card">
        <h2>Recent Sessions</h2>
        {sessions.length === 0 ? (
          <p>No sessions yet.</p>
        ) : (
          <ul className="session-list">
            {sessions.map((session) => (
              <li key={session.id} className="session-item">
                <div>
                  <strong>{session.sessionDate}</strong>
                  <p>{session.notes || "No notes"}</p>
                </div>
                <span>{session.durationMin} min</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
