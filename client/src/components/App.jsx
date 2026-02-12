import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';


<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/services" element={<Services />} />
  <Route path="/reviews" element={<Reviews />} />
  <Route path="/contact" element={<Contact />} />
  
  {/* Protected Routes */}
  <Route path="/request-quote" element={
    <ProtectedRoute>
      <RequestQuote />
    </ProtectedRoute>
  } />
  
  <Route path="/gallery" element={
    <ProtectedRoute>
      <Gallery />
    </ProtectedRoute>
  } />
  
  {/* Admin Routes - Protected */}
  <Route path="/*" element={
    <ProtectedRoute>
      <AdminRoutes />
    </ProtectedRoute>
  } />
</Routes>