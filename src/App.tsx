import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "./components/ui/toaster";
import LoginPage from "./pages/auth/login";
import { ErrorBoundary } from "./utils/ErrorBoundary";
import { LoadingSpinner } from "./utils/LoadingSpinner";
import Header from "./utils/Header";
import { menuSections } from "./hooks/menu-sections";

import { lazyComponents } from "./config/lazy-components";
import { MobileMenuButton } from "./components/layout/MobileMenuButton";
import { Sidebar } from "./components/layout/Sidebar";
import { AppRoutes } from "./components/layout/AppRoutes";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(["rrhh", "procesos"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.replace('/', '') || 'noticias';
  const [selectedSection, setSelectedSection] = useState(currentPath);

  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'noticias';
    setSelectedSection(path);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    setIsLoading(false);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const preloadMainComponents = async () => {
      try {
        await Promise.all([
          lazyComponents.NoticiasListing,
          lazyComponents.CalendarView,
          lazyComponents.MejorasListing
        ]);
      } catch (error) {
        console.error("Error al precargar componentes:", error);
      }
    };
    preloadMainComponents();
  }, []);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prevGroups =>
      prevGroups.includes(groupId)
        ? prevGroups.filter(id => id !== groupId)
        : [...prevGroups, groupId]
    );
  };

  const handleSectionChange = (sectionId: string) => {
    setIsLoading(true);
    setSelectedSection(sectionId);
    navigate(`/${sectionId}`);
    if (isMobile) setIsMobileMenuOpen(false);
    setTimeout(() => setIsLoading(false), 300);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage onLogin={() => setIsAuthenticated(true)} />
        <Toaster />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {isMobile && (
          <MobileMenuButton 
            isMobileMenuOpen={isMobileMenuOpen} 
            toggleMobileMenu={toggleMobileMenu} 
          />
        )}

        <Sidebar
          sections={menuSections}
          expandedGroups={expandedGroups}
          selectedSection={selectedSection}
          isMobile={isMobile}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleGroup={toggleGroup}
          handleSectionChange={handleSectionChange}
        />

        <motion.div
          className={`flex-1 overflow-hidden flex flex-col ${isMobile ? "w-full" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Header sections={menuSections} selectedSection={selectedSection} />

          <div className={`dark:bg-slate-800 flex-1 overflow-auto p-6 ${isMobile ? "pt-16" : ""}`}>
            <ErrorBoundary>
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner />
                </div>
              }>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <AppRoutes />
                </motion.div>
              </Suspense>
            </ErrorBoundary>
          </div>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}