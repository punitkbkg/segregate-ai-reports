
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Printer, Mail } from "lucide-react";

const ReportGeneration = ({ propertyData, analysisResults }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDFReport = () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: "Cost segregation report has been generated successfully.",
      });
      
      // In a real implementation, this would trigger a PDF download
      console.log("PDF report would be generated with:", { propertyData, analysisResults });
    }, 2000);
  };

  const generateExcelReport = () => {
    toast({
      title: "Excel Export",
      description: "Excel report functionality will be implemented.",
    });
  };

  const emailReport = () => {
    toast({
      title: "Email Report",
      description: "Email functionality will be implemented.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cost Segregation Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Preview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">COST SEGREGATION STUDY</h2>
                <p className="text-gray-600 mt-2">IRS-Compliant Analysis Report</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-3">Property Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Address:</strong> {propertyData.address}</p>
                    <p><strong>City, State:</strong> {propertyData.city}, {propertyData.state} {propertyData.zipCode}</p>
                    <p><strong>Property Type:</strong> {propertyData.propertyType}</p>
                    <p><strong>Year Built:</strong> {propertyData.yearBuilt}</p>
                    <p><strong>Square Footage:</strong> {parseInt(propertyData.squareFootage).toLocaleString()} sq ft</p>
                    <p><strong>Purchase Date:</strong> {propertyData.purchaseDate}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Financial Summary</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Purchase Price:</strong> ${parseInt(propertyData.purchasePrice).toLocaleString()}</p>
                    <p><strong>Land Value:</strong> ${analysisResults.landValue.toLocaleString()}</p>
                    <p><strong>Building Value:</strong> ${analysisResults.buildingValue.toLocaleString()}</p>
                    <p><strong>Property Age:</strong> {analysisResults.summary.propertyAge} years</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Cost Segregation Analysis</h3>
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
                          ${analysisResults.classifications.personalProperty.value.toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {analysisResults.classifications.personalProperty.percentage.toFixed(1)}%
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">5 years</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ${analysisResults.classifications.personalProperty.annualDepreciation.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Land Improvements (15-Year)</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ${analysisResults.classifications.landImprovements.value.toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {analysisResults.classifications.landImprovements.percentage.toFixed(1)}%
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">15 years</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ${analysisResults.classifications.landImprovements.annualDepreciation.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          Real Property ({analysisResults.classifications.realProperty.depreciationPeriod}-Year)
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ${analysisResults.classifications.realProperty.value.toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {analysisResults.classifications.realProperty.percentage.toFixed(1)}%
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {analysisResults.classifications.realProperty.depreciationPeriod} years
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ${analysisResults.classifications.realProperty.annualDepreciation.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="bg-gray-50 font-semibold">
                        <td className="border border-gray-300 px-4 py-2">Total</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ${analysisResults.buildingValue.toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">100.0%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ${analysisResults.summary.totalAnnualDepreciation.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Tax Benefits Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>First-Year Bonus Depreciation:</strong></p>
                    <p className="text-lg font-bold text-green-600">
                      ${analysisResults.summary.firstYearBenefit.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p><strong>Estimated Annual Tax Savings:</strong></p>
                    <p className="text-lg font-bold text-green-600">
                      ${analysisResults.summary.estimatedTaxSavings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={generatePDFReport} 
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Download PDF Report"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={generateExcelReport}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Export to Excel
              </Button>
              
              <Button 
                variant="outline" 
                onClick={emailReport}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email Report
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGeneration;
