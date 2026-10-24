import {
  getAllAccommodations,
  getAccommodationBySlug,
} from "./accommodationModel.js";

export async function listAccommodations(req, res, next) {
  try {
    const accommodations = await getAllAccommodations();

    res.status(200).json({
      success: true,
      data: accommodations,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAccommodation(req, res, next) {
  try {
    const accommodation = await getAccommodationBySlug(req.params.slug);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: accommodation,
    });
  } catch (error) {
    next(error);
  }
}
