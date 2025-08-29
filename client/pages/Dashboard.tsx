import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
                <path 
                  d="M27.3723 22.6039C27.9964 23.7209 27.189 25.097 25.9095 25.097H4.88702C3.6005 25.097 2.79387 23.7073 3.43201 22.5902L14.0587 3.98729C14.7055 2.85516 16.3405 2.86285 16.9765 4.00102L27.3723 22.6039Z" 
                  stroke="#D83A52" 
                  strokeWidth="2.5" 
                  fill="none"
                />
              </svg>
              <span className="text-arcon-gray-primary text-xl font-bold font-roboto">arcon</span>
            </div>

            {/* User menu */}
            <button
              onClick={handleLogout}
              className="text-arcon-gray-secondary hover:text-arcon-gray-primary font-roboto text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-arcon-blue-light rounded-full flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#0073EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-arcon-gray-heading font-roboto mb-4">
            Welcome to Arcon Dashboard
          </h1>
          
          <p className="text-arcon-gray-secondary font-roboto text-lg mb-8 max-w-2xl mx-auto">
            You have successfully logged in! This is a placeholder dashboard page. 
            Continue building your application features here.
          </p>

          <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-arcon-gray-primary font-roboto mb-4">
              Identity Verified
            </h2>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-roboto font-medium">Secure Login Complete</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
