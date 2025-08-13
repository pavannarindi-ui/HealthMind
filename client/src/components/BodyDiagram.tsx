import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BodyDiagramProps {
  onBodyPartSelect: (bodyPart: string) => void;
  selectedBodyPart?: string;
  className?: string;
}

const bodyParts = [
  { id: "head", name: "Head", x: 50, y: 10, width: 20, height: 15 },
  { id: "neck", name: "Neck", x: 45, y: 25, width: 10, height: 8 },
  { id: "chest", name: "Chest", x: 35, y: 33, width: 30, height: 25 },
  { id: "left-arm", name: "Left Arm", x: 15, y: 33, width: 20, height: 35 },
  { id: "right-arm", name: "Right Arm", x: 65, y: 33, width: 20, height: 35 },
  { id: "abdomen", name: "Abdomen", x: 40, y: 58, width: 20, height: 20 },
  { id: "pelvis", name: "Pelvis", x: 42, y: 78, width: 16, height: 12 },
  { id: "left-leg", name: "Left Leg", x: 35, y: 90, width: 12, height: 35 },
  { id: "right-leg", name: "Right Leg", x: 53, y: 90, width: 12, height: 35 },
  { id: "back", name: "Back", x: 40, y: 33, width: 20, height: 45 },
];

export default function BodyDiagram({ onBodyPartSelect, selectedBodyPart, className = "" }: BodyDiagramProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const handleBodyPartClick = (bodyPart: string) => {
    onBodyPartSelect(bodyPart);
  };

  const getPartColor = (partId: string) => {
    if (selectedBodyPart === partId) {
      return "fill-red-500 stroke-red-600 stroke-2";
    }
    if (hoveredPart === partId) {
      return "fill-blue-200 stroke-blue-400 stroke-2";
    }
    return "fill-slate-200 stroke-slate-400 stroke-1 hover:fill-blue-100 hover:stroke-blue-300";
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* SVG Body Diagram */}
      <svg
        viewBox="0 0 100 140"
        className="w-64 h-96 border-2 border-slate-200 rounded-lg bg-white"
        data-testid="body-diagram-svg"
      >
        {/* Body outline */}
        <defs>
          <pattern id="bodyPattern" patternUnits="userSpaceOnUse" width="100" height="140">
            <rect width="100" height="140" fill="white" />
          </pattern>
        </defs>

        {/* Clickable body parts */}
        {bodyParts.map((part) => (
          <g key={part.id}>
            {part.id === "head" && (
              <ellipse
                cx={part.x}
                cy={part.y + part.height / 2}
                rx={part.width / 2}
                ry={part.height / 2}
                className={`cursor-pointer transition-all ${getPartColor(part.id)}`}
                onClick={() => handleBodyPartClick(part.id)}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                data-testid={`body-part-${part.id}`}
              />
            )}
            
            {part.id === "neck" && (
              <rect
                x={part.x}
                y={part.y}
                width={part.width}
                height={part.height}
                rx="2"
                className={`cursor-pointer transition-all ${getPartColor(part.id)}`}
                onClick={() => handleBodyPartClick(part.id)}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                data-testid={`body-part-${part.id}`}
              />
            )}
            
            {part.id === "chest" && (
              <rect
                x={part.x}
                y={part.y}
                width={part.width}
                height={part.height}
                rx="5"
                className={`cursor-pointer transition-all ${getPartColor(part.id)}`}
                onClick={() => handleBodyPartClick(part.id)}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                data-testid={`body-part-${part.id}`}
              />
            )}
            
            {(part.id === "left-arm" || part.id === "right-arm") && (
              <rect
                x={part.x}
                y={part.y}
                width={part.width}
                height={part.height}
                rx="8"
                className={`cursor-pointer transition-all ${getPartColor(part.id)}`}
                onClick={() => handleBodyPartClick(part.id)}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                data-testid={`body-part-${part.id}`}
              />
            )}
            
            {part.id === "abdomen" && (
              <rect
                x={part.x}
                y={part.y}
                width={part.width}
                height={part.height}
                rx="3"
                className={`cursor-pointer transition-all ${getPartColor(part.id)}`}
                onClick={() => handleBodyPartClick(part.id)}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                data-testid={`body-part-${part.id}`}
              />
            )}
            
            {part.id === "pelvis" && (
              <rect
                x={part.x}
                y={part.y}
                width={part.width}
                height={part.height}
                rx="2"
                className={`cursor-pointer transition-all ${getPartColor(part.id)}`}
                onClick={() => handleBodyPartClick(part.id)}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                data-testid={`body-part-${part.id}`}
              />
            )}
            
            {(part.id === "left-leg" || part.id === "right-leg") && (
              <rect
                x={part.x}
                y={part.y}
                width={part.width}
                height={part.height}
                rx="6"
                className={`cursor-pointer transition-all ${getPartColor(part.id)}`}
                onClick={() => handleBodyPartClick(part.id)}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                data-testid={`body-part-${part.id}`}
              />
            )}
          </g>
        ))}
        
        {/* Labels for hovered parts */}
        {hoveredPart && (
          <text
            x="50"
            y="135"
            textAnchor="middle"
            className="fill-slate-800 text-sm font-medium"
          >
            {bodyParts.find(part => part.id === hoveredPart)?.name}
          </text>
        )}
      </svg>

      {/* Body part selection buttons */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {bodyParts.slice(0, 9).map((part) => (
          <Button
            key={part.id}
            variant={selectedBodyPart === part.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleBodyPartClick(part.id)}
            className="text-xs"
            data-testid={`button-body-part-${part.id}`}
          >
            {part.name}
          </Button>
        ))}
      </div>

      {/* Selected body part display */}
      {selectedBodyPart && (
        <div className="mt-4 text-center">
          <Badge variant="default" className="bg-medical-blue" data-testid="selected-body-part-badge">
            Selected: {bodyParts.find(part => part.id === selectedBodyPart)?.name}
          </Badge>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-slate-600">
        <p>Click on the body diagram or use the buttons to select the affected area</p>
      </div>
    </div>
  );
}
