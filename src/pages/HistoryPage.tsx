import { History, Download, Trash2, ExternalLink, Image as ImageIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { format } from "date-fns";

const HistoryPage = () => {
  const { history, removeFromHistory } = useAuthStore();

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `snapcut-${name.split(".")[0]}-bg-removed.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      window.open(url, "_blank");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <History size={24} className="text-primary" /> 
            Upload History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and download your previously processed images</p>
        </div>
        <div className="glass-card px-4 py-2 rounded-lg border-primary/10">
          <span className="text-sm font-semibold">{history.length} Images Saved</span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass-card rounded-2xl p-20 text-center border-dashed border-2">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ImageIcon size={28} className="text-muted-foreground/50" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">No history yet</h3>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
            Your processed images will appear here automatically after you remove their backgrounds.
          </p>
          <Button variant="cta" asChild>
            <a href="/dashboard/upload">Upload Your First Image</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {history.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300">
              {/* Preview Area */}
              <div className="aspect-video relative bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] flex items-center justify-center p-4">
                <img 
                  src={item.resultUrl} 
                  alt={item.originalName} 
                  className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => window.open(item.resultUrl, "_blank")}
                    className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
                    title="View Full Size"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button 
                    onClick={() => removeFromHistory(item.id)}
                    className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all shadow-lg"
                    title="Delete from History"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-sm truncate mb-1" title={item.originalName}>
                    {item.originalName}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {format(item.timestamp, "MMM dd, yyyy")}
                    </span>
                    <span>{item.size}</span>
                  </div>
                </div>

                <Button 
                  variant="cta-outline" 
                  className="w-full text-xs h-9" 
                  onClick={() => handleDownload(item.resultUrl, item.originalName)}
                >
                  <Download size={14} className="mr-2" />
                  Download PNG
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
