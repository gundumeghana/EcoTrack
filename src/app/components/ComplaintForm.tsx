import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { MessageSquare, AlertCircle } from 'lucide-react';

export const ComplaintForm: React.FC = () => {
  const { addComplaint, complaints } = useData();
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!area.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    addComplaint({ area: area.trim(), description: description.trim() });
    toast.success('Complaint submitted successfully!');
    setArea('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Complaint Reporting</h2>
        <p className="text-gray-600 mt-1">Report issues related to waste collection and recycling</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit a Complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="complaint-area">Area</Label>
              <Input
                id="complaint-area"
                type="text"
                placeholder="e.g., Gachibowli, North District"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Complaint
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <CardTitle>All Complaints ({complaints.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {complaints.length > 0 ? (
            <div className="space-y-3">
              {complaints
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((complaint) => (
                  <div
                    key={complaint.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-900">{complaint.area}</h3>
                      </div>
                      <Badge variant={complaint.status === 'Pending' ? 'destructive' : 'default'}>
                        {complaint.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{complaint.description}</p>
                    <p className="text-xs text-gray-500">
                      Submitted on {new Date(complaint.date).toLocaleDateString()} at{' '}
                      {new Date(complaint.date).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No complaints submitted yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
