const express = require("express");
const {
  getStaticData,
  getModelsData,
  getModelChanges,
  getResearchFeed,
  getResearchItem,
  getResearchItemModelReferences,
} = require("../controller/dataController");

const router = express.Router();

router.get("/users", getStaticData);
router.get("/models", getModelsData);
router.get("/models/changes", getModelChanges);
router.get("/research-feed", getResearchFeed);
router.get("/research-feed/:id", getResearchItem);
router.get("/research-feed/:id/model-references", getResearchItemModelReferences);

module.exports = router;
