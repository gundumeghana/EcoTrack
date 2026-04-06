import React from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { ArrowRight, Package, Truck, Recycle, CheckCircle } from 'lucide-react';

export const TransportationTracker: React.FC = () => {
  const { collectionRecords, updateCollectionStatus } = useData();

  const handleStatusUpdate = (id: string, currentStatus: string, area: string, amount: number) => {
    let newStatus: 'Collected' | 'Sent' | 'Recycled';

    if (currentStatus === 'Collected') {
      newStatus = 'Sent';
      toast.success(`✅ ${area}: ${amount} kg marked as Sent`);
    } else if (currentStatus === 'Sent') {
      newStatus = 'Recycled';
      toast.success(`♻️ ${area}: ${amount} kg marked as Recycled!`);
    } else {
      toast.info('This waste has already been recycled');
      return;
    }

    updateCollectionStatus(id, newStatus);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Collected':
        return <Badge className="bg-blue-500 hover:bg-blue-600">📦 {status}</Badge>;
      case 'Sent':
        return <Badge className="bg-orange-500 hover:bg-orange-600">🚚 {status}</Badge>;
      case 'Recycled':
        return <Badge className="bg-green-500 hover:bg-green-600">♻️ {status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Collected':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'Sent':
        return <Truck className="h-5 w-5 text-orange-600" />;
      case 'Recycled':
        return <Recycle className="h-5 w-5 text-green-600" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  // Statistics
  const collectedCount = collectionRecords.filter(r => r.status === 'Collected').length;
  const sentCount = collectionRecords.filter(r => r.status === 'Sent').length;
  const recycledCount = collectionRecords.filter(r => r.status === 'Recycled').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">🚛 Waste Transportation Tracker</h2>
        <p className="text-gray-600 mt-1">Track waste status: Collected → Sent → Recycled</p>
      </div>

      {/* Status Flow Indicator */}
      <Card className="bg-gradient-to-r from-blue-50 via-orange-50 to-green-50 border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-7 w-7 text-blue-600" />
                <span className="font-bold text-blue-900 text-lg">Collected</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{collectedCount}</div>
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 mt-[-20px]" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="h-7 w-7 text-orange-600" />
                <span className="font-bold text-orange-900 text-lg">Sent</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{sentCount}</div>
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 mt-[-20px]" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <Recycle className="h-7 w-7 text-green-600" />
                <span className="font-bold text-green-900 text-lg">Recycled</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{recycledCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Table */}
      <Card>
        <CardHeader>
          <CardTitle>📋 All Collection Records ({collectionRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {collectionRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead className="text-right">Quantity (kg)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collectionRecords
                    .sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime())
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.area}</TableCell>
                        <TableCell className="text-right font-semibold">{record.plasticCollected} kg</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-gray-600">{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          {record.status !== 'Recycled' ? (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(record.id, record.status, record.area, record.plasticCollected)}
                              className={`${
                                record.status === 'Collected' 
                                  ? 'bg-orange-600 hover:bg-orange-700' 
                                  : 'bg-green-600 hover:bg-green-700'
                              }`}
                            >
                              {record.status === 'Collected' ? '🚚 Mark as Sent' : '♻️ Mark as Recycled'}
                            </Button>
                          ) : (
                            <div className="flex items-center justify-end gap-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Complete</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No collection records yet. Add collection data to start tracking.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
