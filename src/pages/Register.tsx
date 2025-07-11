
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the unified auth page
    navigate("/login");
  }, [navigate]);

  return null;
};

export default Register;
