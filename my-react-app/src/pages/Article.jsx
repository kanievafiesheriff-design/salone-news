import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import news from "../data/news";
import { getArticle } from "../services/newsApi";
import { Share2, MessageCircle, Download, ChevronLeft, ChevronRight } from "lucide-react";

export default function Article() {
		const { id } = useParams();
		const [article, setArticle] = useState(() => news.find((item) => String(item.id) === id || item.slug === id));
		const [isLoading, setIsLoading] = useState(true);

		const handleDownload = async (url, filename) => {
			try {
				const response = await fetch(url);
				const blob = await response.blob();
				const blobUrl = window.URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = blobUrl;
				link.download = filename || "audio-clip.mp3";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				window.URL.revokeObjectURL(blobUrl);
			} catch (error) {
				console.error("Download failed:", error);
				window.open(url, "_blank");
			}
		};

		useEffect(() => {
			setIsLoading(true);
			getArticle(id).then((response) => setArticle(response.data)).catch(() => {}).finally(() => setIsLoading(false));
		}, [id]);

		if (isLoading && !article) {
			return <section className="mx-auto max-w-3xl px-4 py-16 text-center"><p className="text-gray-500">Loading story...</p></section>;
		}

		if (!article) {
			return (
				<section className="mx-auto max-w-3xl px-4 py-16 text-center">
					<h1 className="text-4xl font-bold text-gray-900">Story not found</h1>
					<Link className="mt-5 inline-block font-semibold text-green-700 hover:underline" to="/news">
						Browse all news
					</Link>
				</section>
			);
		}

		return (
			<article className="mx-auto max-w-4xl px-4 py-16">
				<p className="text-sm font-bold uppercase tracking-wider text-green-700">{article.category}</p>
				<h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">{article.title}</h1>
				<p className="mt-4 text-sm text-gray-500">{article.date} · {article.author} · {article.location}</p>

				<div className="mt-6 flex items-center gap-3">
					<span className="text-xs font-bold uppercase text-gray-400">Share story:</span>
					<a
						href={`https://wa.me/?text=${encodeURIComponent(article.title + "\\n\\nRead more here: " + window.location.href)}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#128C7E]"
					>
						<MessageCircle size={14} />
						WhatsApp
					</a>
					<button
						onClick={() => {
							navigator.clipboard.writeText(window.location.href);
							alert("Link copied to clipboard!");
						}}
						className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-200"
					>
						<Share2 size={14} />
						Copy Link
					</button>
					{article.audioUrl && (
						<button
							onClick={() => handleDownload(article.audioUrl, `${article.title.replace(/\s+/g, "-").toLowerCase()}.mp3`)}
							className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-200"
						>
							<Download size={14} />
							Download Audio
						</button>
					)}
				</div>

				<img
					src={(article.images && article.images.length > 0)
						? article.images[0]
						: (article.image?.trim() || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=85")}
					alt=""
					className="mt-8 h-80 w-full rounded-xl object-cover md:h-[30rem]"
				/>
				{article.videoUrl && (
					<div className="mt-8">
						<video
							src={article.videoUrl}
							controls
							className="w-full rounded-xl shadow-lg"
							preload="metadata"
						/>
						<p className="mt-2 text-sm text-gray-500 italic text-center">Watch the full report</p>
					</div>
				)}
				<div className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-700">
					<p>{article.excerpt}</p>
					<p className="mt-6">{article.content}</p>
				</div>
			</article>
		);
}
