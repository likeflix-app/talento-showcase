import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { talentService } from '@/services/talent';
import { Talent, TalentFormData } from '@/types/talent';
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';

const TalentsManagement = () => {
  const { toast } = useToast();
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [formData, setFormData] = useState<TalentFormData>({
    name: '',
    category: '',
    price: '',
    image: '',
    description: '',
    rating: 0,
    isActive: true,
  });

  const categories = [
    'Sport & Fitness',
    'Alta Cucina',
    'Cinema & Regia',
    'Fashion & Style',
    'Business Strategy',
    'Wellness & Yoga',
    'Personal Training',
    'Pasticceria',
    'Fotografia Cinema',
    'Personal Shopper',
    'Digital Marketing',
    'Nutrizione',
  ];

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      const data = await talentService.getAllTalents();
      setTalents(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch talents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTalent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await talentService.createTalent(formData);
      toast({
        title: 'Success',
        description: 'Talent created successfully',
      });
      setIsCreateModalOpen(false);
      resetForm();
      fetchTalents();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create talent',
        variant: 'destructive',
      });
    }
  };

  const handleEditTalent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTalent) return;

    try {
      await talentService.updateTalent(selectedTalent.id, formData);
      toast({
        title: 'Success',
        description: 'Talent updated successfully',
      });
      setIsEditModalOpen(false);
      setSelectedTalent(null);
      resetForm();
      fetchTalents();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update talent',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTalent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this talent?')) return;

    try {
      await talentService.deleteTalent(id);
      toast({
        title: 'Success',
        description: 'Talent deleted successfully',
      });
      fetchTalents();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete talent',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await talentService.toggleTalentStatus(id);
      toast({
        title: 'Success',
        description: 'Talent status updated',
      });
      fetchTalents();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update talent status',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      image: '',
      description: '',
      rating: 0,
      isActive: true,
    });
  };

  const openEditModal = (talent: Talent) => {
    setSelectedTalent(talent);
    setFormData({
      name: talent.name,
      category: talent.category,
      price: talent.price,
      image: talent.image,
      description: talent.description,
      rating: talent.rating,
      isActive: talent.isActive,
    });
    setIsEditModalOpen(true);
  };

  const filteredTalents = talents.filter(talent =>
    talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talent.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TalentForm = ({ onSubmit, title }: { onSubmit: (e: React.FormEvent) => void; title: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="€150/h"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
          placeholder="/path/to/image.jpg"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
          className="rounded"
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button type="submit">{title}</Button>
      </div>
    </form>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Talents Management</h2>
          <p className="text-muted-foreground">Manage your talent consultants</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Talent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Talent</DialogTitle>
            </DialogHeader>
            <TalentForm onSubmit={handleCreateTalent} title="Create" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search talents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Talents Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Talents ({filteredTalents.length})</CardTitle>
          <CardDescription>
            Manage your talent consultants and their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTalents.map((talent) => (
                <TableRow key={talent.id}>
                  <TableCell className="font-medium">{talent.name}</TableCell>
                  <TableCell>{talent.category}</TableCell>
                  <TableCell>{talent.price}</TableCell>
                  <TableCell>{talent.rating}</TableCell>
                  <TableCell>
                    <Badge variant={talent.isActive ? "default" : "secondary"}>
                      {talent.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(talent.id)}
                      >
                        {talent.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(talent)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTalent(talent.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Talent</DialogTitle>
          </DialogHeader>
          <TalentForm onSubmit={handleEditTalent} title="Update" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TalentsManagement;
