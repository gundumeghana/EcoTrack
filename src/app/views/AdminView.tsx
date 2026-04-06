import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dashboard } from '../components/Dashboard';
import { RecyclingCenterForm } from '../components/RecyclingCenterForm';
import { TransportationTracker } from '../components/TransportationTracker';
import { Reports } from '../components/Reports';
import { ComplaintForm } from '../components/ComplaintForm';
import { LayoutDashboard, Building2, Truck, FileText, MessageSquare } from 'lucide-react';

export const AdminView: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 py-3">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Dashboard</span>
            <span className="sm:hidden">📊</span>
          </TabsTrigger>
          <TabsTrigger value="centers" className="flex items-center gap-2 py-3">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Centers</span>
            <span className="sm:hidden">🏭</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2 py-3">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Tracking</span>
            <span className="sm:hidden">🚚</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 py-3">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Reports</span>
            <span className="sm:hidden">📄</span>
          </TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center gap-2 py-3">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Complaints</span>
            <span className="sm:hidden">💬</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <Dashboard />
        </TabsContent>

        <TabsContent value="centers" className="mt-6">
          <RecyclingCenterForm />
        </TabsContent>

        <TabsContent value="tracking" className="mt-6">
          <TransportationTracker />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Reports />
        </TabsContent>

        <TabsContent value="complaints" className="mt-6">
          <ComplaintForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};