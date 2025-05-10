import { useSelector } from "react-redux";
import MainLayout from "../components/layouts/MainLayout";
import { useEffect, useState } from "react";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { updateProfile } from "../api.js";


const SettingsPage = () => {
    console.log("Settings component loaded");
    const user = useSelector((state) => state.auth.user);
    console.log(user);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile: {
        avatar: "placeholder.svg",
        bio: '',
        location: '',
        interests: '',
    }
    });

    useEffect(() => {
    if (user) {
        setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        profile: {
            avatar: user.profile?.avatar || "placeholder.svg",
            bio: user.profile?.bio || '',
            location: user.profile?.location || '',
            interests: (user.profile?.interests || []).join(', ')
        }
        });
    }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (["bio", "location", "interests"].includes(name)) {
            setFormData((prev) => ({
            ...prev,
            profile: {
                ...prev.profile,
                [name]: value,
            }
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
        await updateProfile(formData);  // Call the API to update the profile
        toast.success("Profile updated successfully!");  // Show success toast
        } catch (error) {
            toast.error("Failed to update profile!");  // Show error toast
        } finally {
            setIsSaving(false);  // Reset saving state
        }
    }

  return (
    <MainLayout>
        <div className="container py-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-left p-4 bg-white">
            
            <h2 className="text-xl font-semibold">Profile Settings</h2>

            <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <Textarea name="bio" placeholder="Add your bio..." value={formData.profile.bio} onChange={handleChange} rows={6} required />
            <Input name="location" placeholder="Type your location here..." value={formData.profile.location} onChange={handleChange} />
            
            <Input name="tags" placeholder="Enter interests (comma separated)..." value={formData.profile.interests} onChange={handleChange} />
            <div className="flex gap-2 flex-wrap">
                {formData.profile.interests.split(',').map((interest, idx) => (
                <Badge key={idx} variant="outline" className="bg-muted/50">{interest.trim()}</Badge>
                ))}
            </div>

            <div>
                {/* <label className="block mb-1 text-sm font-medium">Upload Image</label>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
                {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" className="mt-2 rounded-lg max-h-48 object-cover" />} */}
            </div>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
        </form>
        </div>
    </MainLayout>
  );
}

export default SettingsPage;