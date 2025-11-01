import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Form from '../components/Form';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = (accessToken, refreshToken) => {
    login(accessToken, refreshToken);
    navigate('/');
  };

  return <Form route="/api/token/" method="login" onSuccess={handleSuccess} />;
}

export default Login;