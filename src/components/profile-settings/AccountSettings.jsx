import { useEffect, useState } from "react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSelector } from "react-redux";
import { updateProfile } from "../../api";

const AccountSettings = () => {
    const user = useSelector((state) => state.auth.user);
    
    const [isSaving, setIsSaving] = useState(false);
    const[accountData, setAccountData] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
    if (user) {
        setAccountData({
            email: user.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccountData((prev) => ({
        ...prev,
        [name]: value
        }));
    };

    const handleAccountSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        if (accountData.newPassword !== accountData.confirmPassword) { // pwd validation
            toast.error("New password and confirmation password don't match.");
            setIsSaving(false);
            return;
        }

        try {
            const updateData = {
                email: accountData.email,
                ...(accountData.newPassword && { password: accountData.newPassword }),
            };
            await updateProfile(updateData);
            toast.success("Account updated successfully!");
        } 
        catch (error) {
            const serverMessage = error?.response?.data?.error || "";

            if (serverMessage === "Current password is incorrect") {
                toast.error("Your current password is incorrect.");
            } else if (serverMessage === "User not found") {
                toast.error(serverMessage);
            } else if (serverMessage === "Server error") {
                toast.error("Something went wrong on the server.");
            } else {
                toast.error("Failed to update account.");
            }
        } finally {
            setIsSaving(false);
        }
    };
    
  return (
    <form onSubmit={handleAccountSubmit} className="space-y-4 max-w-2xl mx-left p-4 bg-white">
                    
        <h2 className="text-xl font-semibold">Account Settings</h2>

        <Input name="email" placeholder="Email" value={accountData.email} onChange={handleChange} required />
        <Input name="currentPassword" type="password" placeholder="Enter current password" onChange={handleChange} />
        <Input name="newPassword" type="password" placeholder="Enter new Password" onChange={handleChange} />
        <Input name="confirmPassword" type="password" placeholder="Confirm new Password" onChange={handleChange} />
        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
    </form>
  );
}

export default AccountSettings;