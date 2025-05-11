import MainLayout from "../components/layouts/MainLayout";
import ProfileSettings from "../components/profile-settings/ProfileSettings";


const SettingsPage = () => {
    
  return (
    <MainLayout>
        <div className="container py-6 space-y-6">
            <ProfileSettings />
        </div>
    </MainLayout>
  );
}

export default SettingsPage;