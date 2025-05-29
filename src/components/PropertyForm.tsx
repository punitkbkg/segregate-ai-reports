
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Home, MessageCircle } from "lucide-react";

const PropertyForm = ({ onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    address: "",
    propertyType: "",
    squareFootage: "",
    yearBuilt: "",
    bedrooms: "",
    bathrooms: "",
    lotSize: "",
    description: ""
  });

  const [missingFields, setMissingFields] = useState([]);
  const [showTaxChat, setShowTaxChat] = useState(false);
  const [taxData, setTaxData] = useState(null);

  const requiredFields = ["address", "propertyType", "squareFootage", "yearBuilt"];

  const validateForm = () => {
    const missing = requiredFields.filter(field => !formData[field]);
    setMissingFields(missing);
    return missing.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (missingFields.includes(field)) {
      setMissingFields(prev => prev.filter(f => f !== field));
    }
  };

  const handleBasicFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Missing Required Information",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }

    setShowTaxChat(true);
    toast({
      title: "Property Details Saved",
      description: "Now let's gather some tax information through our chat assistant.",
    });
  };

  const handleTaxDataComplete = (data) => {
    setTaxData(data);
    const completeData = { ...formData, ...data };
    onSubmit(completeData);
    
    toast({
      title: "All Information Collected",
      description: "Property and tax information saved successfully. Proceeding to analysis.",
    });
  };

  if (showTaxChat) {
    return <TaxChatbot onComplete={handleTaxDataComplete} propertyData={formData} />;
  }

  return (
    <form onSubmit={handleBasicFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Address Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Property Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="address">Full Property Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Main Street, City, State 12345"
                className={missingFields.includes("address") ? "border-red-500" : ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Property Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                <SelectTrigger className={missingFields.includes("propertyType") ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="mixed-use">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="squareFootage">Square Footage *</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={formData.squareFootage}
                  onChange={(e) => handleInputChange("squareFootage", e.target.value)}
                  placeholder="2500"
                  className={missingFields.includes("squareFootage") ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label htmlFor="yearBuilt">Year Built *</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                  placeholder="2020"
                  className={missingFields.includes("yearBuilt") ? "border-red-500" : ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optional Property Features */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Features (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                  placeholder="3"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                  placeholder="2.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lotSize">Lot Size (sq ft)</Label>
              <Input
                id="lotSize"
                type="number"
                value={formData.lotSize}
                onChange={(e) => handleInputChange("lotSize", e.target.value)}
                placeholder="8000"
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Property Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="description">Additional Details</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Any additional details about the property..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {missingFields.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-800 mb-2">Missing Required Fields:</h3>
          <ul className="list-disc list-inside text-red-700">
            {missingFields.map(field => (
              <li key={field} className="capitalize">
                {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button type="submit" className="w-full" size="lg">
        <MessageCircle className="h-4 w-4 mr-2" />
        Continue to Tax Questions
      </Button>
    </form>
  );
};

// Import TaxChatbot component
import TaxChatbot from "./TaxChatbot";

export default PropertyForm;
