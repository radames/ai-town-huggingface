import { useState, useEffect } from 'react';
import Button from './Button';
import hf from '../../../assets/hf.svg';
import { oauthLoginUrl, oauthHandleRedirectIfPresent } from '@huggingface/hub';

const OAuthLogin = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      let oauthResult = localStorage.getItem('oauth');
      if (oauthResult) {
        try {
          oauthResult = JSON.parse(oauthResult);
        } catch {
          oauthResult = null;
        }
      }

      if (!oauthResult) {
        oauthResult = await oauthHandleRedirectIfPresent();
        if (oauthResult) {
          localStorage.setItem('oauth', JSON.stringify(oauthResult));
        }
      }

      setIsSignedIn(!!oauthResult);
    };

    checkAuthStatus();
  }, []);

  const handleSignIn = async () => {
    let clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
    window.location.href = await oauthLoginUrl({ clientId });
  };

  const handleSignOut = () => {
    localStorage.removeItem('oauth');
    window.location.href = window.location.href.replace(/\?.*$/, '');
    setIsSignedIn(false);
  };

  return (
    <>
      {isSignedIn ? (
          <Button id="signout" imgUrl={hf} onClick={handleSignOut}>Sign out</Button>
      ) : (
        <Button id="signin" imgUrl={hf} onClick={handleSignIn}>
          Sign in with Hugging Face
        </Button>
      )}
      </>
  );
};

export default OAuthLogin;