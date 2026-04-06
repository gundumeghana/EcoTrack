import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin } from 'lucide-react';

interface HeatmapProps {
  areaStats: { area: string; collected: number; recycled: number }[];
}

export const HeatmapVisualization: React.FC<HeatmapProps> = ({ areaStats }) => {
  if (areaStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Waste Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No data available for heatmap</p>
        </CardContent>
      </Card>
    );
  }

  const maxCollected = Math.max(...areaStats.map(a => a.collected));
  const minCollected = Math.min(...areaStats.map(a => a.collected));

  const getHeatColor = (collected: number) => {
    if (maxCollected === minCollected) {
      return { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-900' };
    }

    const normalized = (collected - minCollected) / (maxCollected - minCollected);

    if (normalized > 0.7) {
      return { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-900' };
    } else if (normalized > 0.4) {
      return { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-900' };
    } else {
      return { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-900' };
    }
  };

  const getIntensityLabel = (collected: number) => {
    if (maxCollected === minCollected) return 'Medium';
    
    const normalized = (collected - minCollected) / (maxCollected - minCollected);
    if (normalized > 0.7) return 'High';
    if (normalized > 0.4) return 'Medium';
    return 'Low';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🗺️ Waste Hotspot Heatmap
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Visual representation of waste concentration across areas
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {areaStats
            .sort((a, b) => b.collected - a.collected)
            .map((area) => {
              const colors = getHeatColor(area.collected);
              const intensity = getIntensityLabel(area.collected);
              
              return (
                <div
                  key={area.area}
                  className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 transition-all hover:scale-105 cursor-pointer`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className={`h-4 w-4 ${colors.text}`} />
                    <h3 className={`font-semibold ${colors.text} text-sm`}>{area.area}</h3>
                  </div>
                  <div className={`text-2xl font-bold ${colors.text} mb-1`}>
                    {area.collected.toFixed(1)} kg
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={colors.text}>Intensity: {intensity}</span>
                    <span className="text-gray-600">
                      {area.collected > 0 ? ((area.recycled / area.collected) * 100).toFixed(0) : 0}% recycled
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Intensity Legend:</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded"></div>
              <span className="text-xs text-gray-600">Low Waste</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border-2 border-orange-400 rounded"></div>
              <span className="text-xs text-gray-600">Medium Waste</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
              <span className="text-xs text-gray-600">High Waste</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
