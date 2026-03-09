import { Routes, Route, Navigate } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from '@clerk/clerk-react';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import OnboardingPage from './pages/auth/OnboardingPage';
import IntakeFormPage from './pages/intake/IntakeFormPage';
import HomePage from './pages/home/HomePage';
import ScanHomePage from './pages/scan/ScanHomePage';
import ScanTutorialPage from './pages/scan/ScanTutorialPage';
import ScanCapturePage from './pages/scan/ScanCapturePage';
import ScanProcessingPage from './pages/scan/ScanProcessingPage';
import ScanResultsPage from './pages/scan/ScanResultsPage';
import GaitAnalysisPage from './pages/scan/GaitAnalysisPage';
import DesignListPage from './pages/orthotic/DesignListPage';
import OrthoticBuilderPage from './pages/orthotic/OrthoticBuilderPage';
import DesignDetailPage from './pages/orthotic/DesignDetailPage';
import OrderListPage from './pages/orders/OrderListPage';
import CheckoutPage from './pages/orders/CheckoutPage';
import OrderConfirmationPage from './pages/orders/OrderConfirmationPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/profile/SettingsPage';
import ShoeCollectionPage from './pages/profile/ShoeCollectionPage';
import SubscriptionPage from './pages/subscription/SubscriptionPage';

export default function App() {
  return (
    <ToastProvider>
      <SignedOut>
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route
            path="/sign-in/*"
            element={
              <div className="app-shell">
                <div className="safe-top" />
                <div className="page-scroll flex items-center justify-center p-6 bg-gray-50">
                  <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
                </div>
                <div className="safe-bottom" />
              </div>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <div className="app-shell">
                <div className="safe-top" />
                <div className="page-scroll flex items-center justify-center p-6 bg-gray-50">
                  <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
                </div>
                <div className="safe-bottom" />
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SignedOut>

      <SignedIn>
        <Routes>
          <Route path="/intake" element={<IntakeFormPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanHomePage />} />
            <Route path="/scan/tutorial" element={<ScanTutorialPage />} />
            <Route path="/scan/capture" element={<ScanCapturePage />} />
            <Route path="/scan/processing/:scanId" element={<ScanProcessingPage />} />
            <Route path="/scan/results/:scanId" element={<ScanResultsPage />} />
            <Route path="/scan/gait/:scanId" element={<GaitAnalysisPage />} />
            <Route path="/designs" element={<DesignListPage />} />
            <Route path="/designs/builder" element={<OrthoticBuilderPage />} />
            <Route path="/designs/:orthoticId" element={<DesignDetailPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/orders/checkout" element={<CheckoutPage />} />
            <Route path="/orders/confirmation" element={<OrderConfirmationPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/settings" element={<SettingsPage />} />
            <Route path="/profile/shoes" element={<ShoeCollectionPage />} />
            <Route path="/profile/subscription" element={<SubscriptionPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SignedIn>
    </ToastProvider>
  );
}
