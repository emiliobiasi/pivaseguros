import { useAuth } from "@/contexts/auth/useAuth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => navigate("/about")}>Go to About</button>
      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>
    </div>
  );
};

export default Home;
