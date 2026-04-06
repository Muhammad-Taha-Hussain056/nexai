const path = require("path");
const fs = require("fs");
const dataDirectory = path.resolve(__dirname, "..", "data");

function readJson(relativePath) {
  const filePath = path.resolve(dataDirectory, relativePath);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function getStaticData(req, res) {
  const filePath = path.resolve(dataDirectory, "users.json");
  res.sendFile(filePath);
}

function getModelsData(req, res) {
  const filePath = path.resolve(dataDirectory, "models.json");
  res.sendFile(filePath);
}

function getModelChanges(req, res) {
  try {
    const parsed = readJson("models.json");
    res.json({ changes: parsed.changes || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to load model changes" });
  }
}

function getResearchFeed(req, res) {
  try {
    const parsed = readJson("research-feed.json");
    res.json({
      feedTitle: parsed.feedTitle,
      updatedAt: parsed.updatedAt,
      items: parsed.items || [],
    });
  } catch (error) {
    console.error("[data] getResearchFeed error:", error.message);
    res.status(500).json({ message: "Failed to load research feed" });
  }
}

function getResearchItem(req, res) {
  try {
    const parsed = readJson("research-feed.json");
    const item = (parsed.items || []).find((entry) => entry.id === req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Research item not found" });
    }
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load research item" });
  }
}

function getResearchItemModelReferences(req, res) {
  try {
    const feed = readJson("research-feed.json");
    const modelsData = readJson("models.json");
    const item = (feed.items || []).find((entry) => entry.id === req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Research item not found" });
    }

    const modelReferences = (item.modelReferences || [])
      .map((modelId) => (modelsData.models || []).find((m) => m.id === modelId))
      .filter(Boolean)
      .map((model) => ({
        id: model.id,
        provider: model.provider,
        model: model.model,
        overview: model.description,
        howToUse: model.howToUse || [],
        pricing: model.pricing || {},
        promptGuide: modelsData.promptGuide || [],
        agentCreation: model.agents || {},
        reviews: model.reviews || [],
      }));

    return res.json({
      researchItemId: item.id,
      title: item.title,
      modelReferences,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load model references" });
  }
}

module.exports = {
  getStaticData,
  getModelsData,
  getModelChanges,
  getResearchFeed,
  getResearchItem,
  getResearchItemModelReferences,
};
