import { useContext, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  Check,
  ChevronDown,
  CirclePlus,
  Clock3,
  Eye,
  FileText,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  PenLine,
  Search,
  Settings,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  X,
  Upload,
} from "lucide-react";
import news from "../data/news";
import AuthContext from "../context/AuthContext";
import { createAdminNews, deleteAdminNews, getAdminNews, updateAdminNews, uploadAdminImage, uploadAdminVideo, uploadAdminAudio, setBreakingNews, getBreakingNews, getSettings, updateSetting } from "../services/newsApi";
import "./AdminDashboard.css";
// ... (rest of the imports)

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Stories", icon: FileText },
  { label: "Audience", icon: Users },
  { label: "Settings", icon: Settings },
];

const filters = ["All stories", "Published", "Drafts", "Featured"];
const categoryOptions = ["Politics", "Business", "Sports", "Technology", "Health", "Education", "Entertainment", "Africa", "Lifestyle"];

function formatViews(value) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function MetricCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <article className={`admin-metric admin-metric-${tone}`}>
      <div className="admin-metric-topline">
        <span className="admin-metric-icon"><Icon size={17} strokeWidth={1.8} /></span>
        <span className="admin-metric-detail">{detail}</span>
      </div>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [activeFilter, setActiveFilter] = useState("All stories");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [stories, setStories] = useState(news);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingVideo, setPendingVideo] = useState(null);
  const [pendingAudio, setPendingAudio] = useState(null);
  const [breakingNewsText, setBreakingNewsText] = useState("");
  const { signOut, user } = useContext(AuthContext);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "Politics", author: user?.name || "Vafie Sheriff", images: [], videoUrl: "", audioUrl: "", location: "Freetown", published: false, featured: false, trending: false, isAd: false, adLink: "" });

  useEffect(() => {
    getAdminNews({ limit: 50 })
      .then((response) => setStories(response.data || []))
      .catch((error) => {
        if (error.message.includes("token") || error.message.includes("Authentication")) signOut();
        setLoadError(error.message);
      })
      .finally(() => setIsLoading(false));

    getBreakingNews()
      .then((response) => setBreakingNewsText(response.text || ""))
      .catch(() => {});
  }, [signOut]);

  const publishedStories = stories.filter((story) => story.published !== false);
  const totalViews = stories.reduce((total, story) => total + story.views, 0);
  const categories = [...new Set(stories.map((story) => story.category))];
  const topStories = [...stories].sort((a, b) => b.views - a.views).slice(0, 4);

  const visibleStories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return stories.filter((story) => {
      const matchesQuery = !normalizedQuery || `${story.title} ${story.category} ${story.author}`.toLowerCase().includes(normalizedQuery);
      const matchesFilter = activeFilter === "All stories"
        || (activeFilter === "Published" && story.published !== false)
        || (activeFilter === "Drafts" && story.published === false)
        || (activeFilter === "Featured" && story.featured);
      return matchesQuery && matchesFilter;
    }).slice(0, 6);
  }, [activeFilter, query, stories]);

  const toggleSelected = (id) => {
    setSelected((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  };

  const toggleAll = () => {
    const visibleIds = visibleStories.map((story) => story.id);
    const allVisibleSelected = visibleIds.every((id) => selected.includes(id));
    setSelected((current) => allVisibleSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : [...new Set([...current, ...visibleIds])]);
  };

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));

  const updateCategory = (event) => {
    const value = event.target.value;
    setIsAddingCategory(value === "__new__");
    setForm((current) => ({ ...current, category: value === "__new__" ? "" : value }));
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPendingImage(file);
    setIsUploadingImage(true);
    setActionError("");
    try {
      const response = await uploadAdminImage(file);
      setForm((current) => ({ ...current, images: [...current.images, response.imageUrl] }));
    } catch (error) {
      setActionError(error.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const uploadVideo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPendingVideo(file);
    setIsUploadingVideo(true);
    setActionError("");
    try {
      const response = await uploadAdminVideo(file);
      setForm((current) => ({ ...current, videoUrl: response.videoUrl }));
    } catch (error) {
      setActionError(error.message);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const uploadAudio = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPendingAudio(file);
    setIsUploadingAudio(true);
    setActionError("");
    try {
      const response = await uploadAdminAudio(file);
      setForm((current) => ({ ...current, audioUrl: response.audioUrl }));
    } catch (error) {
      setActionError(error.message);
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const saveBreakingNews = async () => {
    setActionError("");
    try {
      await setBreakingNews(breakingNewsText);
      alert("Breaking news updated successfully!");
    } catch (error) {
      setActionError(error.message);
    }
  };

  const saveStory = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setActionError("");
    try {
      let article = { ...form };

      if (pendingImage && (!form.images || form.images.length === 0)) {
        setIsUploadingImage(true);
        const uploadResponse = await uploadAdminImage(pendingImage);
        article.images = [uploadResponse.imageUrl];
        setIsUploadingImage(false);
      } else if (pendingImage && form.images) {
        setIsUploadingImage(true);
        const uploadResponse = await uploadAdminImage(pendingImage);
        article.images = [...form.images, uploadResponse.imageUrl];
        setIsUploadingImage(false);
      }

      if (pendingVideo && !form.videoUrl) {
        setIsUploadingVideo(true);
        const uploadResponse = await uploadAdminVideo(pendingVideo);
        article.videoUrl = uploadResponse.videoUrl;
        setIsUploadingVideo(false);
      }

      if (pendingAudio && !form.audioUrl) {
        setIsUploadingAudio(true);
        const uploadResponse = await uploadAdminAudio(pendingAudio);
        article.audioUrl = uploadResponse.audioUrl;
        setIsUploadingAudio(false);
      }

      if (article.isAd && article.published && (!article.images || article.images.length === 0)) {
        throw new Error("Advertisements must have an image to be published.");
      }

      const response = await createAdminNews(article);
      setStories((current) => [response.data, ...current]);
      setIsComposerOpen(false);
      setIsAddingCategory(false);
      setPendingImage(null);
      setPendingVideo(null);
      setPendingAudio(null);
      setForm({ title: "", excerpt: "", content: "", category: "Politics", author: user?.name || "Vafie Sheriff", images: [], videoUrl: "", audioUrl: "", location: "Freetown", published: false, featured: false, trending: false });
    } catch (error) {
      setActionError(error.message);
    } finally {
      setIsUploadingImage(false);
      setIsUploadingVideo(false);
      setIsUploadingAudio(false);
      setIsSaving(false);
    }
  };

  const removeImage = (index) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (index, direction) => {
    setForm((current) => {
      const newImages = [...current.images];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newImages.length) return current;
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      return { ...current, images: newImages };
    });
  };

  const addImageUrl = (url) => {
    if (!url) return;
    setForm((current) => ({ ...current, images: [...current.images, url] }));
  };
\n  const togglePublished = async (story) => {\n    setActionError("");\n    if (story.isAd && story.published === false && (!story.images || story.images.length === 0) && !story.image) {\n      setActionError("Advertisements must have an image to be published.");\n      return;\n    }\n    try {\n      const response = await updateAdminNews(story._id || story.id, {\n        published: story.published === false,\n      });\n      setStories((current) =>\n        current.map((item) =>\n          item._id === story._id || item.id === story.id ? response.data : item\n        )\n      );\n    } catch (error) {\n      setActionError(error.message);\n    }\n  };\n    setActionError("");
    if (story.isAd && story.published === false && !story.image) {
      setActionError("Advertisements must have an image to be published.");
      return;
    }
    try {
      const response = await updateAdminNews(story._id || story.id, { published: story.published === false });
      setStories((current) => current.map((item) => (item._id === story._id || item.id === story.id ? response.data : item)));
    } catch (error) {
      setActionError(error.message);
    }
  };

  const removeStory = async (story) => {
    const storyId = story._id || story.id;
    if (!storyId || !window.confirm(`Delete "${story.title}"? This cannot be undone.`)) return;

    setActionError("");
    try {
      await deleteAdminNews(storyId);
      setStories((current) => current.filter((item) => (item._id || item.id) !== storyId));
      setSelected((current) => current.filter((id) => id !== storyId));
    } catch (error) {
      setActionError(error.message);
    }
  };

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">SN</div>
          <div>
            <strong>SLNEWSBLOG</strong>
            <span>Editorial desk</span>
          </div>
        </div>

        <div className="admin-sidebar-label">Workspace</div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              className={activeNav === label ? "admin-nav-item active" : "admin-nav-item"}
              key={label}
              onClick={() => setActiveNav(label)}
              type="button"
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Stories" && <em>{stories.length}</em>}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-status"><span /> All systems operational</div>
          <button className="admin-user" type="button">
            <span className="admin-avatar">VS</span>
            <span><strong>Vafie Sheriff</strong><small>Administrator</small></span>
            <ChevronDown size={15} />
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-mobile-menu" type="button" aria-label="Open navigation"><Menu size={20} /></button>
          <div className="admin-breadcrumb"><span>Workspace</span><strong>/ {activeNav}</strong></div>
          <div className="admin-topbar-actions">
            <button className="admin-icon-button" type="button" aria-label="Notifications"><Bell size={19} /></button>
            <button className="admin-view-site" type="button" onClick={() => window.open("/", "_self")}>View site <span>↗</span></button>
            <button className="admin-avatar admin-avatar-top" type="button" aria-label="Account menu">VS</button>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-welcome">
            <div>
              <p className="admin-kicker">Tuesday, September 15, 2026 <span>•</span> Freetown</p>
              <h1>Good morning, Vafie.</h1>
              <p className="admin-subtitle">Here&apos;s what&apos;s happening across your newsroom today.</p>
            </div>
            <button className="admin-primary-button" type="button" onClick={() => setIsComposerOpen(true)}><CirclePlus size={17} /> New story</button>
          </section>

          <section className="admin-metrics" aria-label="Newsroom metrics">
            <MetricCard icon={FileText} label="Total stories" value={stories.length} detail="+3 this week" tone="orange" />
            <MetricCard icon={Eye} label="Total views" value={formatViews(totalViews)} detail="+12.8%" tone="green" />
            <MetricCard icon={TrendingUp} label="Published today" value={publishedStories.filter((story) => story.date === "September 15, 2026").length} detail="On schedule" tone="yellow" />
            <MetricCard icon={Activity} label="Active categories" value={categories.length} detail="Across the desk" tone="blue" />
          </section>

          <div className="admin-grid">
            <section className="admin-panel admin-stories-panel">
              <div className="admin-panel-heading">
                <div><p className="admin-panel-kicker">Content library</p><h2>Recent stories</h2></div>
                <button className="admin-quiet-button" type="button" onClick={() => setActiveNav("Stories")}>View all <span>→</span></button>
              </div>
              <div className="admin-toolbar">
                <div className="admin-filter-tabs">
                  {filters.map((filter) => <button className={activeFilter === filter ? "active" : ""} key={filter} onClick={() => setActiveFilter(filter)} type="button">{filter}</button>)}
                </div>
                <label className="admin-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories" aria-label="Search stories" /></label>
              </div>
              {loadError && <div className="admin-selection-bar"><span>{loadError}. Showing local preview data.</span><button type="button" onClick={() => window.location.reload()}>Retry</button></div>}
              {actionError && <div className="admin-selection-bar"><span>{actionError}</span><button type="button" onClick={() => setActionError("")}>Dismiss</button></div>}
              {selected.length > 0 && <div className="admin-selection-bar"><span>{selected.length} selected</span><button type="button" onClick={() => setSelected([])}>Clear selection</button></div>}
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th><input type="checkbox" checked={visibleStories.length > 0 && visibleStories.every((story) => selected.includes(story.id))} onChange={toggleAll} aria-label="Select all visible stories" /></th><th>Story</th><th>Status</th><th>Views</th><th>Published</th><th /></tr></thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="6" className="admin-loading">Loading newsroom stories...</td>
                      </tr>
                    ) : (
                      visibleStories.map((story) => (
                        <tr key={`${story.id}-${story.title}`}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selected.includes(story.id)}
                              onChange={() => toggleSelected(story.id)}
                              aria-label={`Select ${story.title}`}
                            />
                          </td>
                          <td>
                            <div className="admin-story-cell">
                              <img src={story.image} alt="" />
                              <div>
                                <strong>{story.title}</strong>
                                <span>
                                  {story.category} <i>•</i> {story.author}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`admin-status-pill ${
                                story.published === false ? "draft" : "published"
                              }`}
                            >
                              <span />
                              {story.published === false ? "Draft" : "Published"}
                            </span>
                          </td>
                          <td className="admin-views">{formatViews(story.views)}</td>
                          <td className="admin-date">{story.date.replace(", 2026", "")}</td>
                          <td>
                            <div className="admin-row-actions">
                              <button
                                className="admin-row-menu"
                                type="button"
                                onClick={() => togglePublished(story)}
                                aria-label={`${
                                  story.published === false
                                    ? "Publish"
                                    : "Unpublish"
                                } ${story.title}`}
                                title={
                                  story.published === false
                                    ? "Publish story"
                                    : "Unpublish story"
                                }
                              >
                                {story.published === false ? <Check size={18} /> : <MoreHorizontal size={18} />}
                              </button>
                              <button
                                className="admin-row-menu admin-delete-button"
                                type="button"
                                onClick={() => removeStory(story)}
                                aria-label={`Delete ${story.title}`}
                                title="Delete story"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {visibleStories.length === 0 && <div className="admin-empty"><Search size={20} /><strong>No stories found</strong><span>Try another search or filter.</span></div>}
              </div>
            </section>
            <aside className="admin-side-column">
              <section className="admin-panel admin-breaking-news-panel">
                <div className="admin-panel-heading">
                  <div><p className="admin-panel-kicker">Live Feed</p><h2>Breaking News</h2></div>
                  <Bell size={19} className="admin-heading-icon" />
                </div>
                <div className="admin-breaking-news-form">
                  <label>
                    <input
                      value={breakingNewsText}
                      onChange={(e) => setBreakingNewsText(e.target.value)}
                      placeholder="Enter breaking news text..."
                    />
                  </label>
                  <button className="admin-primary-button" onClick={saveBreakingNews}>
                    Update Feed
                  </button>
                </div>
              </section>
              <section className="admin-panel admin-top-stories">
                <div className="admin-panel-heading"><div><p className="admin-panel-kicker">Audience pulse</p><h2>Top stories</h2></div><TrendingUp size={19} className="admin-heading-icon" /></div>
                <div className="admin-top-list">{topStories.map((story, index) => <div className="admin-top-story" key={`${story.id}-${story.title}`}><span className="admin-rank">0{index + 1}</span><div><strong>{story.title}</strong><span><Eye size={13} /> {formatViews(story.views)} views</span></div></div>)}</div>
                <div className="admin-insight"><Sparkles size={16} /><span><strong>Sports is having a moment.</strong> Your football coverage is outperforming the average by 24% this week.</span></div>
              </section>
              <section className="admin-panel admin-schedule-panel"><div className="admin-panel-heading"><div><p className="admin-panel-kicker">Publishing queue</p><h2>Up next</h2></div><Clock3 size={19} className="admin-heading-icon" /></div><div className="admin-schedule"><div><span className="admin-schedule-time">11:30</span><span><strong>Community voices: Bo</strong><small>Features desk</small></span></div><div><span className="admin-schedule-time">14:00</span><span><strong>Evening briefing</strong><small>Politics desk</small></span></div><div><span className="admin-schedule-time">18:30</span><span><strong>Matchday report</strong><small>Sports desk</small></span></div></div></section>
            </aside>
          </div>
        </div>
      </main>
      {isComposerOpen && (
  <>
    <div className="admin-modal-backdrop" role="presentation" onClick={() => setIsComposerOpen(false)}>
      <form className="admin-composer admin-story-form" onSubmit={saveStory} role="dialog" aria-modal="true" aria-labelledby="composer-title" onClick={(event) => event.stopPropagation()}>
        <button className="admin-modal-close" type="button" onClick={() => setIsComposerOpen(false)} aria-label="Close"><X size={19} /></button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}><p className="admin-panel-kicker">Content library</p><h2 id="composer-title">Create a story</h2></div>
          <button className="admin-primary-button" type="submit" disabled={isSaving} style={{ whiteSpace: 'nowrap' }}><PenLine size={16} /> {isSaving ? "Saving..." : form.published ? "Publish story" : "Save draft"}</button>
        </div>
        <label>Headline<input name="title" value={form.title} onChange={updateForm} required /></label>
        <label>Journalist / author<input name="author" value={form.author} onChange={updateForm} placeholder="e.g. Aminata Kamara" required /></label>
        <label>Excerpt<textarea name="excerpt" value={form.excerpt} onChange={updateForm} rows="2" required /></label>
        <label>Story content<textarea name="content" value={form.content} onChange={updateForm} rows="4" required /></label>
        <div className="admin-form-grid">
          <label>Category<select value={isAddingCategory ? "__new__" : form.category} onChange={updateCategory}>{categoryOptions.map((category) => <option key={category}>{category}</option>)}<option value="__new__">+ Add new category</option></select></label>
          {isAddingCategory && <label>New category<input name="category" value={form.category} onChange={updateForm} placeholder="e.g. Climate" minLength="2" maxLength="40" required /></label>}
          <label>Location<input name="location" value={form.location} onChange={updateForm} /></label>
        </div>
        <div className="admin-gallery-section">
          <label>Article Images</label>
          <div className="admin-image-grid">
            {form.images.map((img, index) => (
              <div key={index} className="admin-image-item">
                <img src={img} alt={`Preview ${index + 1}`} />
                <div className="admin-image-controls">
                  <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} title="Move Up">↑</button>
                  <button type="button" onClick={() => moveImage(index, 1)} disabled={index === form.images.length - 1} title="Move Down">↓</button>
                  <button type="button" onClick={() => removeImage(index)} className="admin-delete-btn" title="Remove">×</button>
                </div>
                {index === 0 && <span className="admin-featured-badge">Featured</span>}
              </div>
            ))}
          </div>
          <div className="admin-gallery-actions">
            <div className="admin-upload-group">
              <input
                type="text"
                placeholder="Paste image URL..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addImageUrl(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
            <label className="admin-upload-trigger">
              <Upload size={14} /> Upload file
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={uploadImage}
                disabled={isUploadingImage}
                style={{ display: "none" }}
              />
            </label>
          </div>
          {isUploadingImage && <small className="admin-upload-status">Uploading image...</small>}
        </div>
        <label>Video URL
          <div className="admin-upload-group">
            <input name="videoUrl" value={form.videoUrl} onChange={updateForm} placeholder="https://..." />
            <label className="admin-upload-trigger">
              <Upload size={14} /> Upload file
              <input type="file" accept="video/mp4,video/webm" onChange={uploadVideo} disabled={isUploadingVideo} />
            </label>
          </div>
          {isUploadingVideo && <small className="admin-upload-status">Uploading video...</small>}
          {form.videoUrl && <small className="admin-upload-status success">Video uploaded successfully!</small>}
        </label>
        <label>Audio URL
          <div className="admin-upload-group">
            <input name="audioUrl" value={form.audioUrl} onChange={updateForm} placeholder="https://..." />
            <label className="admin-upload-trigger">
              <Upload size={14} /> Upload file
              <input type="file" accept="audio/mpeg,audio/wav" onChange={uploadAudio} disabled={isUploadingAudio} />
            </label>
          </div>
          {isUploadingAudio && <small className="admin-upload-status">Uploading audio...</small>}
          {form.audioUrl && <small className="admin-upload-status success">Audio uploaded successfully!</small>}
        </label>
        <div className="admin-form-checks">
          <label><input type="checkbox" name="published" checked={form.published} onChange={updateForm} /> Publish now</label>
          <label><input type="checkbox" name="featured" checked={form.featured} onChange={updateForm} /> Featured</label>
          <label><input type="checkbox" name="isAd" checked={form.isAd} onChange={updateForm} /> Mark as Advertisement</label>
        </div>
        {form.isAd && <label>Ad Destination URL<input name="adLink" value={form.adLink} onChange={updateForm} placeholder="https://example.com" /></label>}
      </form>
    </div>
    <label className="admin-upload-dock">
      Upload story image
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadImage} disabled={isUploadingImage} />
      {isUploadingImage && <small>Uploading image...</small>}
      {form.image && <img src={form.image} alt="Selected story preview" />}
    </label>
    <label className="admin-upload-dock">
      Upload story video
      <input type="file" accept="video/mp4,video/webm" onChange={uploadVideo} disabled={isUploadingVideo} />
      {isUploadingVideo && <small>Uploading video...</small>}
      {form.videoUrl && <small className="text-green-600">Video uploaded successfully!</small>}
    </label>
    <label className="admin-upload-dock">
      Upload story audio
      <input type="file" accept="audio/mpeg,audio/wav" onChange={uploadAudio} disabled={isUploadingAudio} />
      {isUploadingAudio && <small>Uploading audio...</small>}
      {form.audioUrl && <small className="text-green-600">Audio uploaded successfully!</small>}
    </label>
  </>
)}
    </div>
  );
}

export default AdminDashboard;
