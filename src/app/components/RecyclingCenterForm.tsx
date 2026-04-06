import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Building2, MapPin, CheckCircle } from 'lucide-react';

export const RecyclingCenterForm: React.FC = () => {
  const { addRecyclingCenter, recyclingCenters, collectionRecords, updateCollectionStatus } = useData();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !location.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    addRecyclingCenter({ name: name.trim(), location: location.trim() });
    toast.success('✅ Recycling center added successfully!');
    setName('');
    setLocation('');
  };

  const handleProcessWaste = () => {
    if (!selectedRecordId) {
      toast.error('Please select a collection entry');
      return;
    }

    const record = collectionRecords.find(r => r.id === selectedRecordId);
    if (!record) return;

    if (record.status === 'Recycled') {
      toast.info('This waste has already been recycled');
      return;
    }

    updateCollectionStatus(selectedRecordId, 'Recycled');
    toast.success(`♻️ Successfully marked ${record.plasticCollected} kg from ${record.area} as Recycled!`);
    setSelectedRecordId('');
  };

  // Get pending waste (not recycled)
  const pendingWaste = collectionRecords.filter(r => r.status !== 'Recycled');

  // Calculate total processed by centers
  const totalProcessed = collectionRecords
    .filter(r => r.status === 'Recycled')
    .reduce((sum, r) => sum + r.plasticCollected, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">🏭 Recycling Centers</h2>
        <p className="text-gray-600 mt-1">Register and manage recycling centers & process waste</p>
      </div>

      {/* Processing Stats */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">Total Waste Processed</p>
              <p className="text-3xl font-bold text-green-700">{totalProcessed.toFixed(2)} kg</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700 font-medium">Pending Waste</p>
              <p className="text-3xl font-bold text-orange-600">
                {collectionRecords
                  .filter(r => r.status !== 'Recycled')
                  .reduce((sum, r) => sum + r.plasticCollected, 0)
                  .toFixed(2)} kg
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Waste */}
      <Card className="border-t-4 border-t-green-500">
        <CardHeader>
          <CardTitle>♻️ Process Waste (Mark as Recycled)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collection-entry">Select Collection Entry to Process</Label>
              <Select value={selectedRecordId} onValueChange={setSelectedRecordId}>
                <SelectTrigger id="collection-entry">
                  <SelectValue placeholder="Choose a collection entry..." />
                </SelectTrigger>
                <SelectContent>
                  {pendingWaste.length > 0 ? (
                    pendingWaste.map(record => (
                      <SelectItem key={record.id} value={record.id}>
                        {record.area} - {record.plasticCollected} kg ({record.status}) - {new Date(record.date).toLocaleDateString()}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No pending waste available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleProcessWaste} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!selectedRecordId}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Recycled
            </Button>

            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              ℹ️ Select a collection entry above and click the button to mark it as recycled. This will update the dashboard and reports.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add New Center Form */}
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle>Add New Recycling Center</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">🏢 Center Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Green Earth Recycling Center"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">📍 Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., 123 Main St, Gachibowli"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              <Building2 className="h-4 w-4 mr-2" />
              Add Recycling Center
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List of Centers */}
      <Card>
        <CardHeader>
          <CardTitle>📍 Registered Centers ({recyclingCenters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {recyclingCenters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recyclingCenters.map((center) => (
                <div
                  key={center.id}
                  className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{center.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{center.location}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      📅 Added on {new Date(center.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recycling centers registered yet.</p>
              <p className="text-sm text-gray-400 mt-1">Add one above to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
