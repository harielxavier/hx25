import LandingPage from '../pages/LandingPage';

export default {
  path: '/',
  children: [
    {
      index: true,
      element: <LandingPage />
    }
  ]
};
