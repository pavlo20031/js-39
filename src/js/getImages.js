const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "57656920-4d9e1e1d3d4841e025c43185c";

export async function getImages(search, page) {
  try {
    const res = await fetch(
      `${BASE_URL}?image_type=photo&orientation=horizontal&q=${search}&page=${page}&per_page=12&key=${API_KEY}`,
    );
    if (res.status !== 200) {
      throw new Error("error");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

