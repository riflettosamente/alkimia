/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Sparkles, Calendar, BookOpen, Lightbulb, Zap, ArrowRight } from "lucide-react";
import type { ArticleData } from "./types";

export default function App() {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchDailyArticle() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/daily-article");
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Formato di risposta non valido dal server.");
        }

        const data: ArticleData = await res.json();
        if (isMounted) {
          setArticle(data);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Errore nel caricamento del saggio:", err);
          setError(err.message || "Impossibile caricare l'articolo odierno.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDailyArticle();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main
      id="daily-article-wrapper"
      className="min-h-screen bg-[#fcfbf9] text-[#24211e] flex flex-col justify-between selection:bg-[#e8dfd3]"
    >
      <div
        id="daily-article-container"
        className="w-full max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-16 md:pb-24"
      >
        {/* Loading State */}
        {loading && (
          <div id="article-loading-state" className="space-y-8 animate-pulse pt-8">
            <div className="flex items-center gap-3 border-b border-[#ece6dc] pb-4">
              <div className="h-4 w-32 bg-[#eee8de] rounded"></div>
              <div className="h-4 w-24 bg-[#eee8de] rounded"></div>
            </div>
            <div className="h-10 w-3/4 bg-[#eee8de] rounded"></div>
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full bg-[#eee8de] rounded"></div>
              <div className="h-4 w-full bg-[#eee8de] rounded"></div>
              <div className="h-4 w-5/6 bg-[#eee8de] rounded"></div>
            </div>
            <div className="space-y-3 pt-6">
              <div className="h-6 w-1/2 bg-[#eee8de] rounded"></div>
              <div className="h-4 w-full bg-[#eee8de] rounded"></div>
              <div className="h-4 w-full bg-[#eee8de] rounded"></div>
              <div className="h-4 w-4/5 bg-[#eee8de] rounded"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div
            id="article-error-state"
            className="py-16 text-center text-[#5c5449] font-editorial"
          >
            <p className="text-xl mb-3">Si è verificato un inconveniente nel caricamento.</p>
            <p className="text-sm font-sans-ui text-[#807669]">{error}</p>
          </div>
        )}

        {/* Article Reading View */}
        {!loading && article && (
          <article id="main-article" className="font-editorial">
            {/* Masthead / Header Info */}
            <header
              id="article-masthead"
              className="border-b border-[#e8e2d7] pb-6 mb-8 sm:mb-10"
            >
              <div className="text-center border-b border-[#ece6dc] pb-5 mb-5">
                <span className="font-sans-ui text-base sm:text-lg font-bold tracking-[0.28em] text-[#1c1917] uppercase inline-block">
                  ALKIMIA
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs sm:text-sm font-sans-ui uppercase tracking-wider text-[#736a5e] mb-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 opacity-75" />
                  {article.formattedDate}
                </span>
                <span className="flex items-center gap-1.5 text-[#857b6d]">
                  <BookOpen className="w-3.5 h-3.5 opacity-75" />
                  {article.readingMinutes} min di lettura
                </span>
              </div>

              {/* Topic Focus Banner */}
              <div
                id="article-topics-banner"
                className="bg-[#f4efe6] rounded-md p-4 sm:p-5 text-xs sm:text-sm font-sans-ui text-[#544b3f] space-y-2 border border-[#e8dfd2]"
              >
                <div className="flex items-center justify-between text-[#7d6c57] font-semibold text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8a7a65] shrink-0" />
                    <span>Esplorazione del giorno</span>
                  </div>
                  <button
                    onClick={async () => {
                      setArticle(null);
                      setLoading(true);
                      try {
                        const res = await fetch(`/api/daily-article?force=true&nextDay=true&t=${Date.now()}`);
                        const data = await res.json();
                        setArticle(data);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="text-[11px] font-sans-ui text-[#8a7a65] hover:text-[#2c251e] underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Rigenera Articolo
                  </button>
                </div>
                <p className="text-base sm:text-lg font-editorial italic text-[#2c251e] leading-relaxed font-medium">
                  "{article.subtitle || `Sintesi delle convergenze concettuali emorse dall'indagine di oggi.`}"
                </p>
              </div>
            </header>

            {/* Main Editorial Text */}
            <div id="article-content-body" className="prose-article">
              <Markdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#161412] mt-0 mb-6 sm:mb-8 font-editorial leading-[1.22]">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1f1b17] mt-10 sm:mt-12 mb-4 pb-2 border-b border-[#e8e2d8] font-editorial">
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => (
                    <p className="mb-5 sm:mb-6 leading-relaxed text-[#292622]">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-[#141210]">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-[#292521]">{children}</em>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-4 my-6 list-decimal list-outside pl-5 text-[#292622]">
                      {children}
                    </ol>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2.5 my-5 list-disc list-outside pl-5 text-[#292622]">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed pl-1">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-[#b5a995] pl-4 sm:pl-5 my-6 italic text-[#4a443c] bg-[#f5f0e8]/40 py-2.5 pr-3 rounded-r">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {article.content}
              </Markdown>
            </div>

            {/* InventBot: Idee Originali & Prototipi Applicativi */}
            {article.inventBotIdeas && article.inventBotIdeas.length > 0 && (
              <section
                id="inventbot-section"
                className="mt-14 sm:mt-16 pt-8 sm:pt-10 border-t border-[#e2d8c9]"
              >
                {/* InventBot Header */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 text-xs font-sans-ui font-semibold tracking-wider uppercase text-[#8a6d4b] mb-2">
                    <Zap className="w-4 h-4 text-[#a67c4e]" />
                    <span>InventBot • Idee Originali & Applicazioni Pratiche</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-editorial text-[#1e1b18] mb-2">
                    Prototipi & Sviluppi Applicativi
                  </h2>
                  <p className="text-sm font-sans-ui text-[#6e6355]">
                    Tre concetti operativi e modelli di innovazione generati a partire dal principio unificante emerso oggi.
                  </p>

                  {/* Synthetic Keyword Pill */}
                  {article.keyword && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-[#f0e8dc] border border-[#dccfb9] rounded-md px-3.5 py-1.5 text-xs sm:text-sm font-sans-ui text-[#42392e]">
                      <span className="text-[#8c7353] font-medium uppercase text-[11px] tracking-wider">
                        Concetto Chiave Sintetico:
                      </span>
                      <strong className="font-semibold text-[#1e1a16] font-editorial text-sm sm:text-base">
                        "{article.keyword}"
                      </strong>
                    </div>
                  )}
                </div>

                {/* Ideas Grid / List */}
                <div className="space-y-4 sm:space-y-5">
                  {article.inventBotIdeas.map((idea, index) => (
                    <div
                      key={index}
                      id={`inventbot-idea-${index + 1}`}
                      className="bg-[#f7f3eb] border border-[#e6dcce] rounded-lg p-4 sm:p-5 text-[#2b2620] transition-colors hover:border-[#cfc0ab]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <span className="text-[11px] font-sans-ui font-semibold uppercase tracking-wider bg-[#eae0d2] text-[#6b5843] px-2.5 py-0.5 rounded">
                          {idea.category}
                        </span>
                        <span className="text-xs font-sans-ui font-medium text-[#8a7f70]">
                          Prototipo #{index + 1}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold font-editorial text-[#191613] mb-2">
                        {idea.title}
                      </h3>

                      <p className="text-sm sm:text-[15px] font-sans-ui text-[#443c32] leading-relaxed mb-3">
                        {idea.description}
                      </p>

                      <div className="flex items-start gap-2 bg-[#ece4d6]/60 border-l-2 border-[#a67c4e] px-3 py-2 rounded-r text-xs sm:text-sm font-sans-ui text-[#423a30]">
                        <ArrowRight className="w-3.5 h-3.5 text-[#8a6d4b] shrink-0 mt-0.5" />
                        <p className="leading-snug">
                          <strong className="font-semibold text-[#2b251e]">Impatto Tangibile: </strong>
                          {idea.impact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Colophon / Bottom Mark */}
            <footer
              id="article-colophon"
              className="mt-14 sm:mt-20 pt-8 border-t border-[#e8e2d7] text-center font-sans-ui text-xs sm:text-sm text-[#8c8273]"
            >
              <div className="w-8 h-px bg-[#cfc5b6] mx-auto mb-4"></div>
              <p className="italic font-editorial text-sm sm:text-base text-[#5c544a]">
                Saggio generato quotidianamente esplorando le intersezioni della conoscenza di confine.
              </p>
              <p className="text-xs text-[#a3998a] mt-1">
                Nuova sintesi disponibile domani
              </p>
            </footer>
          </article>
        )}
      </div>
    </main>
  );
}
