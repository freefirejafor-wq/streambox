import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useGetAnimeEmbed, useGetMovieEmbed } from "@workspace/api-client-react";
import { ArrowLeft, Loader2, AlertCircle, Server, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WatchPlayer() {
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);

  const isAnime = location.includes("/watch/anime");
  const isMovie = location.includes("/watch/movie");

  const malId = searchParams.get("malId") ? parseInt(searchParams.get("malId")!, 10) : null;
  const ep = searchParams.get("ep") ? parseInt(searchParams.get("ep")!, 10) : null;
  const movieId = searchParams.get("id") ? parseInt(searchParams.get("id")!, 10) : null;

  const [selectedSourceIdx, setSelectedSourceIdx] = useState(0);
  const [showSources, setShowSources] = useState(false);

  const { data: animeEmbed, isLoading: loadingAnime, error: animeErr } = useGetAnimeEmbed(
    { malId: malId!, ep: ep || 1 },
    { query: { enabled: isAnime && !!malId, queryKey: ["embed-anime", malId, ep] } }
  );

  const { data: movieEmbed, isLoading: loadingMovie, error: movieErr } = useGetMovieEmbed(
    movieId!,
    { query: { enabled: isMovie && !!movieId, queryKey: ["embed-movie", movieId] } }
  );

  const isLoading = isAnime ? loadingAnime : loadingMovie;
  const embedData = isAnime ? animeEmbed : movieEmbed;
  const sources = embedData?.sources ?? [];
  const embedUrl = sources[selectedSourceIdx]?.url ?? embedData?.embedUrl;
  const error = isAnime ? animeErr : movieErr;

  const handleBack = () => {
    if (isAnime && malId) setLocation(`/anime/${malId}`);
    else if (isMovie && movieId) setLocation(`/movies/${movieId}`);
    else setLocation("/");
  };

  const handleSourceChange = (idx: number) => {
    setSelectedSourceIdx(idx);
    setShowSources(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-4 bg-black/90 border-b border-white/5 shrink-0 z-10">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-white hover:bg-white/10 rounded-full"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="font-display font-semibold text-white/80 text-sm">
          {isAnime ? `Episode ${ep || 1}` : "Movie"}
        </div>

        {/* Source Switcher */}
        {!isLoading && !error && sources.length > 1 && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSources(v => !v)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-full flex items-center gap-2"
            >
              <Server className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs">{sources[selectedSourceIdx]?.label ?? "Server 1"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSources ? "rotate-180" : ""}`} />
            </Button>

            {showSources && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                <div className="px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5">
                  Choose Server
                </div>
                {sources.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSourceChange(idx)}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                      selectedSourceIdx === idx
                        ? "bg-primary/20 text-primary font-semibold"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${selectedSourceIdx === idx ? "bg-primary" : "bg-white/20"}`} />
                    {src.label}
                  </button>
                ))}
                <div className="px-4 py-2 text-[10px] text-white/30 border-t border-white/5">
                  Switch server if video doesn't load
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Player */}
      <div className="flex-1 w-full bg-black relative flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center text-primary gap-4">
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="text-white/50 animate-pulse text-sm">Loading stream...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center max-w-md text-center px-6">
            <AlertCircle className="w-16 h-16 mb-4 text-destructive/60" />
            <h2 className="text-2xl font-bold text-white mb-2">Source Unavailable</h2>
            <p className="text-muted-foreground mb-6 text-sm">Try a different server or go back.</p>
            <Button onClick={handleBack} variant="outline" className="border-white/10 text-white">
              Go Back
            </Button>
          </div>
        ) : embedUrl ? (
          <iframe
            key={embedUrl}
            src={embedUrl}
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            className="w-full h-full border-none"
            title="Video Player"
          />
        ) : (
          <div className="text-white/50">No source found</div>
        )}
      </div>

      {/* Bottom bar — episode nav for anime */}
      {isAnime && !isLoading && !error && embedUrl && (
        <div className="h-14 bg-black border-t border-white/5 flex items-center justify-between px-6 shrink-0">
          <span className="text-white/40 text-sm">Ep {ep || 1}</span>
          <div className="flex gap-2">
            {ep && ep > 1 && (
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-full"
                onClick={() => { setSelectedSourceIdx(0); setLocation(`/watch/anime?malId=${malId}&ep=${ep - 1}`); }}
              >
                ← Prev Ep
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-full"
              onClick={() => { setSelectedSourceIdx(0); setLocation(`/watch/anime?malId=${malId}&ep=${(ep || 1) + 1}`); }}
            >
              Next Ep →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
