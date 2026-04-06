import React from 'react';
import { CollectionForm } from '../components/CollectionForm';
import { Card, CardContent } from '../components/ui/card';
import { useData } from '../context/DataContext';
import { Package, TrendingUp, Target, Award } from 'lucide-react';

export const CollectorView: React.FC = () => {
  const { collectionRecords } = useData();

  // Calculate collector stats
  const myRecordsToday = collectionRecords.filter(
    (record) => record.date === new Date().toISOString().split('T')[0]
  );

  const todayTotal = myRecordsToday.reduce((sum, record) => sum + record.plasticCollected, 0);
  const totalCollected = collectionRecords.reduce((sum, record) => sum + record.plasticCollected, 0);
  const totalRecords = collectionRecords.length;
  const avgPerCollection = totalRecords > 0 ? totalCollected / totalRecords : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">👤 Collector Dashboard</h1>
        <p className="text-gray-600 mt-1">Record your daily plastic waste collection and track your impact</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">📅 Today's Collection</p>
                <p className="text-2xl font-bold text-blue-900">{todayTotal.toFixed(2)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">💪 Total Contribution</p>
                <p className="text-2xl font-bold text-green-900">{totalCollected.toFixed(2)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">📊 Total Records</p>
                <p className="text-2xl font-bold text-purple-900">{totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">⚖️ Avg Per Collection</p>
                <p className="text-2xl font-bold text-orange-900">{avgPerCollection.toFixed(2)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Banner */}
      {totalCollected > 500 && (
        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🏆</div>
              <div>
                <h3 className="text-xl font-bold text-orange-900">Outstanding Achievement!</h3>
                <p className="text-orange-800">
                  You've collected over 500 kg of plastic waste. You're making a huge environmental impact!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collection Form */}
      <CollectionForm />

      {/* Recent Collections */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">📋 Recent Collections (Last 5)</h3>
          {collectionRecords.length > 0 ? (
            <div className="space-y-2">
              {collectionRecords
                .sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime())
                .slice(0, 5)
                .map((record, index) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{record.area}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.date).toLocaleDateString()} • 
                          <span className={`ml-1 ${
                            record.status === 'Recycled' ? 'text-green-600' :
                            record.status === 'Sent' ? 'text-orange-600' : 'text-blue-600'
                          }`}>
                            {record.status === 'Recycled' ? '♻️' : record.status === 'Sent' ? '🚚' : '📦'} {record.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-700">{record.plasticCollected} kg</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No collections recorded yet</p>
              <p className="text-sm text-gray-400 mt-1">Start recording your first collection above!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-green-900 mb-3 text-lg flex items-center gap-2">
            🌍 Your Environmental Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <p className="text-sm text-gray-600">Plastic Collected</p>
              <p className="text-2xl font-bold text-green-700">{totalCollected.toFixed(2)} kg</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <p className="text-sm text-gray-600">CO₂ Emissions Prevented</p>
              <p className="text-2xl font-bold text-green-700">{(totalCollected * 1.8).toFixed(2)} kg</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <p className="text-sm text-gray-600">Trees Equivalent</p>
              <p className="text-2xl font-bold text-green-700">{Math.floor((totalCollected * 1.8) / 20)} 🌳</p>
            </div>
          </div>
          <p className="text-sm text-green-800 mt-4 text-center">
            Keep up the great work! Every kilogram you collect helps protect our planet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
