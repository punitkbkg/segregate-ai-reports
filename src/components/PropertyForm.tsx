
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
    description: "",
    // Additional dynamic fields
    additionalFeature1: "",
    additionalFeature2: "",
    additionalFeature3: ""
  });

  const [missingFields, setMissingFields] = useState([]);
  const [showTaxChat, setShowTaxChat] = useState(false);
  const [taxData, setTaxData] = useState(null);

  const requiredFields = ["address", "propertyType", "squareFootage", "yearBuilt"];

  // Dynamic additional features based on property type
  const getAdditionalFeatures = (propertyType) => {
    switch (propertyType) {
      case "residential":
        return [
          { key: "bedrooms", label: "Bedrooms", type: "number", placeholder: "3" },
          { key: "bathrooms", label: "Bathrooms", type: "number", step: "0.5", placeholder: "2.5" },
          { key: "garageSpaces", label: "Garage Spaces", type: "number", placeholder: "2" }
        ];
      case "commercial":
        return [
          { key: "floors", label: "Number of Floors", type: "number", placeholder: "3" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number", placeholder: "50" },
          { key: "elevators", label: "Number of Elevators", type: "number", placeholder: "2" }
        ];
      case "industrial":
        return [
          { key: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", placeholder: "24" },
          { key: "loadingDocks", label: "Loading Docks", type: "number", placeholder: "4" },
          { key: "craneCapacity", label: "Crane Capacity (tons)", type: "number", placeholder: "10" }
        ];
      case "mixed-use":
        return [
          { key: "commercialUnits", label: "Commercial Units", type: "number", placeholder: "5" },
          { key: "residentialUnits", label: "Residential Units", type: "number", placeholder: "20" },
          { key: "floors", label: "Number of Floors", type: "number", placeholder: "4" }
        ];
      default:
        return [
          { key: "bedrooms", label: "Bedrooms", type: "number", placeholder: "3" },
          { key: "bathrooms", label: "Bathrooms", type: "number", step: "0.5", placeholder: "2.5" },
          { key: "lotSize", label: "Lot Size (sq ft)", type: "number", placeholder: "8000" }
        ];
    }
  };

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

  const additionalFeatures = getAdditionalFeatures(formData.propertyType);

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

        {/* Dynamic Additional Features */}
        {formData.propertyType && (
          <Card>
            <CardHeader>
              <CardTitle>
                {formData.propertyType === "residential" && "Property Features"}
                {formData.propertyType === "commercial" && "Building Specifications"}
                {formData.propertyType === "industrial" && "Facility Details"}
                {formData.propertyType === "mixed-use" && "Unit Configuration"}
                {!["residential", "commercial", "industrial", "mixed-use"].includes(formData.propertyType) && "Additional Features"}
                {" (Optional)"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {additionalFeatures.slice(0, 2).map((feature) => (
                  <div key={feature.key}>
                    <Label htmlFor={feature.key}>{feature.label}</Label>
                    <Input
                      id={feature.key}
                      type={feature.type}
                      step={feature.step}
                      value={formData[feature.key] || ""}
                      onChange={(e) => handleInputChange(feature.key, e.target.value)}
                      placeholder={feature.placeholder}
                    />
                  </div>
                ))}
              </div>

              {additionalFeatures[2] && (
                <div>
                  <Label htmlFor={additionalFeatures[2].key}>{additionalFeatures[2].label}</Label>
                  <Input
                    id={additionalFeatures[2].key}
                    type={additionalFeatures[2].type}
                    step={additionalFeatures[2].step}
                    value={formData[additionalFeatures[2].key] || ""}
                    onChange={(e) => handleInputChange(additionalFeatures[2].key, e.target.value)}
                    placeholder={additionalFeatures[2].placeholder}
                  />
                </div>
              )}

              {/* Lot Size for all property types */}
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
        )}

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
