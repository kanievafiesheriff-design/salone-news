import Ad from "../model/Ad.js";

export async function getAds(req, res) {
  try {
    const now = new Date();

    const filter = {
      isActive: true,
      startDate: { $lte: now },
    };

    if (req.query.slot) {
      filter.slot = req.query.slot;
    }

    if (req.query.all === "true") {
      // Admin view: get all ads regardless of status or date
      delete filter.isActive;
      delete filter.startDate;
      // Keep slot filter if it was provided even for admin view
    } else {
      // Public view: only active and not expired
      filter.endDate = { $gt: now };
    }

    const ads = await Ad.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: ads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ads",
      error: error.message,
    });
  }
}

export async function trackAdEvent(req, res) {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!type || !["click", "impression"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event type. Must be 'click' or 'impression'",
      });
    }

    const update = {};
    if (type === "click") update.clicks = 1;
    if (type === "impression") update.impressions = 1;

    const ad = await Ad.findByIdAndUpdate(
      id,
      { $inc: update },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    res.json({
      success: true,
      message: `Ad ${type} tracked successfully`,
      data: ad,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to track ad event",
      error: error.message,
    });
  }
}

export async function createAd(req, res) {
  try {
    const {
      title,
      imageUrl,
      externalLink,
      clientName,
      startDate,
      endDate,
      adSize,
    } = req.body;

    if (!title || !imageUrl || !externalLink) {
      return res.status(400).json({
        success: false,
        message: "Title, image URL, and external link are required",
      });
    }

    const ad = await Ad.create({
      title,
      imageUrl,
      externalLink,
      clientName,
      startDate: startDate ? new Date(startDate) : Date.now(),
      endDate: endDate ? new Date(endDate) : undefined,
      adSize: adSize || "default",
    });

    res.status(201).json({
      success: true,
      message: "Ad created successfully",
      data: ad,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create ad",
      error: error.message,
    });
  }
}

export async function updateAd(req, res) {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    const updates = req.body;

    // Handle date conversions if they are provided as strings
    if (updates.startDate) updates.startDate = new Date(updates.startDate);
    if (updates.endDate) updates.endDate = new Date(updates.endDate);

    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Ad updated successfully",
      data: updatedAd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update ad",
      error: error.message,
    });
  }
}

export async function deleteAd(req, res) {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    res.json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete ad",
      error: error.message,
    });
  }
}
