import React, { useState, useEffect } from 'react';
import { MapPin, Users, Store, Star, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useBooths } from '../hooks/useApi';

interface Booth {
  id: string;
  boothNumber: string;
  size: {
    width: number;
    length: number;
    area: number;
  };
  category: string;
  price: number;
  status: 'available' | 'reserved' | 'occupied' | 'maintenance';
  exhibitor?: {
    id: string;
    name: string;
    company: string;
    position: string;
    avatar?: string;
  };
  features: Array<{
    name: string;
    description: string;
    included: boolean;
  }>;
  amenities: Array<{
    name: string;
    description: string;
    quantity: number;
  }>;
}

interface FloorPlanProps {
  expoId: string;
  onBoothSelect?: (booth: Booth) => void;
  selectedBoothId?: string;
  isInteractive?: boolean;
}

export const InteractiveFloorPlan: React.FC<FloorPlanProps> = ({
  expoId,
  onBoothSelect,
  selectedBoothId,
  isInteractive = true
}) => {
  const { data: boothsData, isLoading, error } = useBooths(expoId);
  const [hoveredBooth, setHoveredBooth] = useState<string | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');

  const booths = boothsData?.booths || [];

  // Floor plan dimensions (mock data - would come from expo config)
  const floorWidth = 1200;
  const floorHeight = 800;
  const boothSize = 80;

  const getBoothColor = (booth: Booth) => {
    switch (booth.status) {
      case 'available':
        return 'bg-green-100 border-green-300 hover:bg-green-200';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200';
      case 'occupied':
        return 'bg-blue-100 border-blue-300 hover:bg-blue-200';
      case 'maintenance':
        return 'bg-red-100 border-red-300 hover:bg-red-200';
      default:
        return 'bg-gray-100 border-gray-300 hover:bg-gray-200';
    }
  };

  const getBoothPosition = (boothNumber: string) => {
    // Mock positioning logic - would come from actual floor plan data
    const row = parseInt(boothNumber.charAt(0)) - 1;
    const col = parseInt(boothNumber.slice(1)) - 1;
    
    return {
      x: 50 + col * (boothSize + 20),
      y: 50 + row * (boothSize + 20)
    };
  };

  const handleBoothClick = (booth: Booth) => {
    if (!isInteractive) return;
    
    setSelectedBooth(booth);
    onBoothSelect?.(booth);
  };

  const handleBoothHover = (boothId: string | null) => {
    setHoveredBooth(boothId);
  };

  const getBoothTooltip = (booth: Booth) => {
    return (
      <div className="absolute z-50 bg-background border rounded-lg shadow-lg p-3 min-w-48 -translate-x-1/2 -translate-y-full mb-2">
        <div className="flex items-center gap-2 mb-2">
          <Store className="h-4 w-4 text-primary" />
          <span className="font-medium">Booth {booth.boothNumber}</span>
          <Badge variant={booth.status === 'available' ? 'default' : 'secondary'}>
            {booth.status}
          </Badge>
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Size:</span>
            <span>{booth.size.width}m × {booth.size.length}m ({booth.size.area}m²)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Category:</span>
            <span>{booth.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">${booth.price}</span>
          </div>
          
          {booth.exhibitor && (
            <div className="pt-2 border-t">
              <div className="text-muted-foreground text-xs mb-1">Current Exhibitor:</div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-xs">{booth.exhibitor.name}</div>
                  <div className="text-xs text-muted-foreground">{booth.exhibitor.company}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading floor plan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="text-center text-red-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-4" />
            <p>Failed to load floor plan</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Floor Plan Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={viewMode === '2D' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('2D')}
          >
            2D View
          </Button>
          <Button
            variant={viewMode === '3D' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('3D')}
          >
            3D View
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Maintenance</span>
          </div>
        </div>
      </div>

      {/* Floor Plan Canvas */}
      <Card className="w-full overflow-hidden">
        <CardContent className="p-0">
          <div 
            className="relative bg-gradient-to-br from-blue-50 to-indigo-100"
            style={{ width: floorWidth, height: floorHeight }}
          >
            {/* Floor Grid */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Booths */}
            {booths.map((booth) => {
              const position = getBoothPosition(booth.boothNumber);
              const isSelected = selectedBoothId === booth.id;
              const isHovered = hoveredBooth === booth.id;
              
              return (
                <div
                  key={booth.id}
                  className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    getBoothColor(booth)
                  } ${
                    isSelected ? 'ring-4 ring-primary ring-opacity-50 scale-105' : ''
                  } ${
                    isHovered ? 'scale-110 z-10' : 'z-0'
                  }`}
                  style={{
                    left: position.x,
                    top: position.y,
                    width: boothSize,
                    height: boothSize
                  }}
                  onClick={() => handleBoothClick(booth)}
                  onMouseEnter={() => handleBoothHover(booth.id)}
                  onMouseLeave={() => handleBoothHover(null)}
                >
                  {/* Booth Content */}
                  <div className="p-2 h-full flex flex-col items-center justify-center text-center">
                    <div className="font-bold text-sm mb-1">B{booth.boothNumber}</div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {booth.size.area}m²
                    </div>
                    <div className="text-xs font-medium">
                      ${booth.price}
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="absolute top-1 right-1">
                      <div className={`w-2 h-2 rounded-full ${
                        booth.status === 'available' ? 'bg-green-500' :
                        booth.status === 'reserved' ? 'bg-yellow-500' :
                        booth.status === 'occupied' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`} />
                    </div>
                  </div>

                  {/* Tooltip */}
                  {isHovered && getBoothTooltip(booth)}
                </div>
              );
            })}

            {/* Floor Plan Labels */}
            <div className="absolute top-4 left-4 text-sm font-medium text-muted-foreground">
              Floor Plan - {viewMode} View
            </div>
            
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
              Total Booths: {booths.length} | Available: {booths.filter(b => b.status === 'available').length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Booth Details */}
      {selectedBooth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Booth {selectedBooth.boothNumber} Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={selectedBooth.status === 'available' ? 'default' : 'secondary'}>
                        {selectedBooth.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{selectedBooth.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{selectedBooth.size.width}m × {selectedBooth.size.length}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area:</span>
                      <span>{selectedBooth.size.area}m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">${selectedBooth.price}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Features & Amenities</h4>
                  <div className="space-y-2">
                    {selectedBooth.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Star className={`h-3 w-3 ${feature.included ? 'text-yellow-500' : 'text-gray-400'}`} />
                        <span>{feature.name}</span>
                        {!feature.included && <span className="text-muted-foreground">(Not included)</span>}
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedBooth.amenities.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Amenities</h4>
                    <div className="space-y-1">
                      {selectedBooth.amenities.map((amenity, index) => (
                        <div key={index} className="text-sm">
                          <span>{amenity.name}</span>
                          {amenity.quantity > 1 && <span className="text-muted-foreground"> (x{amenity.quantity})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {isInteractive && selectedBooth.status === 'available' && (
              <div className="mt-6 pt-4 border-t">
                <Button className="w-full" size="lg">
                  Book This Booth
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
