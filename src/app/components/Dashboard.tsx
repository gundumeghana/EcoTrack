import React from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Recycle, Trash2, TrendingUp, AlertTriangle, Leaf, Activity, MapPin } from 'lucide-react';
import { HeatmapVisualization } from './HeatmapVisualization';

export const Dashboard: React.FC = () => {
  const { getStats, getAreaStats, collectionRecords } = useData();
  const stats = getStats();
  const areaStats = getAreaStats();

  // Color coding for efficiency
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency < 50) return { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500', label: 'Critical' };
    if (efficiency < 70) return { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'text-yellow-500', label: 'Warning' };
    return { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500', label: 'Excellent' };
  };

  const efficiencyColors = getEfficiencyColor(stats.recyclingEfficiency);

  // Smart Alert Logic
  const showAlert = stats.recyclingEfficiency < 70;
  const alertSeverity = stats.recyclingEfficiency < 50 ? 'critical' : 'warning';

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6'];

  // Pie chart data: Recycled vs Pending
  const pieData = [
    { name: 'Recycled', value: parseFloat(stats.totalRecycled.toFixed(2)) },
    { name: 'Pending', value: parseFloat(stats.totalPending.toFixed(2)) },
  ].filter(item => item.value > 0); // Filter out zero values

  // Find top waste area
  const topWasteArea = areaStats.length > 0 
    ? areaStats.reduce((max, area) => area.collected > max.collected ? area : max, areaStats[0])
    : null;

  // Environmental impact calculations
  const co2Saved = stats.totalRecycled * 1.8; // 1 kg plastic = ~1.8 kg CO2
  const landfillSaved = stats.totalRecycled * 0.65; // 1 kg plastic = ~0.65 m³ landfill

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 EcoTrack Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time monitoring of plastic waste collection and recycling</p>
      </div>

      {/* Smart Alert */}
      {showAlert && (
        <Alert className={`${alertSeverity === 'critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}`}>
          <AlertTriangle className={`h-5 w-5 ${alertSeverity === 'critical' ? 'text-red-600' : 'text-yellow-600'}`} />
          <AlertDescription className={alertSeverity === 'critical' ? 'text-red-800' : 'text-yellow-800'}>
            <span className="font-semibold">
              ⚠️ Recycling efficiency is {alertSeverity === 'critical' ? 'critically low' : 'below target'} ({stats.recyclingEfficiency.toFixed(1)}%).
            </span>
            <span className="ml-1">Immediate action required to improve recycling rates.</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards with Color Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <Trash2 className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalCollected.toFixed(2)} kg</div>
            <p className="text-xs text-gray-600 mt-1">Plastic waste collected</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recycled</CardTitle>
            <Recycle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.totalRecycled.toFixed(2)} kg</div>
            <p className="text-xs text-gray-600 mt-1">Successfully recycled</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Waste</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.totalPending.toFixed(2)} kg</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting recycling</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${efficiencyColors.bg} ${
          stats.recyclingEfficiency < 50 ? 'border-l-red-500' : 
          stats.recyclingEfficiency < 70 ? 'border-l-yellow-500' : 'border-l-green-500'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Activity className={`h-5 w-5 ${efficiencyColors.icon}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${efficiencyColors.text}`}>
              {stats.recyclingEfficiency.toFixed(1)}%
            </div>
            <p className={`text-xs mt-1 font-medium ${efficiencyColors.text}`}>
              {stats.recyclingEfficiency < 50 ? '🔴 Critical' : 
               stats.recyclingEfficiency < 70 ? '🟡 Warning' : '🟢 Excellent'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Waste Area */}
      {topWasteArea && (
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">Top Waste Area</p>
                  <p className="text-2xl font-bold text-red-900">{topWasteArea.area}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-600">{topWasteArea.collected.toFixed(1)} kg</p>
                <p className="text-sm text-gray-600">
                  {((topWasteArea.recycled / topWasteArea.collected) * 100).toFixed(0)}% recycled
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Heatmap Visualization */}
      <HeatmapVisualization areaStats={areaStats} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Area vs Collected vs Recycled */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Area-wise Collection & Recycling</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={areaStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" fill="#3b82f6" name="Collected (kg)" />
                <Bar dataKey="recycled" fill="#10b981" name="Recycled (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart: Collected vs Recycled vs Pending */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Waste Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent, value }) => `${name}: ${value} kg (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={`pie-cell-${entry.name}`} fill={entry.name === 'Recycled' ? COLORS[0] : COLORS[1]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-gray-500">
                <p>No data available for chart</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact - Upgraded */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            🌍 Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">♻️ Plastic Recycled</p>
              <p className="text-3xl font-bold text-green-700">{stats.totalRecycled.toFixed(2)} kg</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">💨 CO₂ Emissions Saved</p>
              <p className="text-3xl font-bold text-green-700">{co2Saved.toFixed(2)} kg</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">🗑️ Landfill Space Saved</p>
              <p className="text-3xl font-bold text-green-700">{landfillSaved.toFixed(2)} m³</p>
            </div>
          </div>
          <div className="bg-green-100 rounded-lg p-4">
            <p className="text-green-900 font-medium text-center">
              🌱 You saved {co2Saved.toFixed(2)} kg CO₂ emissions by recycling {stats.totalRecycled.toFixed(2)} kg of plastic waste!
            </p>
            <p className="text-green-800 text-sm text-center mt-2">
              This is equivalent to planting {Math.floor(co2Saved / 20)} trees and removing pollution from our environment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};