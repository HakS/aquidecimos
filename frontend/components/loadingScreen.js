import styled from "styled-components";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const Screen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  height: 100vh;
  width: 100%;
  opacity: 0;
  animation: fade 0.4s ease-in forwards;
  background: white;

  @keyframes fade {
    0% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Balls = styled.div`
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .ball {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #cbd5e1;
    margin: 0 6px 0 0;
    animation: oscillate 0.6s ease-in forwards infinite;
  }

  .one {
    animation-delay: 0.125s;
  }
  .two {
    animation-delay: 0.25s;
  }
  .three {
    animation-delay: 0.5s;
  }

  @keyframes oscillate {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(20px);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

const LoadingScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleStart = (url) => (url !== router.asPath) && setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })

  return (
    <>
      {loading && (
        <Screen>
          <Balls>
            <div className="ball one"></div>
            <div className="ball two"></div>
            <div className="ball three"></div>
          </Balls>
        </Screen>
      )}
    </>
  )
};

export default LoadingScreen;