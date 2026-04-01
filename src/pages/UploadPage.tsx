import { useState, useCallback } from "react";
import { Upload, X, Image, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const UploadPage = () => {
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
    setProcessing(true);
    // Simulated processing — will connect to n8n webhook
    await new Promise((r) => setTimeout(r, 2000));
    setResult(preview); // placeholder
    setProcessing(false);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Upload size={24} className="text-primary" />
          Upload Image
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Remove background from your image in seconds</p>
      </div>

      {!file ? (
        /* Upload zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`glass-card rounded-xl border-2 border-dashed p-16 text-center cursor-pointer transition-all ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
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
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-float">
            <Upload size={28} className="text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">Drop your image here</h3>
          <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
          <p className="text-xs text-muted-foreground">JPG, PNG, WEBP • Max 10 MB • Up to 5000×5000px</p>
        </div>
      ) : (
        /* Preview & process */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Image size={16} className="text-primary" /> Original
                </span>
                <button onClick={reset} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
                <img src={preview!} alt="Original" className="max-w-full max-h-full object-contain" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{file.name} • {(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>

            {/* Result */}
            <div className="glass-card rounded-xl p-4">
              <span className="text-sm font-medium flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-accent" /> Result
              </span>
              <div className="aspect-square rounded-lg overflow-hidden bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] flex items-center justify-center">
                {result ? (
                  <img src={result} alt="Result" className="max-w-full max-h-full object-contain" />
                ) : (
                  <p className="text-sm text-muted-foreground">Processing result will appear here</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            {!result ? (
              <Button variant="cta" size="lg" onClick={handleProcess} disabled={processing}>
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Remove Background
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button variant="cta" size="lg">
                  <Download size={18} /> Download PNG
                </Button>
                <Button variant="cta-outline" size="lg" onClick={reset}>
                  Upload Another
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="glass-card rounded-xl p-4 border-destructive/50 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
