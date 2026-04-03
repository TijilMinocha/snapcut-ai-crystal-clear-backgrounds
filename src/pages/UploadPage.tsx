import { useState, useCallback } from "react";
import { Upload, X, Image, Download, Sparkles, Zap, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { Link } from "react-router-dom";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const UploadPage = () => {
  const { credits, useCredit, addToHistory } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndSetFile = useCallback((f: File) => {
    setError(null);
    setResult(null);
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError("Only JPG, PNG, and WEBP files are allowed.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("File must be under 10 MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) validateAndSetFile(f);
    },
    [validateAndSetFile]
  );

  const handleProcess = async () => {
    if (!file) return;
    
    if (credits <= 0) {
      setError("You don't have enough credits. Please upgrade your plan.");
      return;
    }

    setProcessing(true);
    setError(null);
    
    try {
      // Prepare form data for binary file upload
      const formData = new FormData();
      formData.append("image", file);

      // Call the n8n production webhook
      const response = await fetch("https://tm-dev.app.n8n.cloud/webhook/remove-bg-snapcut", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && data.url) {
        setResult(data.url);
        // Only use credit if successful
        useCredit();
        // Add to history
        addToHistory({
          originalName: file.name,
          originalUrl: preview || "",
          resultUrl: data.url,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        });
      } else {
        throw new Error("Invalid response from the server.");
      }
    } catch (err) {
      console.error("Error processing image:", err);
      setError(err instanceof Error ? err.message : "Failed to remove background. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handleDownload = async () => {
    if (!result) return;
    
    try {
      const response = await fetch(result);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `snapcut-${file?.name.split(".")[0] || "image"}-bg-removed.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: try opening in a new tab if blob download fails (e.g., CORS)
      window.open(result, "_blank");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Upload size={24} className="text-primary" />
            Upload Image
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Remove background from your image in seconds</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 border-primary/20">
            <Zap size={16} className="text-primary fill-primary/20" />
            <span className="text-sm font-semibold">{credits} Credits Left</span>
          </div>
          <Button variant="outline" size="sm" asChild className="h-9">
            <Link to="/dashboard/credits">Get More</Link>
          </Button>
        </div>
      </div>

      {!file ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Upload zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`glass-card rounded-xl border-2 border-dashed p-16 text-center cursor-pointer transition-all h-[400px] flex flex-col items-center justify-center ${
                isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-border hover:border-primary/50"
              }`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) validateAndSetFile(f);
                }}
              />
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-float">
                <Upload size={32} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Drop your image here</h3>
              <p className="text-sm text-muted-foreground mb-6">or click to browse your files</p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded bg-muted/50">JPG, PNG, WEBP</span>
                <span className="px-2 py-1 rounded bg-muted/50">Max 10 MB</span>
                <span className="px-2 py-1 rounded bg-muted/50">High Quality</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-accent" />
                Why SnapCut AI?
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Professional edge detection for hair and fur
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Instant processing in under 5 seconds
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  High-resolution transparent PNG output
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-xl p-6 border-accent/20">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-xs text-muted-foreground mb-4">Check our API documentation for batch processing.</p>
              <Button variant="link" className="p-0 h-auto text-accent" asChild>
                <Link to="/api-docs">View API Docs →</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Preview & process */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Original */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <Image size={16} className="text-primary" /> Original Image
                </span>
                <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded">
                  <X size={18} />
                </button>
              </div>
              <div className="glass-card rounded-xl p-2 aspect-square relative group overflow-hidden bg-muted/20 border-primary/10">
                <img src={preview!} alt="Original" className="w-full h-full object-contain rounded-lg" />
                <div className="absolute bottom-4 left-4 right-4 p-3 glass-card rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles size={16} className="text-accent" /> AI Result
                </span>
                {result && (
                  <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Ready</span>
                )}
              </div>
              <div className="glass-card rounded-xl p-2 aspect-square relative bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,transparent_0%_50%)] bg-[length:24px_24px] border-accent/10">
                {result ? (
                  <img src={result} alt="Result" className="w-full h-full object-contain rounded-lg animate-in zoom-in-95 duration-300" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                    {processing ? (
                      <div className="space-y-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                        <p className="text-sm font-medium animate-pulse">AI is working its magic...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Sparkles size={24} className="text-muted-foreground/50" />
                        </div>
                        <p className="text-sm text-muted-foreground">Click the button below to remove background</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {!result ? (
              <Button variant="cta" size="xl" onClick={handleProcess} disabled={processing || credits <= 0} className="min-w-[240px]">
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="mr-2" />
                    Remove Background
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button variant="cta" size="xl" className="min-w-[200px]" onClick={handleDownload}>
                  <Download size={20} className="mr-2" /> Download PNG
                </Button>
                <Button variant="cta-outline" size="xl" onClick={reset} className="min-w-[200px]">
                  Upload Another
                </Button>
              </>
            )}
          </div>
          
          {credits <= 0 && !result && !processing && (
            <p className="text-center text-sm text-destructive font-medium">
              You've run out of credits. <Link to="/dashboard/credits" className="underline">Get more credits</Link> to continue.
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="glass-card rounded-xl p-4 border-destructive/50 bg-destructive/5 text-center animate-in fade-in zoom-in-95">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
