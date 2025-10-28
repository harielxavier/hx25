import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth as useAuth } from './contexts/SupabaseAuthContext';
import AnalyticsProvider from './components/AnalyticsProvider';
import GoogleAnalytics from './components/GoogleAnalytics';
import AnalyticsTracker from './components/AnalyticsTracker';
import { initializeAnalytics } from './utils/analytics';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { GA_MEASUREMENT_ID } from './config/analytics';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

// Eager load critical pages (landing, about, galleries)
import { LandingPage } from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Lazy load everything else
const GalleriesPage = lazy(() => import('./pages/GalleriesPage'));
const ClientGalleryPage = lazy(() => import('./pages/ClientGalleryPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

// Admin pages - lazy loaded (biggest bundle savings)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminGalleryDetail = lazy(() => import('./pages/admin/AdminGalleryDetail'));
const AdminVideoUpload = lazy(() => import('./pages/admin/AdminVideoUpload'));

// Public pages - lazy loaded
const WeddingPhotography = lazy(() => import('./pages/WeddingPhotography'));
const WeddingVideoPage = lazy(() => import('./pages/WeddingVideoPage'));
const BookNowPage = lazy(() => import('./pages/BookNowPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));

// Gallery pages - lazy loaded
const JackieChrisGalleryPage = lazy(() => import('./pages/JackieChrisGalleryPage'));
const AnsimonMinaGalleryPage = lazy(() => import('./pages/AnsimonMinaGalleryPage'));
const BiancaJeffreyGalleryPage = lazy(() => import('./pages/BiancaJeffreyGalleryPage'));
const AnaJoseGalleryPage = lazy(() => import('./pages/AnaJoseGalleryPage'));
const CrystaDavidGalleryPage = lazy(() => import('./pages/CrystaDavidGalleryPage'));
const KarniZilvinasGalleryPage = lazy(() => import('./pages/KarniZilvinasGalleryPage'));
const JudyMikeGalleryPage = lazy(() => import('./pages/JudyMikeGalleryPage'));
const AmandaAlexGalleryPage = lazy(() => import('./pages/AmandaAlexGalleryPage'));
const ClientGalleryViewPage = lazy(() => import('./pages/ClientGalleryViewPage'));

// Tools - lazy loaded
const VenueLightingTool = lazy(() => import(/* webpackChunkName: "tools" */ './pages/VenueLightingTool'));
const WeddingTimelineToolPage = lazy(() => import(/* webpackChunkName: "tools" */ './pages/WeddingTimelineToolPage'));
const WeddingToolsPage = lazy(() => import(/* webpackChunkName: "tools" */ './pages/WeddingToolsPage'));
const MultiPhotographerCoordinationToolPage = lazy(() => import(/* webpackChunkName: "tools" */ './pages/MultiPhotographerCoordinationToolPage'));
const PicatinnyClubPage = lazy(() => import('./pages/PicatinnyClubPage'));

// New features
const SuperDealLandingPage = lazy(() => import('./pages/SuperDealLandingPage'));

// Admin - all lazy loaded (huge bundle savings)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const NewAdminDashboard = lazy(() => import('./pages/admin/NewAdminDashboard'));
const ComprehensiveAnalyticsDashboard = lazy(() => import('./pages/admin/ComprehensiveAnalyticsDashboard'));
const TrafficAnalytics = lazy(() => import('./pages/admin/TrafficAnalytics'));
const GalleryManagementHub = lazy(() => import('./pages/admin/GalleryManagementHub'));
const BlogManager = lazy(() => import('./pages/admin/BlogManager'));
const BlogManagement = lazy(() => import('./pages/admin/BlogManagement'));
const BlogEditor = lazy(() => import('./pages/admin/EnhancedBlogEditor'));
const BlogCategories = lazy(() => import('./pages/admin/BlogCategories'));
const BlogComments = lazy(() => import('./pages/admin/BlogComments'));
const CommentModeration = lazy(() => import('./pages/admin/CommentModeration'));
const PagesManager = lazy(() => import('./pages/admin/PagesManager'));
const PageEditor = lazy(() => import('./pages/admin/PageEditor'));
const GeneralSettings = lazy(() => import('./pages/admin/GeneralSettings'));
const ImageManager = lazy(() => import('./pages/admin/ImageManager'));
const PortfolioCategoriesPage = lazy(() => import('./pages/admin/PortfolioCategoriesPage'));
const ClientsPage = lazy(() => import('./pages/admin/ClientsPage'));
const JobsPage = lazy(() => import('./pages/admin/JobsPage'));
const JobDetailPage = lazy(() => import('./pages/admin/JobDetailPage'));
const RecentActivities = lazy(() => import('./pages/admin/RecentActivities'));
const UpcomingSessions = lazy(() => import('./pages/admin/UpcomingSessions'));
const LeadManagement = lazy(() => import('./pages/admin/LeadManagement'));
const BookingsCalendar = lazy(() => import('./pages/admin/BookingsCalendar'));
const ClientCommunication = lazy(() => import('./pages/admin/ClientCommunication'));
const ContractsAndForms = lazy(() => import('./pages/admin/ContractsAndForms'));
const InvoicingPayments = lazy(() => import('./pages/admin/InvoicingPayments'));
const PaymentsPage = lazy(() => import('./pages/admin/PaymentsPage'));
const LandingEditor = lazy(() => import('./pages/admin/LandingEditor'));
const EmailCampaigns = lazy(() => import('./pages/admin/EmailCampaigns'));
const LeadGeneration = lazy(() => import('./pages/admin/LeadGeneration'));
const SocialMedia = lazy(() => import('./pages/admin/SocialMedia'));
const SeoTools = lazy(() => import('./pages/admin/SeoTools'));
const Branding = lazy(() => import('./pages/admin/Branding'));
const Integrations = lazy(() => import('./pages/admin/Integrations'));
const BusinessSettings = lazy(() => import('./pages/admin/BusinessSettings'));
const WeddingSliderSettings = lazy(() => import('./pages/admin/WeddingSliderSettings'));
const GalleryManager = lazy(() => import('./pages/admin/GalleryManager'));
const UniversalMediaManager = lazy(() => import('./pages/admin/UniversalMediaManager'));
const ViewGalleryPage = lazy(() => import('./pages/admin/ViewGalleryPage'));
const LeadAnalyticsPage = lazy(() => import('./pages/admin/LeadAnalyticsPage'));
const MissionControlPage = lazy(() => import('./pages/admin/MissionControlPage'));
const AITools = lazy(() => import('./pages/admin/AITools'));

// Utilities
const ImagesPage = lazy(() => import('./pages/ImagesPage'));
const InitBlog = lazy(() => import('./pages/InitBlog'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const VisitorTracker = lazy(() => import('./components/VisitorTracker'));
const BlogPostOptimizer = lazy(() => import('./scripts/optimize-all-blog-posts'));
const FirebaseAuthDebugger = lazy(() => import('./components/admin/FirebaseAuthDebugger'));

// Auth routing component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  // Show error if authentication failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg border border-red-200">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-red-800 mb-2">Authentication Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
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
        <AnalyticsTracker />
        <Suspense fallback={<PageLoader />}>
          <VisitorTracker />
        </Suspense>
        <HelmetProvider>
          <ThemeProvider>
          <AnalyticsProvider>
            {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}
            <Suspense fallback={<PageLoader />}>
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
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/amanda-alex" element={<AmandaAlexGalleryPage />} />
              {/* Portfolio Routes */}
              {/* Portfolio route removed as requested */}
              {/* Venue Lighting Tool Routes */}
              <Route path="/venue-lighting-tool" element={<VenueLightingTool />} />
              <Route path="/images" element={<ImagesPage />} />
              <Route path="/pricing" element={<PricingPage />} /> {/* Corrected route */}
              <Route path="/faq" element={<FAQPage />} />
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
                  <AdminLayout title="Analytics Dashboard">
                    <ComprehensiveAnalyticsDashboard />
                  </AdminLayout>
                </PrivateRoute>
              } />

              {/* Traffic Analytics - REAL DATA */}
              <Route path="/admin/analytics" element={
                <PrivateRoute>
                  <AdminLayout>
                    <TrafficAnalytics />
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
              
              {/* NEW Professional Blog Management */}
              <Route path="/admin/blog" element={
                <PrivateRoute>
                  <BlogManagement />
                </PrivateRoute>
              } />
              
              <Route path="/admin/blog/edit/:id" element={
                <PrivateRoute>
                  <BlogEditor />
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
              
              <Route path="/admin/comment-moderation" element={
                <PrivateRoute>
                  <AdminLayout>
                    <CommentModeration />
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

              {/* AI Tools - Claude Integration */}
              <Route path="/admin/ai-tools" element={
                <PrivateRoute>
                  <AdminLayout>
                    <AITools />
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
            </Suspense>
          </AnalyticsProvider>
          </ThemeProvider>
        </HelmetProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
