const STORAGE_KEY = "shortened_urls";

export function getShortenedUrls() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveShortenedUrls(urls) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  } catch (e) {
    // handle error if needed
  }
}
