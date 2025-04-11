import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import MainPage from '../pages/MainPage';
import PrivateRoute from "./PrivateRoute"
import MainLayout from '../layouts/MainLayout';
import RoutinesPage from '../pages/RoutinesPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>}/>

        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/main" element={<MainPage />} />
          <Route path="/routines" element={<RoutinesPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}