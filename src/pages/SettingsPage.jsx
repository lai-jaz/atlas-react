import MainLayout from "../components/layouts/MainLayout";
import ProfileSettings from "../components/profile-settings/ProfileSettings";
import AccountSettings from "../components/profile-settings/AccountSettings";


const SettingsPage = () => {
    
  return (
    <MainLayout>
        <div className="container py-6 space-y-6">
            <ProfileSettings />
        </div>

        <div className="container py-6 space-y-6">
            <AccountSettings />
        </div>
    </MainLayout>
  );
}

export default SettingsPage;