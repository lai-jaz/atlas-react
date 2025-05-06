import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const JournalForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    tags: '',
    image: null,
    imagePreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
        imagePreview: URL.createObjectURL(file),
      }));
    };
    reader.readAsDataURL(file);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.content.slice(0, 120),
      location: formData.location,
      tags: formData.tags.split(',').map((tag) => tag.trim()),
      imageUrl: formData.image,
      date: new Date().toISOString(),
      author: {
        name: 'current User',
        avatar: '/placeholder.svg',
      },
      likes: 0,
      comments: 0,
    };
    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        navigate('/journal');
      } else {
        alert('Failed to save journal!');
      }
    } catch (err) {
      alert('Error Occurred!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold">Create a Journal Entry</h2>
      <Input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <Textarea
        name="content"
        placeholder="Write your experience..."
        value={formData.content}
        onChange={handleChange}
        rows={6}
        required
      />
      <Input
        name="location"
        placeholder="Type your location here..."
        value={formData.location}
        onChange={handleChange}
      />
      <Input
        name="tags"
        placeholder="Enter tags comma separated..."
        value={formData.tags}
        onChange={handleChange}
      />
      <div className="flex gap-2 flex-wrap">
        {formData.tags &&
          formData.tags.split(',').map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50">
              {tag.trim()}
            </Badge>
          ))}
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Upload Image</label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {formData.imagePreview && (
          <img
            src={formData.imagePreview}
            alt="Preview"
            className="mt-2 rounded-lg max-h-48 object-cover"
          />
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Journal'}
      </Button>
    </form>
  );
};

export default JournalForm;
