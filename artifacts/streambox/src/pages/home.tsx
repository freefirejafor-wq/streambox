import { useGetAnimeTrending, useGetMoviesTrending, useGetAnimeTop, useGetMoviesTop } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Info, Star, TrendingUp, Film, Tv, Flame, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/content-card";
import { HorizontalScrollRow } from "@/components/horizontal-scroll-row";

function SkeletonRow() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex-none w-[160px] md:w-[200px] aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />
      ))}
    </>
  );
}

export function Home() {
  const { data: trendingAnime, isLoading: loadingTrendingAnime } = useGetAnimeTrending({ limit: 20 });
  const { data: trendingMovies, isLoading: loadingTrendingMovies } = useGetMoviesTrending({ limit: 20 });
  const { data: topAnime, isLoading: loadingTopAnime } = useGetAnimeTop({ limit: 20 });
  const { data: topMovies, isLoading: loadingTopMovies } = useGetMoviesTop({ limit: 20 });

  // Genre-specific rows
  const { data: actionAnime } = useGetAnimeTop({ limit: 20, genre: "Action" });
  const { data: romanceAnime } = useGetAnimeTop({ limit: 20, genre: "Romance" });
  const { data: fantasyAnime } = useGetAnimeTop({ limit: 20, genre: "Fantasy" });
  const { data: thrillerMovies } = useGetMoviesTop({ limit: 20, genre: "Thriller" });
  const { data: comedyMovies } = useGetMoviesTop({ limit: 20, genre: "Comedy" });
  const { data: scifiMovies } = useGetMoviesTop({ limit: 20, genre: "Science Fiction" });

  const heroItem = trendingAnime?.items[0];
  const heroMovie = trendingMovies?.items[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Anime Hero Section */}
      <section className="relative w-full h-[85vh] md:h-[92vh] flex items-center justify-center overflow-hidden">
        {heroItem && heroItem.poster ? (
          <>
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-30"
                style={{ backgroundImage: `url(${heroItem.poster})` }}
              />
              <img
                src={heroItem.poster}
                alt={heroItem.title}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-50 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
            </div>

            <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-20">
              <div className="flex flex-col gap-5 max-w-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30 flex items-center gap-1">
                    <Flame className="w-3 h-3" /> #1 Trending
                  </span>
                  <span className="text-white/60 text-sm font-medium">{heroItem.type} • {heroItem.year}</span>
                  {heroItem.score && (
                    <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                      <Star className="w-3.5 h-3.5 fill-yellow-400" /> {heroItem.score.toFixed(1)}
                    </span>
                  )}
                </div>

                <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-[1.05] tracking-tight text-glow">
                  {heroItem.title_english || heroItem.title}
                </h1>

                {heroItem.synopsis && (
                  <p className="text-base text-white/65 line-clamp-3 leading-relaxed max-w-lg">
                    {heroItem.synopsis}
                  </p>
                )}

                {heroItem.genres && heroItem.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {heroItem.genres.slice(0, 4).map(g => (
                      <span key={g} className="px-3 py-1 rounded-full bg-white/8 text-white/70 text-xs font-medium border border-white/10">
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Link href={`/anime/${heroItem.mal_id}`}>
                    <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 h-13 px-7 text-base font-bold shadow-xl">
                      <Info className="w-5 h-5 mr-2" />
                      More Info
                    </Button>
                  </Link>
                  <Link href={`/watch/anime?malId=${heroItem.mal_id}&ep=1`}>
                    <Button size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white h-13 px-7 text-base font-semibold backdrop-blur-sm">
                      Watch Now
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="hidden md:flex justify-end items-center relative">
                <div className="w-[280px] aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-700 ease-out z-20">
                  <img src={heroItem.poster} alt={heroItem.title} className="w-full h-full object-cover" />
                </div>
                <div className="absolute w-[280px] aspect-[2/3] rounded-2xl bg-primary/20 blur-3xl z-10 translate-x-10 translate-y-10" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-muted animate-pulse" />
        )}
      </section>

      {/* Content Rows */}
      <div className="flex flex-col gap-2 -mt-24 z-20 relative pb-24">

        {/* Trending Anime */}
        <HorizontalScrollRow title="🔥 Trending Anime">
          {loadingTrendingAnime ? <SkeletonRow /> : (
            trendingAnime?.items.slice(1).map(item => (
              <div key={`ta-${item.mal_id}`} className="flex-none w-[160px] md:w-[200px] snap-start">
                <ContentCard id={item.mal_id} type="anime" title={item.title_english || item.title}
                  poster={item.poster} score={item.score} episodes={item.episodes} year={item.year} status={item.status} />
              </div>
            ))
          )}
        </HorizontalScrollRow>

        {/* Trending Movies */}
        <HorizontalScrollRow title="🎬 Trending Movies">
          {loadingTrendingMovies ? <SkeletonRow /> :
            trendingMovies && trendingMovies.items.length > 0 ? (
              trendingMovies.items.map(item => (
                <div key={`tm-${item.tmdb_id}`} className="flex-none w-[160px] md:w-[200px] snap-start">
                  <ContentCard id={item.tmdb_id} type="movie" title={item.title}
                    poster={item.poster} score={item.rating} year={item.year} />
                </div>
              ))
            ) : (
              <div className="text-muted-foreground px-4 py-8">Movies loading...</div>
            )
          }
        </HorizontalScrollRow>

        {/* Movie Hero Banner */}
        {heroMovie && heroMovie.poster && (
          <div className="container mx-auto px-4 my-4">
            <div className="relative w-full rounded-3xl overflow-hidden h-[280px] md:h-[360px] border border-white/5">
              <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{ backgroundImage: `url(${heroMovie.backdrop || heroMovie.poster})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-0 flex items-center px-8 md:px-14">
                <div className="max-w-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Film className="w-4 h-4 text-primary" />
                    <span className="text-primary text-xs font-bold uppercase tracking-widest">Movie Spotlight</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-3 leading-tight">{heroMovie.title}</h2>
                  <div className="flex items-center gap-3 mb-5">
                    {heroMovie.rating && (
                      <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
                        <Star className="w-4 h-4 fill-yellow-400" /> {heroMovie.rating.toFixed(1)}
                      </span>
                    )}
                    {heroMovie.year && <span className="text-white/50 text-sm">{heroMovie.year}</span>}
                  </div>
                  <Link href={`/movies/${heroMovie.tmdb_id}`}>
                    <Button className="rounded-full bg-primary hover:bg-primary/90 text-white px-8">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Rated Anime */}
        <HorizontalScrollRow title="⭐ Top Rated Anime">
          {loadingTopAnime ? <SkeletonRow /> : (
            topAnime?.items.map(item => (
              <div key={`topa-${item.mal_id}`} className="flex-none w-[160px] md:w-[200px] snap-start">
                <ContentCard id={item.mal_id} type="anime" title={item.title_english || item.title}
                  poster={item.poster} score={item.score} episodes={item.episodes} />
              </div>
            ))
          )}
        </HorizontalScrollRow>

        {/* Top Rated Movies */}
        <HorizontalScrollRow title="🏆 Top Rated Movies">
          {loadingTopMovies ? <SkeletonRow /> :
            topMovies && topMovies.items.length > 0 ? (
              topMovies.items.map(item => (
                <div key={`topm-${item.tmdb_id}`} className="flex-none w-[160px] md:w-[200px] snap-start">
                  <ContentCard id={item.tmdb_id} type="movie" title={item.title}
                    poster={item.poster} score={item.rating} year={item.year} />
                </div>
              ))
            ) : null
          }
        </HorizontalScrollRow>

        {/* Action Anime */}
        {actionAnime && actionAnime.items.length > 0 && (
          <HorizontalScrollRow title="⚔️ Action Anime">
            {actionAnime.items.map(item => (
              <div key={`act-${item.mal_id}`} className="flex-none w-[160px] md:w-[200px] snap-start">
                <ContentCard id={item.mal_id} type="anime" title={item.title_english || item.title}
                  poster={item.poster} score={item.score} episodes={item.episodes} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}

        {/* Thriller Movies */}
        {thrillerMovies && thrillerMovies.items.length > 0 && (
          <HorizontalScrollRow title="🔪 Thriller Movies">
            {thrillerMovies.items.map(item => (
              <div key={`thr-${item.tmdb_id}`} className="flex-none w-[160px] md:w-[200px] snap-start">
                <ContentCard id={item.tmdb_id} type="movie" title={item.title}
                  poster={item.poster} score={item.rating} year={item.year} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}

        {/* Fantasy Anime */}
        {fantasyAnime && fantasyAnime.items.length > 0 && (
          <HorizontalScrollRow title="🧙 Fantasy Anime">
            {fantasyAnime.items.map(item => (
              <div key={`fan-${item.mal_id}`} className="flex-none w-[160px] md:w-[200px] snap-start">
                <ContentCard id={item.mal_id} type="anime" title={item.title_english || item.title}
                  poster={item.poster} score={item.score} episodes={item.episodes} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}

        {/* Sci-Fi Movies */}
        {scifiMovies && scifiMovies.items.length > 0 && (
          <HorizontalScrollRow title="🚀 Sci-Fi Movies">
            {scifiMovies.items.map(item => (
              <div key={`sci-${item.tmdb_id}`} className="flex-none w-[160px] md:w-[200px] snap-start">
                <ContentCard id={item.tmdb_id} type="movie" title={item.title}
                  poster={item.poster} score={item.rating} year={item.year} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}

        {/* Romance Anime */}
        {romanceAnime && romanceAnime.items.length > 0 && (
          <HorizontalScrollRow title="💕 Romance Anime">
            {romanceAnime.items.map(item => (
              <div key={`rom-${item.mal_id}`} className="flex-none w-[160px] md:w-[200px] snap-start">
                <ContentCard id={item.mal_id} type="anime" title={item.title_english || item.title}
                  poster={item.poster} score={item.score} episodes={item.episodes} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}

        {/* Comedy Movies */}
        {comedyMovies && comedyMovies.items.length > 0 && (
          <HorizontalScrollRow title="😂 Comedy Movies">
            {comedyMovies.items.map(item => (
              <div key={`com-${item.tmdb_id}`} className="flex-none w-[160px] md:w-[200px] snap-start">
                <ContentCard id={item.tmdb_id} type="movie" title={item.title}
                  poster={item.poster} score={item.rating} year={item.year} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}
      </div>
    </div>
  );
}
