import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Recycle } from 'lucide-react';

export const CollectionForm: React.FC = () => {
  const { addCollectionRecord, collectionRecords } = useData();
  const [area, setArea] = useState('');
  const [plasticCollected, setPlasticCollected] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!area.trim() || !plasticCollected || parseFloat(plasticCollected) <= 0) {
      toast.error('Please fill in all fields with valid data');
      return;
    }

    addCollectionRecord({
      area: area.trim(),
      plasticCollected: parseFloat(plasticCollected),
      date,
      status: 'Collected',
    });

    toast.success(`✅ Successfully recorded ${plasticCollected} kg from ${area}!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    setArea('');
    setPlasticCollected('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  // Get last 3 records
  const recentRecords = collectionRecords
    .sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">📝 Collection Data Entry</h2>
        <p className="text-gray-600 mt-1">Record plastic waste collected from different areas</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Alert className="border-green-500 bg-green-50">
          <Recycle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✅ Collection data saved successfully! Your contribution makes a difference.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-t-4 border-t-green-500">
        <CardHeader>
          <CardTitle>New Collection Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="area">📍 Area / Location</Label>
              <Input
                id="area"
                type="text"
                placeholder="e.g., Gachibowli, North District, etc."
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plastic">⚖️ Plastic Collected (kg)</Label>
              <Input
                id="plastic"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 25.5"
                value={plasticCollected}
                onChange={(e) => setPlasticCollected(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">📅 Collection Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Record Collection
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      {recentRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📋 Recent Entries (Last 3)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRecords.map((record, index) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{record.area}</p>
                      <p className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-700">{record.plasticCollected} kg</p>
                    <p className="text-xs text-gray-600">Status: {record.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">📌 Collector Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Weigh plastic waste accurately before recording</li>
            <li>• Ensure the area name is consistent for better tracking</li>
            <li>• Record collections daily for accurate reporting</li>
            <li>• All collected waste automatically starts with "Collected" status</li>
            <li>• Your data helps track environmental impact!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};