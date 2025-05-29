
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Calculator, TrendingUp, FileSpreadsheet } from "lucide-react";

const CostSegregationAnalysis = ({ propertyData, onAnalysisComplete }) => {
  const { toast } = useToast();
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const performAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate analysis completion after 3 seconds
    setTimeout(() => {
      const results = calculateCostSegregation(propertyData);
      setAnalysisResults(results);
      setIsAnalyzing(false);
      onAnalysisComplete(results);
      
      toast({
        title: "Analysis Complete",
        description: "Cost segregation analysis has been completed successfully.",
      });
    }, 3000);
  };

  const calculateCostSegregation = (data) => {
    const purchasePrice = parseFloat(data.purchasePrice) || 0;
    const landValue = parseFloat(data.landValue) || purchasePrice * 0.2;
    const buildingValue = parseFloat(data.buildingValue) || purchasePrice - landValue;
    
    // Cost segregation percentages based on property type and age
    const yearBuilt = parseInt(data.yearBuilt);
    const propertyAge = new Date().getFullYear() - yearBuilt;
    
    let personalPropertyPercent = 0.15;
    let landImprovementsPercent = 0.10;
    
    if (data.propertyType === "commercial") {
      personalPropertyPercent = 0.25;
      landImprovementsPercent = 0.15;
    } else if (data.propertyType === "industrial") {
      personalPropertyPercent = 0.35;
      landImprovementsPercent = 0.20;
    }
    
    // Adjust for property age
    if (propertyAge > 20) {
      personalPropertyPercent *= 0.8;
    }

    const personalProperty = buildingValue * personalPropertyPercent;
    const landImprovements = buildingValue * landImprovementsPercent;
    const realProperty = buildingValue - personalProperty - landImprovements;

    // Calculate depreciation schedules
    const personalPropertyDepreciation = personalProperty / 5; // 5-year
    const landImprovementsDepreciation = landImprovements / 15; // 15-year
    const realPropertyDepreciation = realProperty / 39; // 39-year for commercial, 27.5 for residential

    const totalAnnualDepreciation = personalPropertyDepreciation + landImprovementsDepreciation + realPropertyDepreciation;
    const firstYearBenefit = personalPropertyDepreciation + landImprovementsDepreciation;

    return {
      purchasePrice,
      landValue,
      buildingValue,
      classifications: {
        personalProperty: {
          value: personalProperty,
          percentage: (personalProperty / buildingValue) * 100,
          depreciationPeriod: 5,
          annualDepreciation: personalPropertyDepreciation
        },
        landImprovements: {
          value: landImprovements,
          percentage: (landImprovements / buildingValue) * 100,
          depreciationPeriod: 15,
          annualDepreciation: landImprovementsDepreciation
        },
        realProperty: {
          value: realProperty,
          percentage: (realProperty / buildingValue) * 100,
          depreciationPeriod: data.propertyType === "residential" ? 27.5 : 39,
          annualDepreciation: realPropertyDepreciation
        }
      },
      summary: {
        totalAnnualDepreciation,
        firstYearBenefit,
        estimatedTaxSavings: firstYearBenefit * 0.35, // Assuming 35% tax bracket
        propertyAge
      }
    };
  };

  if (!analysisResults && !isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Cost Segregation Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Ready to perform cost segregation analysis for:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">{propertyData.address}</p>
              <p>{propertyData.city}, {propertyData.state} {propertyData.zipCode}</p>
              <p className="text-sm text-gray-600">
                Purchase Price: ${parseInt(propertyData.purchasePrice).toLocaleString()}
              </p>
            </div>
            <Button onClick={performAnalysis} size="lg" className="w-full">
              Start Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyzing Property...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={analysisProgress} className="w-full" />
            <p className="text-center text-gray-600">
              Processing cost segregation analysis... {analysisProgress}%
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">5-Year Property</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${analysisResults.classifications.personalProperty.value.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600">
                {analysisResults.classifications.personalProperty.percentage.toFixed(1)}% of building value
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">15-Year Property</h3>
              <p className="text-2xl font-bold text-green-600">
                ${analysisResults.classifications.landImprovements.value.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">
                {analysisResults.classifications.landImprovements.percentage.toFixed(1)}% of building value
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">
                {analysisResults.classifications.realProperty.depreciationPeriod}-Year Property
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                ${analysisResults.classifications.realProperty.value.toLocaleString()}
              </p>
              <p className="text-sm text-purple-600">
                {analysisResults.classifications.realProperty.percentage.toFixed(1)}% of building value
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Annual Depreciation</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>5-Year Property:</span>
                  <span className="font-medium">
                    ${analysisResults.classifications.personalProperty.annualDepreciation.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>15-Year Property:</span>
                  <span className="font-medium">
                    ${analysisResults.classifications.landImprovements.annualDepreciation.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{analysisResults.classifications.realProperty.depreciationPeriod}-Year Property:</span>
                  <span className="font-medium">
                    ${analysisResults.classifications.realProperty.annualDepreciation.toLocaleString()}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total Annual:</span>
                  <span>${analysisResults.summary.totalAnnualDepreciation.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Tax Benefits</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>First Year Bonus:</span>
                  <span className="font-medium text-green-600">
                    ${analysisResults.summary.firstYearBenefit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax Savings:</span>
                  <span className="font-medium text-green-600">
                    ${analysisResults.summary.estimatedTaxSavings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostSegregationAnalysis;
