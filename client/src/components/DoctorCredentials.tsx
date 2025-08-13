import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { doctorCredentials } from "@/data/medicalData";

export function DoctorCredentials() {
  const { toast } = useToast();

  const copyCredentials = (licenseNumber: string, pin: string) => {
    navigator.clipboard.writeText(`License: ${licenseNumber}, PIN: ${pin}`);
    toast({
      title: "Credentials Copied",
      description: "Doctor credentials copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-primary">Test Doctor Credentials</h3>
        <p className="text-sm text-muted-foreground">Use these credentials to test the doctor portal</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {doctorCredentials.map((doctor, index) => (
          <Card key={index} className="medical-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                {doctor.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCredentials(doctor.licenseNumber, doctor.pin)}
                  data-testid={`copy-credentials-${index}`}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">License Number:</span>
                <Badge variant="secondary" className="font-mono">
                  {doctor.licenseNumber}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">PIN:</span>
                <Badge variant="secondary" className="font-mono">
                  {doctor.pin}
                </Badge>
              </div>
              <div className="text-xs text-primary mt-2">
                {doctor.specialization}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}