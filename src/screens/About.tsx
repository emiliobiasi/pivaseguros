import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>About Page</h1>
      <button onClick={() => navigate("/inicio")}>Go to Home</button>
    </div>
  );
};

export default About;
