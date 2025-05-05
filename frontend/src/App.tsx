import React from 'react';
import { BrowserRouter,  Route, Routes   } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';

 function App() {
   return (
     <AuthProvider>
       <BrowserRouter>
         <Routes>
           <Route path="/login" element={<LoginPage />} />
           <Route
               path="/"
               element={
                 <PrivateRoute>
                   <DashboardPage />
                 </PrivateRoute>
               }
           />
         </Routes>
       </BrowserRouter>
     </AuthProvider>
   );
 }

 export default App;
//  cd C:\Users\Michail\PycharmProjects\IME\frontend       npm start