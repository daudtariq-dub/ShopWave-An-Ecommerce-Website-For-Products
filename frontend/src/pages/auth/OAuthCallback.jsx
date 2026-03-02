import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../api/auth.api';
import Loader from '../../components/ui/Loader';

/**
 * Handles the OAuth redirect callback (for code-exchange flows).
 * Google One Tap uses a callback instead — this handles redirect-based OAuth.
 */
export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const returnTo = searchParams.get('state') ?? '/';

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (!code) {
      navigate('/login', { replace: true });
      return;
    }

    authApi.googleLogin(code)
      .then((data) => {
        login(data.token, data.user);
        navigate(returnTo, { replace: true });
      })
      .catch(() => {
        navigate('/login?error=oauth_failed', { replace: true });
      });
  }, []); // eslint-disable-line

  return <Loader fullScreen text="Completing sign in..." />;
}
