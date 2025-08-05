import {getContentForWebsite} from "./website.service.js";

const GetContentForWebsite = async (req, res) => {
  const {slug} = req.params;
  const response = await getContentForWebsite(slug);
  res.status(200).json(response);
};

export default {GetContentForWebsite};
