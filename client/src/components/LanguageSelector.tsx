import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation, languages, Language } from "@/lib/i18n";

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" data-testid="language-selector">
          <Globe className="h-4 w-4 mr-2" />
          {languages.find(l => l.code === language)?.nativeName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className={language === lang.code ? "bg-accent" : ""}
            data-testid={`language-option-${lang.code}`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}