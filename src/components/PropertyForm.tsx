
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, DollarSign, Calendar, Home } from "lucide-react";

const PropertyForm = ({ onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    purchasePrice: "",
    purchaseDate: "",
    propertyType: "",
    squareFootage: "",
    yearBuilt: "",
    landValue: "",
    buildingValue: "",
    bedrooms: "",
    bathrooms: "",
    lotSize: "",
    description: ""
  });

  const [missingFields, setMissingFields] = useState([]);

  const requiredFields = [
    "address", "city", "state", "zipCode", "purchasePrice", 
    "purchaseDate", "propertyType", "squareFootage", "yearBuilt"
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Missing Required Information",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }

    console.log("Form validation passed, submitting:", formData);
    onSubmit(formData);
    
    toast({
      title: "Property Data Saved",
      description: "Property information has been saved successfully. Proceeding to cost analysis.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Address Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Property Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Main Street"
                className={missingFields.includes("address") ? "border-red-500" : ""}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="City"
                  className={missingFields.includes("city") ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger className={missingFields.includes("state") ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                placeholder="12345"
                className={missingFields.includes("zipCode") ? "border-red-500" : ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="purchasePrice">Purchase Price *</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                placeholder="500000"
                className={missingFields.includes("purchasePrice") ? "border-red-500" : ""}
              />
            </div>

            <div>
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                className={missingFields.includes("purchaseDate") ? "border-red-500" : ""}
              />
            </div>

            <div>
              <Label htmlFor="landValue">Land Value</Label>
              <Input
                id="landValue"
                type="number"
                value={formData.landValue}
                onChange={(e) => handleInputChange("landValue", e.target.value)}
                placeholder="150000"
              />
            </div>

            <div>
              <Label htmlFor="buildingValue">Building Value</Label>
              <Input
                id="buildingValue"
                type="number"
                value={formData.buildingValue}
                onChange={(e) => handleInputChange("buildingValue", e.target.value)}
                placeholder="350000"
              />
            </div>
          </CardContent>
        </Card>

        {/* Property Characteristics Section */}
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

        {/* Additional Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="description">Property Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Additional details about the property..."
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
        Proceed to Cost Analysis
      </Button>
    </form>
  );
};

export default PropertyForm;
