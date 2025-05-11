import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createJournal } from '../../api';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
const JournalForm = () => {
  const user = useSelector((state) => state.auth.user); 
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState('');
const [tags, setTags] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    tags: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const journalData = {
      title: formData.title,
      content: formData.content,
      location: formData.location,
      tags: tags,  
      author: { 
        name: user?.name,
        avatar: user?.profile?.avatar
      },  
      userId: user?._id,  
      date: new Date(), 

    };
  
    
    console.log('Journal data to be submitted:', journalData);
  
    try {
      await createJournal(journalData, file); 
      toast.success('your journal entry has been created successfully!');
      setFormData({ title: '', content: '', location: '', tags: ''});
    } catch (err) {
      toast.error('Failed to create journal. Please try again.')
    }
    setIsSubmitting(false);
  };
  
  const handleTagKeyDown = (e) => {
  if (e.key === 'Enter' && tagInput.trim()) {
    e.preventDefault();
    const newTag = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput('');
  }
};

  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold">Create a Journal Entry</h2>
      <Input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <Textarea name="content" placeholder="Write your experience..." value={formData.content} onChange={handleChange} rows={6} required />
      <Input name="location" placeholder="Type your location here..." value={formData.location} onChange={handleChange} />
      <Input
  name="tagInput"
  placeholder="Type a tag and press Enter..."
  value={tagInput}
  onChange={(e) => setTagInput(e.target.value)}
  onKeyDown={handleTagKeyDown}
/>

      <div className="flex flex-wrap gap-2">
  {tags.map((tag, idx) => (
    <Badge key={idx} variant="outline" className="bg-muted/50">{tag}</Badge>
  ))}
</div>

      <div>
            <label className="block mb-1 text-sm font-medium">Upload Avatar</label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
                <img
                    src={imagePreview}
                    alt="Avatar Preview"
                    className="mt-2 rounded-lg max-h-48 object-cover"
                />
            )}
        </div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Journal'}</Button>
    </form>
  );
};

export default JournalForm;