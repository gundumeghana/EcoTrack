import React from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FileText, TrendingUp, Download } from 'lucide-react';
import { toast } from 'sonner';

export const Reports: React.FC = () => {
  const { getStats, getAreaStats, dailyLogs, collectionRecords } = useData();
  const stats = getStats();
  const areaStats = getAreaStats();

  // Prepare daily trend data
  const dailyTrendData = dailyLogs
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((log, index) => ({
      id: `${log.date}-${index}`, // Add unique ID
      date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      collected: log.totalCollected,
      recycled: log.totalRecycled,
    }));

  // Download Report as CSV (Mock)
  const downloadCSV = () => {
    let csvContent = "Area,Collected (kg),Recycled (kg),Pending (kg),Efficiency (%)\n";
    
    areaStats.forEach(area => {
      const pending = area.collected - area.recycled;
      const efficiency = area.collected > 0 ? (area.recycled / area.collected) * 100 : 0;
      csvContent += `${area.area},${area.collected.toFixed(2)},${area.recycled.toFixed(2)},${pending.toFixed(2)},${efficiency.toFixed(1)}\n`;
    });

    // Add summary
    csvContent += `\nSummary\n`;
    csvContent += `Total Collected,${stats.totalCollected.toFixed(2)}\n`;
    csvContent += `Total Recycled,${stats.totalRecycled.toFixed(2)}\n`;
    csvContent += `Total Pending,${stats.totalPending.toFixed(2)}\n`;
    csvContent += `Overall Efficiency,${stats.recyclingEfficiency.toFixed(1)}%\n`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EcoTrack_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('📥 Report downloaded successfully!');
  };

  // Download Report as PDF (Mock - shows notification)
  const downloadPDF = () => {
    toast.success('📄 PDF report generation started! (Demo mode)');
    // In a real app, you would use a library like jsPDF or html2pdf
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📊 Recycling Reports</h2>
          <p className="text-gray-600 mt-1">Comprehensive summary of collection and recycling activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
          <Button onClick={downloadPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalCollected.toFixed(2)} kg</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Recycled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.totalRecycled.toFixed(2)} kg</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.totalPending.toFixed(2)} kg</div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${
          stats.recyclingEfficiency < 50 ? 'border-l-red-500' :
          stats.recyclingEfficiency < 70 ? 'border-l-yellow-500' : 'border-l-green-500'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Efficiency Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              stats.recyclingEfficiency < 50 ? 'text-red-600' :
              stats.recyclingEfficiency < 70 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {stats.recyclingEfficiency.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle>📈 Total Collected vs Recycled Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">Total Collected</span>
                  <span className="font-bold text-blue-600">{stats.totalCollected.toFixed(2)} kg</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">Total Recycled</span>
                  <span className="font-bold text-green-600">{stats.totalRecycled.toFixed(2)} kg</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">Difference (Pending)</span>
                  <span className="font-bold text-orange-600">{stats.totalPending.toFixed(2)} kg</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Performance</h3>
              <div className="bg-white rounded-lg p-4">
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Recycling Progress</span>
                    <span className="text-sm font-medium">{stats.recyclingEfficiency.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        stats.recyclingEfficiency < 50 ? 'bg-red-500' :
                        stats.recyclingEfficiency < 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(stats.recyclingEfficiency, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  {stats.recyclingEfficiency >= 70 
                    ? '✅ Excellent recycling performance!' 
                    : stats.recyclingEfficiency >= 50
                    ? '⚠️ Moderate performance. Room for improvement.'
                    : '🔴 Low recycling rate. Immediate action needed.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Trend Chart */}
      {dailyTrendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Collection & Recycling Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="collected" stroke="#3b82f6" strokeWidth={3} name="Collected (kg)" />
                <Line type="monotone" dataKey="recycled" stroke="#10b981" strokeWidth={3} name="Recycled (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Area-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Area-wise Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {areaStats.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead className="text-right">Collected (kg)</TableHead>
                    <TableHead className="text-right">Recycled (kg)</TableHead>
                    <TableHead className="text-right">Pending (kg)</TableHead>
                    <TableHead className="text-right">Efficiency (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areaStats
                    .sort((a, b) => b.collected - a.collected)
                    .map((area) => {
                      const pending = area.collected - area.recycled;
                      const efficiency = area.collected > 0 ? (area.recycled / area.collected) * 100 : 0;
                      return (
                        <TableRow key={area.area}>
                          <TableCell className="font-medium">{area.area}</TableCell>
                          <TableCell className="text-right font-semibold">{area.collected.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-green-600 font-medium">
                            {area.recycled.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right text-orange-600">{pending.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <span className={`font-semibold ${
                              efficiency >= 70 ? 'text-green-600' : 
                              efficiency >= 50 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {efficiency >= 70 ? '🟢' : efficiency >= 50 ? '🟡' : '🔴'} {efficiency.toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available for reporting</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Recent Activity Log (Last 10 Records)</CardTitle>
        </CardHeader>
        <CardContent>
          {collectionRecords.length > 0 ? (
            <div className="space-y-2">
              {collectionRecords
                .sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime())
                .slice(0, 10)
                .map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <span className="font-medium">{record.area}</span> -{' '}
                      <span className="text-gray-600">{record.plasticCollected} kg</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === 'Recycled'
                            ? 'bg-green-100 text-green-700'
                            : record.status === 'Sent'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {record.status === 'Recycled' ? '♻️' : record.status === 'Sent' ? '🚚' : '📦'} {record.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No activity logs yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};