
import News from "../model/News.js";
import BreakingNews from "../model/BreakingNews.js";
import mongoose from "mongoose";
import slugify from "slugify";

export async function getFeaturedAd(req, res) {
  try {
    const article = await News.findOne({
      published: true,
      featured: true,
    }).sort({ date: -1 });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "No featured ad found",
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured ad",
      error: error.message,
    });
  }
}

export async function getAdminNews(req, res) {
  try {
    const {
      category,
      search,
      published,
      featured,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    if (published === "true" || published === "false") {
      filter.published = published === "true";
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 12, 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    const [articles, total] = await Promise.all([
      News.find(filter)
        .sort({ updatedAt: -1, date: -1 })
        .skip(skip)
        .limit(limitNumber),
      News.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin news",
      error: error.message,
    });
  }
}

export async function getNews(req, res) {
  try {
    const {
      category,
      search,
      featured,
      trending,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {
      published: true,
    };

    if (category) {
      filter.category = new RegExp(
        `^${category}$`,
        "i"
      );
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (trending === "true") {
      filter.trending = true;
    }

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Number(limit), 50);

    const skip =
      (pageNumber - 1) * limitNumber;

    const [articles, total] = await Promise.all([
      News.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNumber),

      News.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch news",
      error: error.message,
    });
  }
}

export async function getNewsById(req, res) {
  try {
    const lookup = mongoose.isValidObjectId(req.params.id)
      ? { _id: req.params.id }
      : { slug: req.params.id };
    const article = await News.findOne({ ...lookup, published: true });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    article.views += 1;

    await article.save();

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch article",
      error: error.message,
    });
  }
}

export async function getNewsBySlug(req, res) {
  try {
    const article = await News.findOne({
      slug: req.params.slug,
      published: true,
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    article.views += 1;

    await article.save();

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch article",
      error: error.message,
    });
  }
}

export async function createNews(req, res) {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      author,
      image,
      location,
      featured,
      trending,
      published,
    } = req.body;

    if (!title || !excerpt || !content || !category || !author) {
      return res.status(400).json({
        message:
          "Title, excerpt, content, category and author are required",
      });
    }

    if (category.trim().length < 2 || category.trim().length > 40) {
      return res.status(400).json({
        message: "Category must be between 2 and 40 characters",
      });
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const existing = await News.findOne({ slug });

    if (existing) {
      return res.status(409).json({
        message: "An article with this title already exists",
      });
    }

    const article = await News.create({
      title,
      slug,
      excerpt,
      content,
      category: category.trim(),
      author,
      authorId: req.user._id,
      image: typeof image === "string" ? image.trim() : "",
      location,
      featured,
      trending,
      published,
    });

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create article",
      error: error.message,
    });
  }
}

export async function updateNews(req, res) {
  try {
    const article = await News.findById(
      req.params.id
    );

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    const allowedFields = [
      "title",
      "excerpt",
      "content",
      "category",
      "author",
      "image",
      "location",
      "featured",
      "trending",
      "published",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        article[field] = field === "category"
          ? String(req.body[field]).trim()
          : req.body[field];
      }
    });

    if (req.body.title) {
      article.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
      });
    }

    await article.save();

    res.json({
      success: true,
      message: "Article updated successfully",
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update article",
      error: error.message,
    });
  }
}

export async function deleteNews(req, res) {
  try {
    const article = await News.findByIdAndDelete(
      req.params.id
    );

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete article",
      error: error.message,
    });
  }
}

export async function getBreakingNews(req, res) {
  try {
    const breaking = await BreakingNews.findOne();
    res.json({
      success: true,
      text: breaking ? breaking.text : "Latest breaking stories from Sierra Leone and around the world.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch breaking news",
      error: error.message,
    });
  }
}

export async function updateBreakingNews(req, res) {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        message: "Breaking news text is required",
      });
    }
    const breaking = await BreakingNews.findOneAndUpdate(
      {},
      { text },
      { upsert: true, new: true }
    );
    res.json({
      success: true,
      message: "Breaking news updated successfully",
      data: breaking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update breaking news",
      error: error.message,
    });
  }
}

