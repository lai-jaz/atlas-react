import { useEffect, useState } from "react";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useSelector } from "react-redux";
import { updateProfile } from "../../api";

const ProfileSettings = () => {
    const user = useSelector((state) => state.auth.user);
    
    const [isSaving, setIsSaving] = useState(false);
    const [profileData, setProfileData] = useState({
    name: '',
    email: user?.email || '',
    profile: {
        avatar: "placeholder.svg",
        bio: '',
        location: '',
        interests: '',
    }
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                profile: {
                    avatar: user.profile?.avatar || "placeholder.svg",
                    bio: user.profile?.bio || '',
                    location: user.profile?.location || '',
                    interests: user.profile?.interests || ''
            }
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (["bio", "location", "interests"].includes(name)) {
            setProfileData((prev) => ({
            ...prev,
            profile: {
                ...prev.profile,
                [name]: value,
            }
            }));
        } else {
            setProfileData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
            e.preventDefault();
            setIsSaving(true);
    
            try {
                await updateProfile(profileData); 
                toast.success("Profile updated successfully!");
            } catch (error) {
                toast.error("Failed to update profile!");
            } finally {
                setIsSaving(false); 
            }
    }
    
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-left p-4 bg-white">
                
        <h2 className="text-xl font-semibold">Profile Settings</h2>

        <Input name="name" placeholder="Name" value={profileData.name} onChange={handleChange} required />
        <Textarea name="bio" placeholder="Add your bio..." value={profileData.profile.bio} onChange={handleChange} rows={6} required />
        <Input name="location" placeholder="Type your location here..." value={profileData.profile.location} onChange={handleChange} />
        
        <Input name="interests" placeholder="Enter interests (comma separated)..." value={profileData.profile.interests} onChange={handleChange} />
        <div className="flex gap-2 flex-wrap">
            {profileData.profile.interests.split(',').map((interest, idx) => (
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
  );
}

export default ProfileSettings;