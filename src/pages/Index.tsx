
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyForm from "@/components/PropertyForm";
import CostSegregationAnalysis from "@/components/CostSegregationAnalysis";
import ReportGeneration from "@/components/ReportGeneration";
import { Building2, Calculator, FileText } from "lucide-react";

const Index = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [activeTab, setActiveTab] = useState("property");

  console.log("Property data:", propertyData);
  console.log("Analysis results:", analysisResults);

  const handlePropertySubmit = (data) => {
    console.log("Property form submitted:", data);
    setPropertyData(data);
    setActiveTab("analysis");
  };

  const handleAnalysisComplete = (results) => {
    console.log("Analysis completed:", results);
    setAnalysisResults(results);
    setActiveTab("report");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Cost Segregation Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate comprehensive cost segregation reports with automated property analysis and IRS-compliant documentation.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="property" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Property Details
            </TabsTrigger>
            <TabsTrigger value="analysis" disabled={!propertyData} className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Cost Analysis
            </TabsTrigger>
            <TabsTrigger value="report" disabled={!analysisResults} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="property">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>
                  Enter the property details for cost segregation analysis. All required fields must be completed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyForm onSubmit={handlePropertySubmit} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <CostSegregationAnalysis 
              propertyData={propertyData} 
              onAnalysisComplete={handleAnalysisComplete}
            />
          </TabsContent>

          <TabsContent value="report">
            <ReportGeneration 
              propertyData={propertyData}
              analysisResults={analysisResults}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
