
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Calculator, FileText, Download, Loader2 } from "lucide-react";
import { TaxData, TakeoffsData, PropertyType } from "./TaxChatbot/types";

interface CostAllocationReportProps {
  taxData: TaxData;
  takeoffsData: TakeoffsData;
  propertyData: { propertyType?: PropertyType };
  onReportGenerated: (reportData: any) => void;
}

const CostAllocationReport = ({ taxData, takeoffsData, propertyData, onReportGenerated }: CostAllocationReportProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [reportData, setReportData] = useState(null);

  const calculateCostAllocation = () => {
    const depreciableBasis = parseInt(taxData.depreciableBasis || '0');
    const propertyType = propertyData.propertyType || 'residential';
    
    // Cost segregation percentages based on property type and components
    let personalPropertyPercentage = 0;
    let landImprovementsPercentage = 0;
    let realPropertyPercentage = 0;

    // Calculate percentages based on property type and takeoffs data
    if (propertyType === 'residential') {
      personalPropertyPercentage = 15; // Appliances, fixtures, etc.
      landImprovementsPercentage = 10; // Landscaping, driveways, fencing
      realPropertyPercentage = 75; // Building structure
    } else if (propertyType === 'commercial') {
      personalPropertyPercentage = 25; // Equipment, specialized systems
      landImprovementsPercentage = 15; // Parking lots, landscaping
      realPropertyPercentage = 60; // Building structure
    } else if (propertyType === 'industrial') {
      personalPropertyPercentage = 35; // Machinery, specialized equipment
      landImprovementsPercentage = 20; // Site improvements, loading docks
      realPropertyPercentage = 45; // Building structure
    } else if (propertyType === 'mixed-use') {
      personalPropertyPercentage = 20; // Mixed equipment and fixtures
      landImprovementsPercentage = 12; // Site improvements
      realPropertyPercentage = 68; // Building structure
    }

    // Adjust percentages based on specific takeoffs data
    if (takeoffsData.specialEquipment) {
      personalPropertyPercentage += 5;
      realPropertyPercentage -= 5;
    }
    if (takeoffsData.hvacSystemType?.includes('specialized') || takeoffsData.hvacSystemType?.includes('industrial')) {
      personalPropertyPercentage += 3;
      realPropertyPercentage -= 3;
    }
    if (takeoffsData.electricalSystemType?.includes('high voltage') || takeoffsData.electricalSystemType?.includes('emergency')) {
      personalPropertyPercentage += 2;
      realPropertyPercentage -= 2;
    }

    const personalPropertyValue = Math.round(depreciableBasis * (personalPropertyPercentage / 100));
    const landImprovementsValue = Math.round(depreciableBasis * (landImprovementsPercentage / 100));
    const realPropertyValue = depreciableBasis - personalPropertyValue - landImprovementsValue;

    return {
      personalProperty: {
        value: personalPropertyValue,
        percentage: personalPropertyPercentage,
        depreciationPeriod: 5,
        annualDepreciation: Math.round(personalPropertyValue / 5)
      },
      landImprovements: {
        value: landImprovementsValue,
        percentage: landImprovementsPercentage,
        depreciationPeriod: 15,
        annualDepreciation: Math.round(landImprovementsValue / 15)
      },
      realProperty: {
        value: realPropertyValue,
        percentage: (realPropertyValue / depreciableBasis) * 100,
        depreciationPeriod: propertyType === 'residential' ? 27.5 : 39,
        annualDepreciation: Math.round(realPropertyValue / (propertyType === 'residential' ? 27.5 : 39))
      }
    };
  };

  const generateDetailedReport = () => {
    const costAllocation = calculateCostAllocation();
    const depreciableBasis = parseInt(taxData.depreciableBasis || '0');
    const purchasePrice = parseInt(taxData.purchasePrice || '0');
    const landValue = purchasePrice - depreciableBasis;

    // Calculate tax benefits
    const firstYearBenefit = costAllocation.personalProperty.annualDepreciation + 
                           Math.round(costAllocation.landImprovements.annualDepreciation * 0.5); // Bonus depreciation
    
    const taxRate = parseFloat(taxData.taxBracket?.match(/(\d+)%/)?.[1] || '24') / 100;
    const estimatedTaxSavings = Math.round(firstYearBenefit * taxRate);

    return {
      summary: {
        depreciableBasis,
        purchasePrice,
        landValue,
        propertyType: propertyData.propertyType,
        totalAnnualDepreciation: costAllocation.personalProperty.annualDepreciation + 
                               costAllocation.landImprovements.annualDepreciation + 
                               costAllocation.realProperty.annualDepreciation,
        firstYearBenefit,
        estimatedTaxSavings
      },
      costAllocation,
      takeoffsBreakdown: {
        foundation: takeoffsData.foundationMaterial,
        walls: takeoffsData.wallMaterial,
        roofing: takeoffsData.roofMaterial,
        hvac: takeoffsData.hvacSystemType,
        electrical: takeoffsData.electricalSystemType,
        flooring: takeoffsData.flooringTypes,
        lighting: takeoffsData.lightingTypes,
        specialSystems: takeoffsData.specialEquipment || takeoffsData.specialtySystemsDetails
      },
      taxInformation: {
        placedInService: taxData.placedInServiceDate,
        propertyUse: taxData.propertyUse,
        acquisitionMethod: taxData.acquisitionMethod,
        improvementCosts: parseInt(taxData.improvementCosts || '0'),
        taxBracket: taxData.taxBracket
      }
    };
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate report generation progress
    const progressSteps = [
      { step: 20, message: "Analyzing property takeoffs..." },
      { step: 40, message: "Calculating cost allocations..." },
      { step: 60, message: "Applying depreciation schedules..." },
      { step: 80, message: "Computing tax benefits..." },
      { step: 100, message: "Finalizing report..." }
    ];

    for (const { step, message } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(step);
      toast({
        title: "Generating Report",
        description: message,
      });
    }

    const report = generateDetailedReport();
    setReportData(report);
    onReportGenerated(report);
    setIsGenerating(false);

    toast({
      title: "Report Generated Successfully",
      description: "Your comprehensive cost segregation report is ready for review.",
    });
  };

  if (reportData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cost Allocation Report Generated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Report Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p><strong>Total Depreciable Basis:</strong></p>
                  <p className="text-lg font-bold">${reportData.summary.depreciableBasis.toLocaleString()}</p>
                </div>
                <div>
                  <p><strong>First-Year Tax Benefit:</strong></p>
                  <p className="text-lg font-bold text-green-600">${reportData.summary.firstYearBenefit.toLocaleString()}</p>
                </div>
                <div>
                  <p><strong>Estimated Tax Savings:</strong></p>
                  <p className="text-lg font-bold text-green-600">${reportData.summary.estimatedTaxSavings.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Asset Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Value</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Percentage</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Depreciation Period</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Annual Depreciation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Personal Property (5-Year)</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${reportData.costAllocation.personalProperty.value.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {reportData.costAllocation.personalProperty.percentage.toFixed(1)}%
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">5 years</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${reportData.costAllocation.personalProperty.annualDepreciation.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Land Improvements (15-Year)</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${reportData.costAllocation.landImprovements.value.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {reportData.costAllocation.landImprovements.percentage.toFixed(1)}%
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">15 years</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${reportData.costAllocation.landImprovements.annualDepreciation.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      Real Property ({reportData.costAllocation.realProperty.depreciationPeriod}-Year)
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${reportData.costAllocation.realProperty.value.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {reportData.costAllocation.realProperty.percentage.toFixed(1)}%
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {reportData.costAllocation.realProperty.depreciationPeriod} years
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${reportData.costAllocation.realProperty.annualDepreciation.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-4">
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
              <Button variant="outline" onClick={() => setReportData(null)}>
                Generate New Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Generate Cost Allocation Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Ready to Generate Report</h3>
            <p className="text-blue-700 text-sm">
              Based on the tax information and property takeoffs you've provided, we can now generate 
              a comprehensive cost segregation report with detailed asset classifications and depreciation schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Tax Data Collected:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Depreciable Basis: ${parseInt(taxData.depreciableBasis || '0').toLocaleString()}</li>
                <li>• Property Use: {taxData.propertyUse || 'Not specified'}</li>
                <li>• Tax Bracket: {taxData.taxBracket || 'Not specified'}</li>
                <li>• Placed in Service: {taxData.placedInServiceDate || 'Not specified'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Property Takeoffs Collected:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Foundation: {takeoffsData.foundationMaterial || 'Not specified'}</li>
                <li>• Wall Construction: {takeoffsData.wallMaterial || 'Not specified'}</li>
                <li>• HVAC System: {takeoffsData.hvacSystemType || 'Not specified'}</li>
                <li>• Electrical: {takeoffsData.electricalSystemType || 'Not specified'}</li>
              </ul>
            </div>
          </div>

          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Generating cost allocation report...</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
            className="w-full" 
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Generate Cost Allocation Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostAllocationReport;
