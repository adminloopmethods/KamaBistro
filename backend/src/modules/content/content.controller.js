import prismaClient from "../../config/dbConfig.js";
import {logger} from "../../config/logConfig.js";
import {
  createWebpageService,
  getAllWebpagesService,
  getWebpageByIdService,
  updateWebpageByIdService,
  findWebpageIdByRouteService,
  getAllContentsService,
  getContentByIdService,
  getAssignedWebpagesService,
  // proposeWebpageVersionService,
  createProposedVersionService,
  getProposedVersionsService,
  deleteProposedVersionService,
  getProposedVersionByIdService,
  getProposedVersionByWebpageIdService,
  rollbackWebpageVersionService,
} from "./content.service.js";

export const createWebpage = async (req, res) => {
  try {
    const {name, contents, route, editedWidth} = req.body;
    const {webpage} = await createWebpageService({
      name,
      contents,
      route,
      editedWidth,
    });
    res.json(webpage);
  } catch (error) {
    logger.error(`Error creating webpage: ${error.message}`, {error});
    res.status(500).json({error: "Failed to create webpage."});
  }
};

export const getAllWebpages = async (req, res) => {
  try {
    let webpages;

    // Check if user is admin (isSuperUser)
    if (req.user.isSuperUser) {
      // Admin gets all webpages
      webpages = await getAllWebpagesService();
    } else {
      // Regular user gets only assigned webpages
      webpages = await getAssignedWebpagesService(req.user.id);
    }

    res.json({webpages});
  } catch (error) {
    logger.error(`Error fetching webpages: ${error.message}`, {error});
    res.status(500).json({error: "Failed to fetch webpages."});
  }
};

export const getWebpageById = async (req, res) => {
  try {
    const {id} = req.params;
    const webpage = await getWebpageByIdService(id);

    if (!webpage) {
      logger.warn(`Webpage with ID '${id}' not found.`);
      return res.status(404).json({error: "Webpage not found."});
    }

    res.json({webpage});
  } catch (error) {
    logger.error(`Error fetching webpage: ${error.message}`, {error});
    res.status(500).json({error: "Failed to fetch webpage."});
  }
};

export const updateWebpageById = async (req, res) => {
  try {
    const {id} = req.params;
    const {name, contents, route, editedWidth, locationId} = req.body;

    const existing = await getWebpageByIdService(id);
    if (!existing) {
      logger.warn(`Webpage with ID '${id}' not found.`);
      return res.status(404).json({error: "Webpage not found."});
    }

    const updatedWebpage = await updateWebpageByIdService(
      id,
      {
        name,
        contents,
        route,
        editedWidth,
        locationId,
      },
      {createVersion: true}
    );
    res.json(updatedWebpage);
  } catch (error) {
    logger.error(`Error updating webpage: ${error.message}`, {error});
    res.status(500).json({error: "Failed to update webpage."});
  }
};

// ---------------- GET WEBPAGE BY ROUTE ----------------
export const getWebpageByRoute = async (req, res) => {
  try {
    const {route} = req.params;
    const {location} = req.query; // frontend sends ?location=<locationId> or nothing

    // Normalize route
    const normalizedRoute = route === "home" ? "/" : `/${route}`;

    // Get the ID from route + location handling
    const id = await findWebpageIdByRouteService(normalizedRoute, location);
    console.log(id);

    if (!id) {
      logger.warn(`Webpage with route '${normalizedRoute}' not found.`);
      return res.status(404).json({error: "Webpage not found."});
    }

    // Fetch webpage by ID
    const webpage = await getWebpageByIdService(id);

    if (!webpage) {
      return res.status(404).json({error: "Webpage not found."});
    }

    res.json({webpage});
  } catch (error) {
    logger.error(`Error fetching webpage by route: ${error.message}`, {error});
    res.status(500).json({error: "Failed to fetch webpage by route."});
  }
};

// ---------------- GET ALL CONTENTS ----------------
export const getAllContentsController = async (req, res) => {
  console.log("on controller");

  try {
    const contents = await getAllContentsService();
    res.json({contents});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Failed to fetch contents"});
  }
};

// ---------------- GET CONTENT BY ID ----------------
export const getContentByIdController = async (req, res) => {
  try {
    const {id} = req.params;
    const content = await getContentByIdService(id);
    if (!content) {
      return res.status(404).json({error: "Content not found"});
    }
    res.json({section: content});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Failed to fetch content"});
  }
};

export const proposeWebpageUpdate = async (req, res) => {
  try {
    const {id} = req.params;
    const {data} = req.body;
    const userId = req.user.id;

    const webpage = await getWebpageByIdService(id);
    if (!webpage) {
      logger.warn(`Webpage with ID '${id}' not found.`);
      return res.status(404).json({error: "Webpage not found."});
    }

    if (webpage.editorId !== userId) {
      return res
        .status(403)
        .json({error: "You are not the editor of this webpage."});
    }

    // Create proposed version
    const proposedVersion = await createProposedVersionService(
      id,
      userId,
      data
    );

    res.json({
      message: "Changes submitted for verification",
      proposedVersion,
    });
  } catch (error) {
    logger.error(`Error proposing webpage update: ${error.message}`, {error});
    res.status(500).json({error: "Failed to propose webpage update."});
  }
};

export const getProposedVersions = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    // Get proposed versions assigned to this verifier
    const proposedVersions = await getProposedVersionsService(userId);

    res.json(proposedVersions);
  } catch (error) {
    logger.error(`Error fetching proposed versions: ${error.message}`, {error});
    res.status(500).json({error: "Failed to fetch proposed versions."});
  }
};

//controller
export const getProposedVersionbyID = async (req, res) => {
  try {
    const {id: webpageId} = req.params;
    const userId = req.user.id;

    // Get proposed version by ID
    const proposedVersion = await getProposedVersionByWebpageIdService(
      webpageId
    );

    // console.log(proposedVersion, "proposedVersion");

    if (!proposedVersion) {
      return res.status(404).json({error: "Proposed version not found."});
    }

    if (proposedVersion.verifierId !== userId) {
      return res
        .status(403)
        .json({error: "You are not the verifier for this proposed version."});
    }

    // Return the version data at the root level for easier consumption
    const response = {
      proposedVersion: {
        id: proposedVersion.id,
        webpageId: proposedVersion.webpageId,
        editorId: proposedVersion.editorId,
        verifierId: proposedVersion.verifierId,
        createdAt: proposedVersion.createdAt,
        updatedAt: proposedVersion.updatedAt,
        version: proposedVersion.version,
      },
    };

    // console.log(response.proposedVersion.version, "response.verison");

    res.json(response);
  } catch (error) {
    logger.error(`Error fetching proposed version: ${error.message}`, {error});
    res.status(500).json({error: "Failed to fetch proposed version."});
  }
};

export const approveProposedVersion = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = req.user.id;

    // Check if user is the verifier for this proposed version
    const proposedVersion = await getProposedVersionByIdService(id);

    if (!proposedVersion) {
      return res.status(404).json({error: "Proposed version not found."});
    }

    if (proposedVersion.verifierId !== userId) {
      return res
        .status(403)
        .json({error: "You are not the verifier for this proposed version."});
    }

    // Apply the proposed changes
    const updatedWebpage = await updateWebpageByIdService(
      proposedVersion.webpageId,
      proposedVersion.version
    );

    // Delete the proposed version
    await deleteProposedVersionService(id);

    res.json({
      message: "Changes approved and published",
      webpage: updatedWebpage,
    });
  } catch (error) {
    logger.error(`Error approving proposed version: ${error.message}`, {error});
    res.status(500).json({error: "Failed to approve proposed version."});
  }
};

export const getWebpageVersions = async (req, res) => {
  try {
    const {id} = req.params;
    const versions = await prismaClient.version.findMany({
      where: {webpageId: id},
      orderBy: {createdAt: "desc"},
    });

    res.json({versions});
  } catch (error) {
    logger.error(`Error fetching versions: ${error.message}`, {error});
    res.status(500).json({error: "Failed to fetch versions"});
  }
};

export const rollbackWebpageVersion = async (req, res) => {
  try {
    const {id, versionId} = req.params;

    // Get the version to roll back to
    const version = await prismaClient.version.findUnique({
      where: {id: versionId},
    });

    if (!version || version.webpageId !== id) {
      return res.status(404).json({error: "Version not found"});
    }

    // Apply the version data to the webpage
    const rolledBackWebpage = await rollbackWebpageVersionService(
      id,
      version.version
    );

    res.json({
      message: "Webpage rolled back successfully",
      webpage: rolledBackWebpage,
    });
  } catch (error) {
    logger.error(`Error rolling back webpage: ${error.message}`, {error});
    res.status(500).json({error: "Failed to roll back webpage"});
  }
};
