import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth as useAuth } from './contexts/SupabaseAuthContext';
import AnalyticsProvider from './components/AnalyticsProvider';
import GoogleAnalytics from './components/GoogleAnalytics';
import { initializeAnalytics } from './utils/analytics';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { GA_MEASUREMENT_ID } from './config/analytics';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
// TawkToChat component removed as requested

// Import client routes
// import clientRoutes from './routes/clientRoutes.tsx'; // Unused

// Page components
import { LandingPage } from './pages/LandingPage';
import GalleriesPage from './pages/GalleriesPage';
import ClientGalleryPage from './pages/ClientGalleryPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminGallery from './pages/admin/AdminGallery';
import AdminGalleryDetail from './pages/admin/AdminGalleryDetail';
import AdminVideoUpload from './pages/admin/AdminVideoUpload';
import NotFoundPage from './pages/NotFoundPage';
// import LeadPage from './pages/LeadPage'; // Unused
import FirebaseAuthDebugger from './components/admin/FirebaseAuthDebugger';
import WeddingPhotography from './pages/WeddingPhotography';
import WeddingVideoPage from './pages/WeddingVideoPage';
import BookNowPage from './pages/BookNowPage';
import AdminLayout from './components/admin/AdminLayout';
// PortfolioPage import removed as requested
import VenueLightingTool from './pages/VenueLightingTool.tsx'; // Updated import to .tsx
import ImagesPage from './pages/ImagesPage';
import GalleryManagementHub from './pages/admin/GalleryManagementHub';
import BlogManager from './pages/admin/BlogManager';
import BlogEditor from './pages/admin/BlogEditor';
import BlogCategories from './pages/admin/BlogCategories';
import BlogComments from './pages/admin/BlogComments';
import PagesManager from './pages/admin/PagesManager';
import PageEditor from './pages/admin/PageEditor';
import GeneralSettings from './pages/admin/GeneralSettings';
// import PricingPage from './pages/PricingPage'; // This will be the one we want
import InitBlog from './pages/InitBlog';
import ImageManager from './pages/admin/ImageManager';
import PortfolioCategoriesPage from './pages/admin/PortfolioCategoriesPage';
import ClientsPage from './pages/admin/ClientsPage';
import JobsPage from './pages/admin/JobsPage';
import JobDetailPage from './pages/admin/JobDetailPage';
// import AdminGalleriesPage from './pages/admin/GalleriesPage'; // Unused
import RecentActivities from './pages/admin/RecentActivities';
import UpcomingSessions from './pages/admin/UpcomingSessions';
import LeadManagement from './pages/admin/LeadManagement';
import BookingsCalendar from './pages/admin/BookingsCalendar';
import ClientCommunication from './pages/admin/ClientCommunication';
import ContractsAndForms from './pages/admin/ContractsAndForms';
import InvoicingPayments from './pages/admin/InvoicingPayments';
import PaymentsPage from './pages/admin/PaymentsPage';
import LandingEditor from './pages/admin/LandingEditor';
import EmailCampaigns from './pages/admin/EmailCampaigns';
import LeadGeneration from './pages/admin/LeadGeneration';
import SocialMedia from './pages/admin/SocialMedia';
import SeoTools from './pages/admin/SeoTools';
import Branding from './pages/admin/Branding';
import Integrations from './pages/admin/Integrations';
import BusinessSettings from './pages/admin/BusinessSettings';
import WeddingSliderSettings from './pages/admin/WeddingSliderSettings';
import GalleryManager from './pages/admin/GalleryManager';
import JackieChrisGalleryPage from './pages/JackieChrisGalleryPage';
import AnsimonMinaGalleryPage from './pages/AnsimonMinaGalleryPage';
import BiancaJeffreyGalleryPage from './pages/BiancaJeffreyGalleryPage';
import AnaJoseGalleryPage from './pages/AnaJoseGalleryPage';
import UniversalMediaManager from './pages/admin/UniversalMediaManager';
import ClientGalleryViewPage from './pages/ClientGalleryViewPage';
import ViewGalleryPage from './pages/admin/ViewGalleryPage';
import PicatinnyClubPage from './pages/PicatinnyClubPage';
import WeddingTimelineToolPage from './pages/WeddingTimelineToolPage';
import { default as WeddingToolsPage } from './pages/WeddingToolsPage';
import LeadAnalyticsPage from './pages/admin/LeadAnalyticsPage';
import MultiPhotographerCoordinationToolPage from './pages/MultiPhotographerCoordinationToolPage'; // Import the multi-photographer tool page
import BlogPostOptimizer from './scripts/optimize-all-blog-posts';
import ShowcasePage from './pages/ShowcasePage'; // Import the new Showcase page
import CrystaDavidGalleryPage from './pages/CrystaDavidGalleryPage'; // Import the Crysta & David gallery page
import KarniZilvinasGalleryPage from './pages/KarniZilvinasGalleryPage'; // Import the Karni & Zilvinas gallery page
import JudyMikeGalleryPage from './pages/JudyMikeGalleryPage'; // Import the Judy & Mike gallery page
// import EmergencyLandingPage from './pages/EmergencyLandingPage'; // Import the emergency landing page // Unused
import AmandaAlexGalleryPage from './pages/AmandaAlexGalleryPage'; // Import the Amanda & Alex gallery page
import BookingPage from './pages/BookingPage'; // Import the new BookingPage
import ContactPage from './pages/ContactPage'; // Import the ContactPage component
import SuperDealLandingPage from './pages/SuperDealLandingPage'; // Import the Super Deal page
// import AIPricingPage from './pages/AIPricingPage'; // This will be replaced
import PricingPage from './pages/PricingPage'; // CORRECT IMPORT for the main pricing page
import MissionControlPage from './pages/admin/MissionControlPage'; // Import the Mission Control analytics page
import AuthCallback from './pages/AuthCallback'; // Magic link callback
import NewAdminDashboard from './pages/admin/NewAdminDashboard'; // NEW: Beautiful analytics dashboard
import VisitorTracker from './components/VisitorTracker'; // NEW: Automatic visitor tracking
import HowItsGoingPage from './pages/HowItsGoingPage'; // NEW: How It's Going feature
import HowItsGoingSubmit from './pages/HowItsGoingSubmit'; // NEW: Submit form

// Auth routing component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login with a message
  if (!user) {
    console.log('User not authenticated, redirecting to login');
    // Pass a message to the login page
    return <Navigate to="/admin/login" state={{ 
      from: location,
      message: "You need to be logged in to access the admin area."
    }} replace />;
  }

  // Check if the user has admin privileges (you can add more checks here if needed)
  return <>{children}</>;
};

const App: React.FC = () => {
  // Initialize analytics
  useEffect(() => {
    const init = async () => {
      try {
        await initializeAnalytics();
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
      }
    };
    
    init();
  }, []);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('App-level error caught by ErrorBoundary:', error, errorInfo);
        // You could send this to an error reporting service
      }}
    >
      <Router>
        <ScrollToTop />
        <VisitorTracker />
        <HelmetProvider>
          <ThemeProvider>
          <AnalyticsProvider>
            {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/jackie-chris" element={<JackieChrisGalleryPage />} />
              <Route path="/ansimon-mina" element={<AnsimonMinaGalleryPage />} />
              <Route path="/bianca-jeffrey" element={<BiancaJeffreyGalleryPage />} />
              <Route path="/ana-jose" element={<AnaJoseGalleryPage />} />
              <Route path="/crysta-david" element={<CrystaDavidGalleryPage />} />
              <Route path="/karni-zilvinas" element={<KarniZilvinasGalleryPage />} />
              <Route path="/judy-mike" element={<JudyMikeGalleryPage />} />
              <Route path="/galleries" element={<GalleriesPage />} />
              <Route path="/gallery/:slug" element={<ClientGalleryPage />} />
              <Route path="/client-gallery/:galleryId" element={<ClientGalleryViewPage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* Contact route removed as requested */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/wedding" element={<WeddingPhotography />} />
              <Route path="/wedding-video" element={<WeddingVideoPage />} />
              <Route path="/book-now" element={<BookNowPage />} />
              <Route path="/showcase" element={<ShowcasePage />} />
              <Route path="/amanda-alex" element={<AmandaAlexGalleryPage />} />
              {/* Portfolio Routes */}
              {/* Portfolio route removed as requested */}
              {/* Venue Lighting Tool Routes */}
              <Route path="/venue-lighting-tool" element={<VenueLightingTool />} />
              <Route path="/images" element={<ImagesPage />} />
              <Route path="/pricing" element={<PricingPage />} /> {/* Corrected route */}
              {/* <Route path="/ai-pricing" element={<AIPricingPage />} /> REMOVED */}
              {/* <Route path="/old-pricing" element={<PricingPage />} /> REMOVED */}
              <Route path="/picatinny-club" element={<PicatinnyClubPage />} />
              <Route path="/wedding-timeline-tool" element={<WeddingTimelineToolPage />} />
              <Route path="/wedding-tools" element={<WeddingToolsPage />} />
              <Route path="/multi-photographer-tool" element={<MultiPhotographerCoordinationToolPage />} />
              <Route path="/init-blog" element={<InitBlog />} />
              <Route path="/book-session" element={<BookingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/super-deal" element={<SuperDealLandingPage />} />
              <Route path="/how-its-going" element={<HowItsGoingPage />} />
              <Route path="/how-its-going/submit" element={<HowItsGoingSubmit />} />
              
              {/* Authentication routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/login" element={<AdminLogin />} />

              {/* Redirect /admin to /admin/dashboard to ensure analytics is shown first */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              
              {/* Redirect /admin/blog to /admin/blog-manager */}
              <Route path="/admin/blog" element={<Navigate to="/admin/blog-manager" replace />} />

              {/* Protected admin routes */}
              {/* Dashboard - NEW BEAUTIFUL VERSION */}
              <Route path="/admin/dashboard" element={
                <PrivateRoute>
                  <AdminLayout>
                    <NewAdminDashboard />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              {/* Old Dashboard (backup) */}
              <Route path="/admin/dashboard-old" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              {/* Dashboard Section Routes */}
              <Route path="/admin/activities" element={
                <PrivateRoute>
                  <AdminLayout>
                    <RecentActivities />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/upcoming" element={
                <PrivateRoute>
                  <AdminLayout>
                    <UpcomingSessions />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              {/* Client Management Routes */}
              <Route path="/admin/leads" element={
                <PrivateRoute>
                  <AdminLayout>
                    <LeadManagement />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/bookings" element={
                <PrivateRoute>
                  <AdminLayout>
                    <BookingsCalendar />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/communication" element={
                <PrivateRoute>
                  <AdminLayout>
                    <ClientCommunication />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/contracts" element={
                <PrivateRoute>
                  <AdminLayout>
                    <ContractsAndForms />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/payments" element={
                <PrivateRoute>
                  <AdminLayout>
                    <PaymentsPage />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/invoicing" element={
                <PrivateRoute>
                  <AdminLayout>
                    <InvoicingPayments />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              
              {/* Content */}
              <Route path="/admin/gallery" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminGallery />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/gallery/:slug" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminGalleryDetail />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/gallery/:slug/upload-video" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminVideoUpload />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/images" element={
                <PrivateRoute>
                  <AdminLayout>
                    <ImagesPage />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/portfolio" element={
                <PrivateRoute>
                  <AdminLayout>
                    <PortfolioCategoriesPage />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/portfolio-categories" element={
                <PrivateRoute>
                  <AdminLayout>
                    <PortfolioCategoriesPage />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/galleries" element={
                <PrivateRoute>
                  <AdminLayout>
                    <GalleryManagementHub />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/galleries/:galleryId" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminGalleryDetail />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/business" element={
                <PrivateRoute>
                  <AdminLayout>
                    <BusinessSettings />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/branding" element={
                <PrivateRoute>
                  <AdminLayout>
                    <Branding />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/integrations" element={
                <PrivateRoute>
                  <AdminLayout>
                    <Integrations />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              {/* Blog Management */}
              <Route path="/admin/blog-manager" element={
                <PrivateRoute>
                  <AdminLayout>
                    <BlogManager />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/blog-editor" element={
                <PrivateRoute>
                  <AdminLayout>
                    <BlogEditor />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/blog-editor/:id" element={
                <PrivateRoute>
                  <AdminLayout>
                    <BlogEditor />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/blog-categories" element={
                <PrivateRoute>
                  <AdminLayout>
                    <BlogCategories />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/blog/seo-optimizer" element={
                <PrivateRoute>
                  <AdminLayout>
                    <BlogPostOptimizer />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/blog-comments" element={
                <PrivateRoute>
                  <AdminLayout>
                    <BlogComments />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/universal-media-manager" element={
                <PrivateRoute>
                  <AdminLayout>
                    <UniversalMediaManager />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              {/* Gallery Management Routes */}
              <Route path="/admin/galleries/active" element={
                <PrivateRoute>
                  <AdminLayout>
                    <GalleryManagementHub />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/galleries/archive" element={
                <PrivateRoute>
                  <AdminLayout>
                    <GalleryManagementHub />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/galleries/delivery-status" element={
                <PrivateRoute>
                  <AdminLayout>
                    <GalleryManagementHub />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/galleries/portfolio" element={
                <PrivateRoute>
                  <AdminLayout>
                    <GalleryManagementHub />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/galleries/collections" element={
                <PrivateRoute>
                  <AdminLayout>
                    <GalleryManagementHub />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/galleries/sales" element={
                <PrivateRoute>
                  <AdminLayout>
                    <GalleryManagementHub />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              {/* Client Gallery Management */}
              <Route path="/admin/galleries/edit/:galleryId" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminGalleryDetail />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/galleries/:galleryId/images" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminGallery />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/clients" element={
                <PrivateRoute>
                  <AdminLayout>
                    <ClientsPage />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/jobs" element={
                <PrivateRoute>
                  <AdminLayout>
                    <JobsPage />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/jobs/:jobId" element={
                <PrivateRoute>
                  <AdminLayout>
                    <JobDetailPage />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/clients-page" element={
                <PrivateRoute>
                  <AdminLayout title="Clients Management">
                    <ClientsPage />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              {/* Content Management Routes */}
              <Route path="/admin/website-editor" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/pages" element={
                <PrivateRoute>
                  <AdminLayout>
                    <PagesManager />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/page-editor" element={
                <PrivateRoute>
                  <AdminLayout>
                    <PageEditor />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/navigation" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/content-blocks" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/image-manager" element={
                <PrivateRoute>
                  <AdminLayout>
                    <ImageManager />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/galleries/upload" element={
                <PrivateRoute>
                  <AdminLayout>
                    <GalleryManager />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              {/* Marketing Hub Routes */}
              <Route path="/admin/landing-editor" element={
                <PrivateRoute>
                  <AdminLayout>
                    <LandingEditor />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/email-campaigns" element={
                <PrivateRoute>
                  <AdminLayout>
                    <EmailCampaigns />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/lead-generation" element={
                <PrivateRoute>
                  <AdminLayout>
                    <LeadGeneration />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/lead-analytics" element={
                <PrivateRoute>
                  <AdminLayout>
                    <LeadAnalyticsPage />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/social-media" element={
                <PrivateRoute>
                  <AdminLayout>
                    <SocialMedia />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/seo" element={
                <PrivateRoute>
                  <AdminLayout>
                    <SeoTools />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/mission-control" element={
                <PrivateRoute>
                  <AdminLayout>
                    <MissionControlPage />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              {/* Settings & Tools Routes */}
              <Route path="/admin/settings" element={
                <PrivateRoute>
                  <AdminLayout>
                    <GeneralSettings />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/business-settings" element={
                <PrivateRoute>
                  <AdminLayout>
                    <BusinessSettings />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/wedding-slider" element={
                <PrivateRoute>
                  <AdminLayout>
                    <WeddingSliderSettings />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              <Route path="/admin/access-control" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              {/* Client Gallery Management */}
              <Route path="/admin/gallery/:galleryId" element={
                <PrivateRoute>
                  <AdminLayout>
                    <ViewGalleryPage />
                  </AdminLayout>
                </PrivateRoute>
              } />
              
              {/* Firebase Auth Debugger - accessible without authentication */}
              <Route path="/admin/auth-debug" element={
                <div className="min-h-screen bg-gray-100 p-6">
                  <h1 className="text-3xl font-bold mb-6">Firebase Authentication Debugger</h1>
                  <FirebaseAuthDebugger />
                </div>
              } />
              
              {/* Error handling */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnalyticsProvider>
          </ThemeProvider>
        </HelmetProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
