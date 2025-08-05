import {logger} from "../../config/logConfig.js";
import {fetchContentForWebsite} from "../../repository/website.repository.js";

const getContentForWebsite = async (slug) => {
  
  const content = await fetchContentForWebsite(slug);
  logger.info({
    response: "Content fetched successfully",
    // content: content,
  });
  return {message: "Success", content};
};

export {getContentForWebsite};
